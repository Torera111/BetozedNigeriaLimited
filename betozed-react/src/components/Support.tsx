import { supportSteps } from '../data/content';
import { ButtonLink } from './Shared';

export default function Support() {
  return <section className="section support-section" id="support" aria-labelledby="support-title"><div className="container">
    <div className="support-heading"><div><p className="eyebrow">Supply &amp; support</p><h2 id="support-title">Built around your business requirements.</h2></div><div className="support-intro"><p>Whether you run a print shop, create signage or source materials for a brand, a clear specification is the starting point for a useful quotation.</p><ButtonLink variant="secondary">Discuss your requirements</ButtonLink></div></div>
    <div className="support-steps">{supportSteps.map((step, index) => <article key={step.title}><span className="step-number">0{index + 1} /</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
    <ul className="audience-tags" aria-label="Businesses we support">{['Print shops', 'Sign makers', 'Garment decorators', 'Agencies & business buyers'].map((audience) => <li key={audience}>{audience}</li>)}</ul>
  </div></section>;
}
