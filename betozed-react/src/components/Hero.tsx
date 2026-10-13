import { ButtonLink, Icon } from './Shared';

const benefits = [
  { icon: 'layers', title: 'Materials for every application', detail: 'From banners to garment printing' },
  { icon: 'droplets', title: 'Production essentials', detail: 'Inks, powders and finishing supplies' },
  { icon: 'messages', title: 'Business-focused enquiries', detail: 'Specifications first. Clear next steps.' },
] as const;

export default function Hero() {
  return <>
    <section className="hero section" id="home" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Betozed Nigeria Limited</p>
          <h1 id="hero-title">The materials behind your next great print.</h1>
          <p className="hero-description">Printing materials, consumables and advertising essentials for the businesses that bring ideas to life. Find your supplies and tell us what your next project needs.</p>
          <div className="hero-actions"><ButtonLink>Request a quotation</ButtonLink><ButtonLink variant="secondary" href="#products">Explore products</ButtonLink></div>
          <p className="hero-note"><Icon name="clipboard" /><span>Share your material, quantity and application for a tailored quote.</span></p>
        </div>
        <figure className="hero-figure"><img className="hero-image" src="/images/hero-printer.webp" alt="Large-format printer producing colourful graphics in a print workshop" width="391" height="268" fetchPriority="high" /><figcaption><span>From material to finished impact</span><span className="caption-rule" /></figcaption></figure>
      </div>
    </section>
    <div className="benefit-strip"><div className="container benefit-grid">{benefits.map((benefit) => <div className="benefit" key={benefit.title}><Icon name={benefit.icon} /><div><p>{benefit.title}</p><span>{benefit.detail}</span></div></div>)}</div></div>
  </>;
}
