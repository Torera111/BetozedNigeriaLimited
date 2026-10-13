import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../src/App';
import Header from '../src/components/Header';
import { EnquiryForm } from '../src/components/Enquiry';

describe('Complete frontend', () => {
  it('renders every section, all 12 products, and valid internal links', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('The materials behind your next great print.');
    const catalogue = screen.getByRole('region', { name: 'Product spotlight' });
    expect(within(catalogue).getAllByRole('article')).toHaveLength(12);
    const expectedSections = ['home', 'range', 'products', 'support', 'applications', 'about', 'faq', 'enquiry'];
    for (const id of expectedSections) expect(document.getElementById(id)).toBeInTheDocument();
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) expect(document.getElementById(href.slice(1))).toBeInTheDocument();
    }
    for (const img of screen.getAllByRole('img')) expect(img).toHaveAttribute('alt');
  });

  it('filters the catalogue and restores the complete range', async () => {
    const user = userEvent.setup();
    render(<App />);
    const catalogue = screen.getByRole('region', { name: 'Product spotlight' });
    await user.click(screen.getByRole('button', { name: 'Consumables' }));
    expect(within(catalogue).getAllByRole('article')).toHaveLength(4);
    expect(within(catalogue).getByRole('heading', { name: 'DTF Powder' })).toBeInTheDocument();
    expect(within(catalogue).queryByRole('heading', { name: 'Flex Banner' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Consumables' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'All products' }));
    expect(within(catalogue).getAllByRole('article')).toHaveLength(12);
  });

  it('category links select the matching filter', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('link', { name: 'Explore advertising materials' }));
    expect(screen.getByRole('button', { name: 'Advertising' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(screen.getByRole('region', { name: 'Product spotlight' })).getAllByRole('article')).toHaveLength(3);
  });

  it('a product enquiry preselects the form without clearing other fields', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText(/Your name/), 'Alao Muqadas');
    await user.click(screen.getByRole('link', { name: 'Enquire about DTF Powder' }));
    expect(screen.getByRole('combobox', { name: /Product interest/ })).toHaveValue('DTF Powder');
    expect(screen.getByLabelText(/Your name/)).toHaveValue('Alao Muqadas');
    await waitFor(() => expect(screen.getByRole('combobox', { name: /Product interest/ })).toHaveFocus());
  });

  it('the FAQ opens, switches questions, and closes accessibly', async () => {
    const user = userEvent.setup();
    render(<App />);
    const first = screen.getByRole('button', { name: 'How do I request a quotation?' });
    const second = screen.getByRole('button', { name: 'What information is useful for an ink enquiry?' });
    expect(first).toHaveAttribute('aria-expanded', 'true');
    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById(second.getAttribute('aria-controls')!)).toBeVisible();
    await user.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'false');
  });

  it('the mobile navigation toggles and Escape returns focus to its button', async () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({ matches: true, media: query, onchange: null, addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(), addListener: vi.fn(), removeListener: vi.fn() }));
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole('button', { name: 'Open navigation' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const nav = screen.getByRole('navigation', { name: 'Main navigation' });
    await user.click(within(nav).getByRole('link', { name: 'Products' }));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    fireEvent.keyDown(nav, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
    matchMedia.mockRestore();
  });
});

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Your name/), 'Alao Muqadas');
  await user.type(screen.getByLabelText(/Email address/), 'alao@example.com');
  await user.type(screen.getByLabelText(/Your requirements/), '10 rolls for outdoor signage');
  await user.click(screen.getByRole('checkbox'));
}

describe('Enquiry interactions', () => {
  it('blocks an incomplete form before any submission', async () => {
    const submitter = vi.fn();
    const user = userEvent.setup();
    render(<EnquiryForm interest="Flex Banner" onInterest={vi.fn()} submitter={submitter} />);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(submitter).not.toHaveBeenCalled();
  });

  it('prepares a downloadable enquiry and states that it has not been sent', async () => {
    const user = userEvent.setup();
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    render(<EnquiryForm interest="Flex Banner" onInterest={vi.fn()} />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(await screen.findByText('Your enquiry is ready. It has not been sent.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Download your enquiry' })).toHaveAttribute('download', 'Betozed-Enquiry.txt');
    expect(fetcher).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText(/Your requirements/), ' with a matte finish');
    expect(screen.queryByText('Your enquiry is ready. It has not been sent.')).not.toBeInTheDocument();
  });

  it('keeps entered data and shows a failed delivery without a success message', async () => {
    const user = userEvent.setup();
    const submitter = vi.fn().mockRejectedValue(new Error('Your enquiry could not be sent. Please try again.'));
    render(<EnquiryForm interest="Flex Banner" onInterest={vi.fn()} submitter={submitter} />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('could not be sent');
    expect(screen.getByLabelText(/Your name/)).toHaveValue('Alao Muqadas');
    expect(screen.queryByText(/Your enquiry has been sent/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send enquiry' })).toBeEnabled();
  });

  it('blocks repeat submissions while delivery is pending', async () => {
    let resolve!: (value: { mode: 'sent' }) => void;
    const submitter = vi.fn(() => new Promise<{ mode: 'sent' }>((r) => { resolve = r; }));
    const user = userEvent.setup();
    render(<EnquiryForm interest="Flex Banner" onInterest={vi.fn()} submitter={submitter} />);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(screen.getByRole('button', { name: 'Preparing enquiry…' })).toBeDisabled();
    fireEvent.submit(screen.getByRole('form', { name: 'Request a quotation' }));
    expect(submitter).toHaveBeenCalledTimes(1);
    resolve({ mode: 'sent' });
    expect(await screen.findByText(/Your enquiry has been sent/)).toBeInTheDocument();
  });

  it('reports oversized references and lets the user choose a replacement', async () => {
    const user = userEvent.setup();
    render(<EnquiryForm interest="Flex Banner" onInterest={vi.fn()} />);
    const upload = screen.getByLabelText(/Add a reference or specification/);
    const largeFile = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large.pdf', { type: 'application/pdf' });
    await user.upload(upload, largeFile);
    expect(screen.getByRole('alert')).toHaveTextContent('10 MB or smaller');
    await user.upload(upload, new File(['brief'], 'brief.pdf', { type: 'application/pdf' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('brief.pdf')).toBeInTheDocument();
  });
});
