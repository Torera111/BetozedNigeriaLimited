import { useEffect, useRef, useState } from 'react';
import { navigation } from '../data/content';
import { Icon, Logo } from './Shared';

export default function Header() {
  const [mobile, setMobile] = useState(() => window.matchMedia?.('(max-width: 640px)').matches ?? false);
  const [override, setOverride] = useState<boolean | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const expanded = override ?? !mobile;

  useEffect(() => {
    const query = window.matchMedia('(max-width: 640px)');
    const update = () => { setMobile(query.matches); setOverride(null); };
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && expanded) { setOverride(false); toggleRef.current?.focus(); }
    }}>
      <div className="topbar"><div className="container topbar-inner"><span>Printing materials / Consumables / Advertising materials</span><span className="topbar-audience">For print professionals &amp; businesses</span></div></div>
      <div className="container header-inner">
        <a className="brand-link" href="#home" aria-label="Betozed Nigeria Limited home"><Logo /></a>
        <nav className="main-nav" id="main-navigation" aria-label="Main navigation" data-expanded={expanded}>
          {navigation.map((item) => <a key={item.href} href={item.href} onClick={() => { if (mobile) setOverride(false); }}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <a className="button button--primary header-quote" href="#enquiry">Get a quote<Icon name="arrow" /></a>
          <button ref={toggleRef} className="menu-toggle" type="button" aria-label={expanded ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={expanded} onClick={() => setOverride(!expanded)}><Icon name={expanded && mobile ? 'close' : 'menu'} /></button>
        </div>
      </div>
    </header>
  );
}
