import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  { slug: 'flex-banner', name: 'Flex Banner', category: 'Printing material', filter: 'Printing materials', description: 'Large-format media for banners and outdoor graphics.', alt: 'White flex banner material rolls on a print workshop table', imageUrl: '/images/flex-banner.webp' },
  { slug: 'flex-flock', name: 'Flex and Flock materials', category: 'Transfer material', filter: 'Printing materials', description: 'Transfer materials for garment graphics and lettering.', alt: 'Colourful rolls of garment transfer material', imageUrl: '/images/flex-flock.webp' },
  { slug: 'plotting', name: 'Plotting', category: 'Signage material', filter: 'Advertising', description: 'Materials for cut lettering, decals and display graphics.', alt: 'A cutting plotter with navy blue material and cut lettering', imageUrl: '/images/plotting.webp' },
  { slug: 'dtf-powder', name: 'DTF Powder', category: 'Consumable', filter: 'Consumables', description: 'Adhesive powder for direct-to-film transfer workflows.', alt: 'A bag of white DTF adhesive powder and a measuring spoon', imageUrl: '/images/dtf-powder.webp' },
  { slug: 'dtf-ink', name: 'Yinghe DTF Ink', category: 'Printing ink', filter: 'Consumables', description: 'Yinghe DTF inks for compatible direct-to-film printing setups. Contact us to confirm printer compatibility and available colours.', alt: 'Bottles of direct-to-film printing ink', imageUrl: '/images/dtf-ink.webp' },
  { slug: 'dtf-film', name: 'ROLL PET film', category: 'Consumable', filter: 'Consumables', description: 'PET transfer film for DTF printing, used to transfer printed designs onto garments and other compatible textiles.', alt: 'Roll of PET transfer film for DTF printing' },
  { slug: 'monogram', name: 'Monogram', category: 'Embroidery', filter: 'Printing materials', description: 'Discuss materials for embroidered names and branding.', alt: 'Embroidery thread spools arranged around a navy polo shirt', imageUrl: '/images/monogram.webp' },
  { slug: 'feather-banner', name: 'Feather Banner', category: 'Advertising material', filter: 'Advertising', description: 'Display materials for events and business visibility.', alt: 'Two feather banner displays with navy and orange graphics', imageUrl: '/images/feather-banner.webp' },
  { slug: 'laminating-film', name: 'Laminating Film', category: 'Finishing material', filter: 'Printing materials', description: 'Film for protecting and finishing printed graphics.', alt: 'Two rolls of clear laminating film', imageUrl: '/images/laminating-film.webp' },
  { slug: 'sublimation-ink', name: 'Yinghe Sublimation Ink', category: 'Printing ink', filter: 'Consumables', description: 'Yinghe sublimation inks for compatible sublimation printing applications. Contact us to confirm printer compatibility and available colours.', alt: 'Sublimation ink bottles', imageUrl: '/images/sublimation-ink.webp' },
  { slug: 'monogram-design', name: 'Monogram Design', category: 'Branding application', filter: 'Printing materials', description: 'Material enquiries for detailed embroidered designs.', alt: 'A navy and orange embroidered monogram in an embroidery hoop', imageUrl: '/images/monogram-design.webp' },
  { slug: 'borderless-design', name: 'Borderless Design', category: 'Print application', filter: 'Advertising', description: 'Explore materials for clean, edge-to-edge print designs.', alt: 'A printed panel with an edge-to-edge geometric design', imageUrl: '/images/borderless-design.webp' },
  { slug: 'roll-up-banner', name: 'Roll-up Banner', category: 'Advertising material', filter: 'Advertising', description: 'Portable display banners for events, promotions and business displays.', alt: 'Roll-up banner display at an event', imageUrl: '/images/roll-up-banner.webp' },
  { slug: 'epson-head', name: 'Original Epson 4720 13200 XP600 DX7 DX5 etc Printhead', category: 'Printing material', filter: 'Printing materials', description: 'Epson print head designed to deliver precise, high-quality, and reliable printing performance.', alt: 'Epson print head for high quality printing', imageUrl: '/images/epson-head.webp' },
  { slug: 'eyelet', name: 'Eyelets', category: 'Printing material', filter: 'Printing materials', description: 'Durable metal eyelets that provide secure mounting and professional finishing for banners and signage.', alt: 'Metal eyelets for banners', imageUrl: '/images/eyelet.webp' },
  { slug: 'eco-solvent-ink', name: 'Yinghe Eco-Solvent Ink', category: 'Printing ink', filter: 'Consumables', description: 'Yinghe eco-solvent ink for compatible large-format printers. Contact us to confirm printer compatibility and available colours.', alt: 'Cyan, magenta, yellow and black eco-solvent ink bottles', imageUrl: '/images/eco-solvent-ink.webp' },
  { slug: 'sav', name: 'Self-Adhesive Vinyl', category: 'Printing material', filter: 'Printing materials', description: 'Printable self-adhesive vinyl for signs, decals, window graphics and displays.', alt: 'Self-adhesive vinyl for displays', imageUrl: '/images/sav.webp' },
  { slug: 'sublimation-paper', name: 'Sublimation Paper', category: 'Printing material', filter: 'Printing materials', description: 'Transfer paper for sublimation printing applications.', alt: 'Sublimation paper for textile and promotional product transfers', imageUrl: '/images/sublimation-paper.webp' },
  { slug: 'window-graphics', name: 'Window graphics', category: 'Advertising materials', filter: 'Advertising', description: 'Custom-printed window displays that turn glass surfaces into effective advertising and branding tools.', alt: 'Custom printed window display graphics', imageUrl: '/images/window-graphics.webp' },
  { slug: 'clear-graphics', name: 'Clear graphics', category: 'Advertising materials', filter: 'Advertising', description: 'Transparent graphic solutions that create eye-catching branding while maintaining visibility through glass and clear surfaces.', alt: 'Transparent graphics for glass and clear surfaces', imageUrl: '/images/clear-graphics.webp' },
  { slug: 'table-top-rollup', name: 'A3 Table top Rollup stand', category: 'Advertising materials', filter: 'Advertising', description: 'A portable and professional display solution for exhibitions, conferences, product launches, and promotional events.', alt: 'Compact portable tabletop banner stand', imageUrl: '/images/table-top-rollup.webp' },
];

for (const [sortOrder, product] of products.entries()) {
  await prisma.product.upsert({
    where: { slug: product.slug },
    update: { ...product, sortOrder },
    create: { ...product, sortOrder },
  });
}

await prisma.$disconnect();