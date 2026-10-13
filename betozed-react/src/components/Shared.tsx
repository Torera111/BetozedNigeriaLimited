import type { ReactNode } from 'react';

export type IconName = 'arrow' | 'diagonal' | 'layers' | 'droplets' | 'flag' | 'messages' | 'clipboard' | 'check' | 'info' | 'paperclip' | 'menu' | 'close' | 'plus' | 'minus' | 'chevron';

const paths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  diagonal: <><path d="M7 17 17 7M7 7h10v10" /></>,
  layers: <><path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" /></>,
  droplets: <><path d="M14 3c0 5 6 7 6 12a6 6 0 0 1-9 5M6 5c0 3-4 5-4 8a4 4 0 0 0 8 0c0-3-4-5-4-8Z" /></>,
  flag: <><path d="M4 22V3M4 4c5-5 9 5 16 0v11c-7 5-11-5-16 0" /></>,
  messages: <><path d="M15 14H5l-3 3V3h15v7M8 18h9l4 3V9h-4" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="17" rx="2" /><rect x="9" y="2" width="6" height="4" rx="1" /><path d="M9 11h6M9 15h6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v.1" /></>,
  paperclip: <path d="m8 15 8-8a3 3 0 0 1 4 4L10 21a5 5 0 0 1-7-7L13 4a4 4 0 0 1 6 6l-9 9a2 2 0 0 1-3-3l9-9" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  chevron: <path d="m6 9 6 6 6-6" />,
};

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg className={`icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Logo() {
  return <img className="brand-logo" src="/images/logo.png" alt="Betozed Nigeria Limited" width="194" height="66" />;
}

export function ButtonLink({ children, href = '#enquiry', variant = 'primary', className = '' }: { children: ReactNode; href?: string; variant?: 'primary' | 'secondary'; className?: string }) {
  return <a className={`button button--${variant} ${className}`} href={href}>{children}<Icon name="arrow" /></a>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p className="section-description">{description}</p>}</div>;
}

export function CheckList({ items }: { items: readonly string[] }) {
  return <ul className="check-list">{items.map((item) => <li key={item}><Icon name="check" /><span>{item}</span></li>)}</ul>;
}
