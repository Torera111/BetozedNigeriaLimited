import { aboutChecklist } from '../data/content';
import { CheckList, SectionHeading } from './Shared';

export default function About() {
  return <section className="section about-section" id="about" aria-label="About Betozed"><div className="container about-grid">
    <figure className="about-figure"><img src="/images/about-workshop.webp" alt="Rolls of printing material and ink bottles in a well-stocked workshop" width="324" height="239" loading="lazy" decoding="async" /><figcaption>Printing materials. Consumables. Advertising essentials.</figcaption></figure>
    <div className="about-copy"><SectionHeading eyebrow="About Betozed" title="A practical supply partner for print businesses." />
      <p>Betozed Nigeria Limited specialises in the sales of printing materials, printing consumables and advertising materials. Our focus is the supplies behind professional print production and visual communication.</p>
      <p>From selecting materials for a new application to planning a repeat purchase, start with your requirements. Tell us what you are producing and what matters to your business.</p>
      <CheckList items={aboutChecklist} />
    </div>
  </div></section>;
}
