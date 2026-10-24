import { useEffect, useRef, useState, type FormEvent } from 'react';
import { categories, enquiryChecklist, products } from '../data/content';
import { formatEnquiry, MAX_REFERENCE_SIZE, readEnquiry, submitEnquiry, validateEnquiry, type Enquiry, type SubmissionResult } from '../lib/enquiry';
import { CheckList, Icon, SectionHeading } from './Shared';

type EnquiryProps = { interest: string; onInterest: (value: string) => void; submitter?: (enquiry: Enquiry) => Promise<SubmissionResult> };

export default function EnquirySection(props: EnquiryProps) {
  return <section className="section enquiry-section" id="enquiry" aria-label="Request a quotation"><div className="container enquiry-grid">
    <div className="enquiry-intro"><SectionHeading eyebrow="Let's talk materials" title="Tell us what your next job needs." description="Request a quotation or ask about a product. A few details about your business and specifications will help shape the conversation." /><div className="enquiry-checklist"><p>A useful enquiry includes</p><CheckList items={enquiryChecklist} /></div><p className="enquiry-disclaimer">Availability, specifications, pricing and supply arrangements are confirmed before an order is placed.</p></div>
    <EnquiryForm {...props} />
  </div></section>;
}

export function EnquiryForm({ interest, onInterest, submitter = submitEnquiry }: EnquiryProps) {
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [submittedInterest, setSubmittedInterest] = useState('');
  const [prepared, setPrepared] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const inFlight = useRef(false);

  useEffect(() => {
    if (!prepared) { setDownloadUrl(''); return; }
    const url = URL.createObjectURL(new Blob([prepared], { type: 'text/plain;charset=utf-8' }));
    setDownloadUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [prepared]);

  const clearResult = () => { setResult(null); setPrepared(null); setError(''); };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !event.currentTarget.reportValidity()) return;
    const enquiry = readEnquiry(event.currentTarget);
    const validationError = validateEnquiry(enquiry);
    clearResult();
    if (validationError) { setError(validationError); return; }
    inFlight.current = true;
    setBusy(true);
    try {
      const response = await submitter(enquiry);
      setSubmittedInterest(enquiry.product);
      setResult(response);
      if (response.mode === 'prepared') setPrepared(formatEnquiry(enquiry));
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Your enquiry could not be sent. Please try again.');
    } finally { inFlight.current = false; setBusy(false); }
  }

  return <form className="enquiry-form" onSubmit={handleSubmit} onChangeCapture={clearResult} aria-labelledby="form-title" aria-busy={busy}>
    <h3 id="form-title">Request a quotation</h3><p className="form-required">Fields marked * are required.</p>
    <fieldset className="enquiry-fields" disabled={busy}><legend className="sr-only">Enquiry details</legend>
    <div className="form-grid">
      <div className="form-field"><label htmlFor="customer-name">Your name <span aria-hidden="true">*</span></label><input id="customer-name" name="name" placeholder="Full name" autoComplete="name" required maxLength={120} /></div>
      <div className="form-field"><label htmlFor="company">Company / business</label><input id="company" name="company" placeholder="Business name" autoComplete="organization" maxLength={180} required /></div>
      <div className="form-field"><label htmlFor="email">Email address <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required maxLength={254} /></div>
      <div className="form-field"><label htmlFor="phone">Phone number <span aria-hidden="true">*</span></label><input id="phone" name="phone" type="tel" placeholder="Your contact number" autoComplete="tel" maxLength={50} required /></div>
      <div className="form-field"><label htmlFor="product-interest">Product interest <span aria-hidden="true">*</span></label><div className="select-wrap"><select id="product-interest" name="product" value={interest} required onChange={(event) => onInterest(event.target.value)}><option value="" disabled>Select a product or category</option><optgroup label="Categories">{categories.map((category) => <option key={category.title} value={category.title}>{category.title}</option>)}</optgroup><optgroup label="Products">{products.map((product) => <option key={product.id} value={product.name}>{product.name}</option>)}</optgroup><option value="Other / Not sure">Other / Not sure</option></select><Icon name="chevron" /></div></div>
      <div className="form-field"><label htmlFor="quantity">Quantity / size <span aria-hidden="true">*</span></label><input id="quantity" name="quantity" placeholder="e.g. 3kg DTF Powder, 3 bottles of 1000ml Sublimation ink " maxLength={160} /></div>
      <div className="form-field form-field--full"><label htmlFor="location">Location  <span aria-hidden="true">*</span></label><input id="location" name="location" placeholder="City and state" autoComplete="address-level2" maxLength={180} /></div>
      <div className="form-field form-field--full"><label htmlFor="requirements">Your requirements <span aria-hidden="true">*</span></label><textarea id="requirements" name="requirements" placeholder="Tell us about the material, application, finish, printer model or other specifications you need." rows={5} required maxLength={5000} /></div>
    </div>
    <div className="reference-upload"><input className="sr-only" type="file" id="reference" name="reference" accept=".jpg,.jpeg,.png,.webp,.pdf" aria-describedby="reference-help" onChange={(event) => {
      const file = event.target.files?.[0];
      if (file && file.size > MAX_REFERENCE_SIZE) { event.target.value = ''; setFileName(''); setError('Your reference must be 10 MB or smaller.'); return; }
      setFileName(file?.name ?? '');
    }} /><label className="reference-label" htmlFor="reference"><Icon name="paperclip" /><span><strong>{fileName || 'Add a reference or specification'}</strong><span id="reference-help">Optional — a product photo or brief can help. JPG, PNG, WebP or PDF; up to 10 MB.</span></span></label></div>
    <label className="consent-label"><input type="checkbox" name="consent" required /><span>You may contact me about this enquiry. My details will be used to respond to my request.</span></label>
    </fieldset>
    {error && <p className="form-error" role="alert">{error}</p>}
    {result && submittedInterest === interest && <div className="form-result" role="status" aria-live="polite">{result.mode === 'sent' ? <p>Your enquiry has been sent. Thank you for sharing your requirements.</p> : <><p>Your enquiry is ready. It has not been sent.</p><a className="text-link" href={downloadUrl} download="Betozed-Enquiry.txt">Download your enquiry<Icon name="diagonal" /></a>{fileName && <p className="result-reference">Include your selected reference separately with the downloaded enquiry.</p>}</>}</div>}
    <button className="button button--primary submit-button" type="submit" disabled={busy}>{busy ? 'Preparing enquiry…' : 'Send enquiry'}<Icon name="arrow" /></button>
    {!import.meta.env.VITE_ENQUIRY_ENDPOINT && <p className="preview-note">Preview mode: prepare and download your enquiry. No message is sent.</p>}
  </form>;
}
