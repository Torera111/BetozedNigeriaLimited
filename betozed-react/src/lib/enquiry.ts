export type Enquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  location: string;
  requirements: string;
  consent: boolean;
  reference: File | null;
};

export type SubmissionResult = { mode: 'prepared' | 'sent' };
export const MAX_REFERENCE_SIZE = 10 * 1024 * 1024;

export function readEnquiry(form: HTMLFormElement): Enquiry {
  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? '').trim();
  const reference = data.get('reference');
  return { name: value('name'), company: value('company'), email: value('email'), phone: value('phone'), product: value('product'), quantity: value('quantity'), location: value('location'), requirements: value('requirements'), consent: data.get('consent') === 'on', reference: reference instanceof File && reference.size > 0 ? reference : null };
}

export function validateEnquiry(enquiry: Enquiry): string | null {
  if (!enquiry.name.trim() || !enquiry.email.trim() || !enquiry.product.trim() || !enquiry.requirements.trim()) return 'Please complete your name, email, product interest and requirements.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) return 'Please enter a valid email address.';
  if (!enquiry.consent) return 'Please confirm that you may be contacted about this enquiry.';
  if (enquiry.reference && enquiry.reference.size > MAX_REFERENCE_SIZE) return 'Your reference must be 10 MB or smaller.';
  return null;
}

export function formatEnquiry(enquiry: Enquiry) {
  return [
    'BETOZED NIGERIA LIMITED — PRODUCT ENQUIRY', '',
    `Name: ${enquiry.name}`, `Company / business: ${enquiry.company || 'Not provided'}`,
    `Email: ${enquiry.email}`, `Phone: ${enquiry.phone || 'Not provided'}`,
    `Product interest: ${enquiry.product}`, `Quantity / size: ${enquiry.quantity || 'Not provided'}`,
    `Location: ${enquiry.location || 'Not provided'}`, '', 'Requirements:', enquiry.requirements, '',
    `Reference: ${enquiry.reference?.name || 'None'}`,
    'Contact permission: granted', '',
    'Prepared locally. This enquiry has not been sent. Supply a selected reference separately with this text.',
  ].join('\n');
}

// Configure a real form handler to enable delivery. No request is made in preview mode.
export async function submitEnquiry(enquiry: Enquiry, endpoint = import.meta.env.VITE_ENQUIRY_ENDPOINT): Promise<SubmissionResult> {
  const error = validateEnquiry(enquiry);
  if (error) throw new Error(error);
  if (!endpoint?.trim()) return { mode: 'prepared' };

  const body = new FormData();
  for (const [key, value] of Object.entries(enquiry)) {
    if (key === 'reference') continue;
    body.append(key, String(value));
  }
  if (enquiry.reference) body.append('reference', enquiry.reference);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(endpoint, { method: 'POST', body, signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Your enquiry could not be sent. Please try again.');
    return { mode: 'sent' };
  } catch (error) {
    if (controller.signal.aborted) throw new Error('The request timed out. Please try again.');
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
