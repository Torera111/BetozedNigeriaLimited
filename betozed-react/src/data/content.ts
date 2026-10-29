export const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'Products', href: '#products' },
  { label: 'Supply & support', href: '#support' },
  { label: 'Applications', href: '#applications' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
] as const;

export const filters = ['All products', 'Printing materials', 'Consumables', 'Advertising'] as const;
export type ProductFilter = (typeof filters)[number];

export type Product = {
  id: string;
  name: string;
  category: string;
  filter: Exclude<ProductFilter, 'All products'>;
  description: string;
  alt: string;
};

export const products: Product[] = [
  { id: 'flex-banner', name: 'Flex Banner', category: 'Printing material', filter: 'Printing materials', description: 'Large-format media for banners and outdoor graphics.', alt: 'White flex banner material rolls on a print workshop table' },
  { id: 'flex-flock', name: 'Flex and Flock materials', category: 'Transfer material', filter: 'Printing materials', description: 'Transfer materials for garment graphics and lettering.', alt: 'Colourful rolls of garment transfer material' },
  { id: 'plotting', name: 'Plotting', category: 'Signage material', filter: 'Advertising', description: 'Materials for cut lettering, decals and display graphics.', alt: 'A cutting plotter with navy blue material and cut lettering' },
  { id: 'dtf-powder', name: 'DTF Powder', category: 'Consumable', filter: 'Consumables', description: 'Adhesive powder for direct-to-film transfer workflows.', alt: 'A bag of white DTF adhesive powder and a measuring spoon' },
  { id: 'dtf-ink', name: 'DTF ink', category: 'Printing ink', filter: 'Consumables', description: 'Ink enquiries for your direct-to-film printing setup.', alt: 'Bottles of direct-to-film printing ink' },
  { id: 'monogram', name: 'Monogram', category: 'Embroidery', filter: 'Printing materials', description: 'Discuss materials for embroidered names and branding.', alt: 'Embroidery thread spools arranged around a navy polo shirt' },
  { id: 'feather-banner', name: 'Feather Banner', category: 'Advertising material', filter: 'Advertising', description: 'Display materials for events and business visibility.', alt: 'Two feather banner displays with navy and orange graphics' },
  { id: 'laminating-film', name: 'Laminating Film', category: 'Finishing material', filter: 'Printing materials', description: 'Film for protecting and finishing printed graphics.', alt: 'Two rolls of clear laminating film' },
  { id: 'sublimation-ink', name: 'Sublimation Ink', category: 'Printing ink', filter: 'Consumables', description: 'Ink for sublimation transfer printing applications.', alt: 'Sublimation ink bottles' },
  { id: 'monogram-design', name: 'Monogram Design', category: 'Branding application', filter: 'Printing materials', description: 'Material enquiries for detailed embroidered designs.', alt: 'A navy and orange embroidered monogram in an embroidery hoop' },
  { id: 'borderless-design', name: 'Borderless Design', category: 'Print application', filter: 'Advertising', description: 'Explore materials for clean, edge-to-edge print designs.', alt: 'A printed panel with an edge-to-edge geometric design' },
  {id: 'roll-up-banner', name: 'Roll-up Banner',
    category: 'Advertising material', filter: 'Advertising', description: 'Portable display banners for events, promotions and business displays', alt: 'Roll-up banner display at an event'
  },
  {id: 'epson-head', name: 'Original Epson 4720 13200 XP600 DX7 DX5 etc Printhead', category: 'Printing material', filter: 'Printing materials', description: 'Epson print head designed to deliver precise, high-quality, and reliable printing performance.', alt: 'Epson print head for high quality printing'},
  {id: 'eyelet', name: 'Eyelets',
    category: 'Printing material', filter: 'Printing materials', description: 'Durable metal eyelets that provide secure mounting and professional finishing for banners and signage.', alt: 'Metal eyelets for banners'
  },
  { id: 'eco-solvent-ink', name: 'Eco solvent ink', category: 'Printing ink', filter: 'Consumables', description: 'Ink enquiries for compatible large-format printers.', alt: 'Cyan, magenta, yellow and black eco-solvent ink bottles' }, {id: 'sav', name: 'Self Adhesive vinyl', category: 'Printing material', filter: 'Printing materials', description: 'Printable self-adhesive vinyl for signs, decals, window graphics and displays', alt: 'self-adhesive vinyl for displays'},
  {id: 'sublimation-paper', name: 'Sublimation paper', category: 'Printing materials', filter: 'Printing materials', description: 'High-performance transfer paper that delivers sharp, vivid, and long-lasting sublimation prints', alt: 'SAV ensures brilliant colors and crisp image quality on textiles, ceramics, promotional products'},
  {id: 'window-graphics', name: 'Window graphics', category: 'Advertising materials', filter: 'Advertising', description: 'Custom-printed window displays that turn glass surfaces into effective advertising and branding tools', alt: 'Transform windows into powerful advertising spaces with custom window graphics.'},
  {id: 'clear-graphics', name: 'Clear graphics', category: 'Advertising materials', filter: 'Advertising', description: 'Transparent graphic solutions that create eye-catching branding while maintaining visibility through glass and clear surfaces', alt: 'Transparent graphic solutions that create eye-catching branding while maintaining visibility through glass and clear surfaces.'},
   {id: 'table-top-rollup', name: 'A3 Table top Rollup stand', category: 'Advertising materials', filter: 'Advertising', description: 'A portable and professional display solution for exhibitions, conferences, product launches, and promotional events.', alt: 'compact and portable banner stand ideal for promotions, exhibitions, and countertop displays.'},
  
];

