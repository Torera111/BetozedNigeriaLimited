import { categories, filters, filterProducts, type ProductFilter } from '../data/content';
import { Icon, SectionHeading } from './Shared';

type ProductsProps = { filter: ProductFilter; onFilter: (filter: ProductFilter) => void; onEnquire: (product: string) => void };

export function Range({ onFilter }: Pick<ProductsProps, 'onFilter'>) {
  return <section className="section range" id="range" aria-label="Explore our range"><div className="container">
    <SectionHeading eyebrow="Explore our range" title="Everything starts with the right material." description="Browse by what your business needs, from daily production to your next advertising project." />
    <div className="category-grid">{categories.map((category) => <article className="category-card" key={category.title}>
      <Icon name={category.icon} /><h3>{category.title}</h3><p>{category.description}</p><span className="category-detail">{category.detail}</span>
      <a className="text-link" href="#products" onClick={() => onFilter(category.filter)} aria-label={`Explore ${category.title.toLowerCase()}`}>Explore category<Icon name="diagonal" /></a>
    </article>)}</div>
  </div></section>;
}

export default function Products({ filter, onFilter, onEnquire }: ProductsProps) {
  const visibleProducts = filterProducts(filter);
  return <section className="section products-section" id="products" aria-label="Product spotlight"><div className="container">
    <SectionHeading eyebrow="Product spotlight" title="Supplies for the work you do." description="Explore our product range. Availability, specifications and pricing are confirmed with your quotation." />
    <div className="product-filters" role="group" aria-label="Filter products">{filters.map((name) => <button className={`filter-button${filter === name ? ' is-active' : ''}`} key={name} type="button" aria-pressed={filter === name} onClick={() => onFilter(name)}>{name}</button>)}</div>
    <p className="sr-only" role="status" aria-live="polite">Showing {visibleProducts.length} {filter.toLowerCase()}.</p>
    <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}>
      <img src={`/images/${product.id}.webp`} alt={product.alt} width="179" height="120" loading="lazy" decoding="async" />
      <div className="product-card-body"><p className="card-eyebrow">{product.category}</p><h3>{product.name}</h3><p className="product-description">{product.description}</p><a className="text-link" href="#enquiry" onClick={() => onEnquire(product.name)} aria-label={`Enquire about ${product.name}`}>Enquire<Icon name="diagonal" /></a></div>
    </article>)}</div>
    <div className="product-footnote"><p>Need a particular size, finish or compatible ink? Include the details in your enquiry.</p><a className="text-link" href="#enquiry">Ask about a product<Icon name="diagonal" /></a></div>
  </div></section>;
}
