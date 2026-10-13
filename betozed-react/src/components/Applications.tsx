import { applications, type ProductFilter } from '../data/content';
import { Icon, SectionHeading } from './Shared';

export default function Applications({ onFilter }: { onFilter: (filter: ProductFilter) => void }) {
  return <section className="section applications-section" id="applications" aria-label="Materials in application"><div className="container">
    <SectionHeading eyebrow="Materials in application" title="From a blank surface to a bold statement." description="See how print and advertising materials can come together. These illustrative applications help you describe the result you want." />
    <div className="application-grid">{applications.map((application) => <article className="application-card" key={application.id}><img src={`/images/application-${application.id}.webp`} alt={application.alt} width="245" height="171" loading="lazy" decoding="async" /><p className="card-eyebrow">{application.category}</p><h3>{application.title}</h3><p className="application-description">{application.description}</p><a className="text-link" href="#products" onClick={() => onFilter(application.filter)}>{application.link}<Icon name="diagonal" /></a></article>)}</div>
  </div></section>;
}
