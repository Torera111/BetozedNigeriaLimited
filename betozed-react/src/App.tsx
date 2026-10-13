import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Products, { Range } from './components/Products';
import Support from './components/Support';
import Applications from './components/Applications';
import About from './components/About';
import Faq from './components/Faq';
import EnquirySection from './components/Enquiry';
import Footer from './components/Footer';
import type { ProductFilter } from './data/content';

export default function App() {
  const [filter, setFilter] = useState<ProductFilter>('All products');
  const [interest, setInterest] = useState('');

  function enquire(product: string) {
    setInterest(product);
    window.requestAnimationFrame(() => document.getElementById('product-interest')?.focus({ preventScroll: true }));
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main" tabIndex={-1}>
      <Hero /><Range onFilter={setFilter} /><Products filter={filter} onFilter={setFilter} onEnquire={enquire} /><Support /><Applications onFilter={setFilter} /><About /><Faq /><EnquirySection interest={interest} onInterest={setInterest} />
    </main>
    <Footer onFilter={setFilter} />
  </>;
}
