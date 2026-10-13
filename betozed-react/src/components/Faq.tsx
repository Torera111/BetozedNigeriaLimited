import { useState } from 'react';
import { faqItems } from '../data/content';
import { Icon, SectionHeading } from './Shared';

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return <section className="section faq-section" id="faq" aria-label="Frequently asked questions"><div className="container">
    <div className="faq-grid"><div className="faq-intro"><SectionHeading eyebrow="Good to know" title="Your questions, before you enquire." description="A few practical details to help you prepare your product or supply enquiry." /><a className="text-link" href="#enquiry">Send us your question<Icon name="diagonal" /></a></div>
      <div className="faq-list">{faqItems.map((item, index) => <div className="faq-item" key={item.question}><h3><button type="button" className="faq-question" id={`faq-question-${index}`} aria-expanded={open === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpen(open === index ? null : index)}><span>{item.question}</span><Icon name={open === index ? 'minus' : 'plus'} /></button></h3><div className="faq-answer" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} hidden={open !== index}><p>{item.answer}</p></div></div>)}</div>
    </div>
    <div className="info-note"><Icon name="info" /><p>For ink compatibility, share your printer model. For bulk supply, include quantities and frequency. Add your location to discuss collection or delivery, and describe the application if you need help choosing a material.</p></div>
  </div></section>;
}