export const categories = [
  { title: 'Printing materials', icon: 'layers', filter: 'Printing materials', description: 'The starting point for every print. Explore banner media, flex and flock, and laminating film.', detail: 'Banner media · Transfer materials' },
  { title: 'Printing consumables', icon: 'droplets', filter: 'Consumables', description: 'Keep your production supplied with DTF powder, DTF ink, sublimation and eco-solvent inks.', detail: 'Inks · Powders · Finishing' },
  { title: 'Advertising materials', icon: 'flag', filter: 'Advertising', description: 'Make your message visible with feather banners, plotting materials and signage applications.', detail: 'Displays · Signage · Branding' },
] as const;

export const supportSteps = [
  { title: 'Tell us what you need', description: 'Share your product, material size, quantity and intended application. Add your machine model for ink enquiries.' },
  { title: 'Clarify the specifications', description: 'Discuss the right material and finish for the job. Availability, compatibility and any supply requirements can be confirmed.' },
  { title: 'Plan your next step', description: 'Review your quotation and discuss collection or delivery arrangements before proceeding with your order.' },
];

export const applications = [
  { id: 'signage', category: 'Signage & outdoor graphics', title: 'Make your message visible.', description: 'Flex banner and plotting materials for shopfronts, campaign graphics and display lettering.', link: 'Explore signage materials', filter: 'Advertising', alt: 'A shopfront decorated with printed signage and outdoor graphics' },
  { id: 'garment', category: 'Garment & textile branding', title: 'Turn garments into identity.', description: 'DTF, flex, flock and monogram applications for uniforms, merchandise and personalised textiles.', link: 'Explore garment supplies', filter: 'Printing materials', alt: 'A branded polo shirt and T-shirt laid out with textile branding tools' },
  { id: 'display', category: 'Events & business displays', title: 'Bring a brand into the room.', description: 'Feather banners and printed display materials for events, promotions and branded spaces.', link: 'Explore display materials', filter: 'Advertising', alt: 'Branded exhibition banners, a display wall and a reception counter' },
] as const;

export const faqItems = [
  { question: 'How do I request a quotation?', answer: 'Use the enquiry form below. Include the product name, quantity, sizes or specifications and your intended use. Add your business details so your requirements can be discussed.' },
  { question: 'What information is useful for an ink enquiry?', answer: 'Share your printer brand and model, the ink type you need and your intended application. Include the quantity and any compatibility requirements so the correct specifications can be discussed.' },
  { question: 'Can I enquire about bulk or repeat supplies?', answer: 'Yes. Include the products, quantities and how frequently you expect to need them. Availability and supply arrangements are confirmed with your quotation.' },
  { question: 'How are collection and delivery arranged?', answer: 'Include your city and state in your enquiry. Collection or delivery options, timing and any applicable costs can be discussed before you proceed with an order.' },
  { question: 'What if I am not sure which material to choose?', answer: 'Describe what you are producing, where it will be used and the finish you want. A reference photo or brief can help clarify the material and specifications for your application.' },
];

export const enquiryChecklist = [
  'Product name and intended use',
  'Quantity, size and preferred finish',
  'Printer model, where applicable',
  'Location and supply requirements',
];

export const aboutChecklist = [
  'A range across print, garment and display applications',
  'Enquiries shaped around quantities and specifications',
  'A clear conversation before you commit to supply',
];

export function filterProducts(filter: ProductFilter) {
  return filter === 'All products' ? products : products.filter((product) => product.filter === filter);
}
