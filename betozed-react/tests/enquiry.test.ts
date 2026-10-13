import { describe, expect, it, vi } from 'vitest';
import { formatEnquiry, submitEnquiry, validateEnquiry, type Enquiry } from '../src/lib/enquiry';

const sample: Enquiry = { name: 'Alao Muqadas', company: 'teewai', email: 'alao@example.com', phone: '', product: 'Flex Banner', quantity: '10 rolls', location: 'Ogbomoso', requirements: 'Outdoor signs, matte finish', consent: true, reference: null };

describe('Enquiry delivery adapter', () => {
  it('validates whitespace, email and contact permission', () => {
    expect(validateEnquiry({ ...sample, name: '   ' })).toMatch(/complete/);
    expect(validateEnquiry({ ...sample, email: 'invalid-email' })).toMatch(/valid email/);
    expect(validateEnquiry({ ...sample, consent: false })).toMatch(/confirm/);
    expect(validateEnquiry(sample)).toBeNull();
  });

  it('never calls a network service when the endpoint is absent', async () => {
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    expect(await submitEnquiry(sample, '')).toEqual({ mode: 'prepared' });
    expect(fetcher).not.toHaveBeenCalled();
    expect(formatEnquiry(sample)).toContain('This enquiry has not been sent');
    expect(formatEnquiry(sample)).toContain('Quantity / size: 10 rolls');
  });

  it('sends configured delivery as multipart data, including a reference', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetcher);
    const reference = new File(['brief'], 'brief.pdf', { type: 'application/pdf' });
    expect(await submitEnquiry({ ...sample, reference }, '/api/enquiries')).toEqual({ mode: 'sent' });
    const [url, options] = fetcher.mock.calls[0];
    expect(url).toBe('/api/enquiries');
    expect(options.method).toBe('POST');
    expect(options.body.get('product')).toBe('Flex Banner');
    expect(options.body.get('reference').name).toBe('brief.pdf');
    expect(options.headers).not.toHaveProperty('Content-Type');
  });

  it('does not report delivery success for a rejected HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 500 })));
    await expect(submitEnquiry(sample, '/api/enquiries')).rejects.toThrow('could not be sent');
  });

  it('aborts stalled delivery and clears its timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn((_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))))));
    try {
      const request = submitEnquiry(sample, '/api/enquiries');
      const rejection = expect(request).rejects.toThrow('timed out');
      await vi.advanceTimersByTimeAsync(20_000);
      await rejection;
      expect(vi.getTimerCount()).toBe(0);
    } finally { vi.useRealTimers(); }
  });
});
