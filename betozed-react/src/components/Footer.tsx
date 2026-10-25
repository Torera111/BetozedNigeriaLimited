import { categories, navigation, type ProductFilter } from '../data/content';
import { ButtonLink, Logo } from './Shared';

export default function Footer({ onFilter }: { onFilter: (filter: ProductFilter) => void }) {
  return <>
    <section className="closing-cta" aria-labelledby="closing-title"><div className="container closing-inner"><div><h2 id="closing-title">Ready for your next print run?</h2><p>Start with the right supplies. Let’s discuss the materials your business needs.</p></div><ButtonLink>Request a quotation</ButtonLink></div></section>
    <footer className="site-footer"><div className="container"><div className="footer-grid">
      <div className="footer-brand"><a className="brand-link" href="#home" aria-label="Betozed Nigeria Limited home"><Logo /></a><p className="footer-company">Betozed Nigeria Limited</p>
      <p className="company-registration">RC: 1476823</p><p>Printing materials, printing consumables and advertising materials for professional and business applications.</p></div>
      <nav className="footer-links" aria-label="Explore"><h3>Explore</h3>{navigation.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
      <nav className="footer-links" aria-label="Our range"><h3>Our range</h3>{categories.map((category) => <a href="#products" key={category.title} onClick={() => onFilter(category.filter)}>{category.title}</a>)}<a href="#products" onClick={() => onFilter('Printing materials')}>Garment &amp; textile supplies</a></nav>
      <nav className="footer-links" aria-label="Enquiries"><h3>Enquiries</h3>{['Request a quotation', 'Product questions', 'Business supply enquiries', 'Contact through our form'].map((label) => <a href="#enquiry" key={label}>{label}</a>)}</nav>
    </div><div className="footer-bottom"><p>© 2026 Betozed Nigeria Limited. All rights reserved.</p><p>Product specifications confirmed on enquiry.</p></div></div></footer>
  </>;
}
