import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { createApp } from '../src/app.js';

const uploadDirectory = mkdtempSync(path.join(os.tmpdir(), 'betozed-api-'));
const products = [
  { slug: 'dtf-ink', name: 'Yinghe DTF Ink', filter: 'Consumables', isActive: true },
  { slug: 'flex-banner', name: 'Flex Banner', filter: 'Printing materials', isActive: true },
];
const prisma = {
  product: {
    findMany: async ({ where }) => products.filter((product) => product.isActive && (!where.filter || product.filter === where.filter)),
    findFirst: async ({ where }) => products.find((product) => product.slug === where.slug && product.isActive) ?? null,
  },
  enquiry: {
    create: async ({ data }) => ({ id: 'enquiry-test-id', createdAt: new Date('2026-01-01T00:00:00.000Z'), ...data }),
  },
};
const app = createApp({ prisma, whatsappPhoneNumber: '2348012345678', uploadDirectory });

after(() => rmSync(uploadDirectory, { recursive: true, force: true }));

describe('Betozed API', () => {
  it('reports API health', async () => {
    const response = await request(app).get('/api/health').expect(200);
    assert.deepEqual(response.body, { status: 'ok' });
  });

  it('lists active products and filters by catalog group', async () => {
    const response = await request(app).get('/api/products?filter=Consumables').expect(200);
    assert.equal(response.body.data.length, 1);
    assert.equal(response.body.data[0].slug, 'dtf-ink');
  });

  it('gets one product by slug and returns a not found response for unknown slugs', async () => {
    const response = await request(app).get('/api/products/dtf-ink').expect(200);
    assert.equal(response.body.data.name, 'Yinghe DTF Ink');
    await request(app).get('/api/products/unknown').expect(404);
  });

  it('saves a valid enquiry and returns a prefilled WhatsApp handoff', async () => {
    const response = await request(app).post('/api/enquiries').field('name', 'Alao Muqadas')
      .field('company', 'Betozed customer').field('email', 'customer@example.com')
      .field('phone', '+2348012340000').field('product', 'Yinghe DTF Ink')
      .field('quantity', '2 bottles').field('location', 'Ogbomoso')
      .field('requirements', 'Please quote compatible white ink.').field('consent', 'true')
      .expect(201);

    assert.equal(response.body.data.id, 'enquiry-test-id');
    assert.match(response.body.data.whatsappUrl, /^https:\/\/wa\.me\/2348012345678\?text=/);
    assert.equal(decodeURIComponent(response.body.data.whatsappUrl).includes('Please quote compatible white ink.'), true);
  });

  it('rejects invalid enquiries without creating a database record', async () => {
    const response = await request(app).post('/api/enquiries').field('name', 'Alao')
      .field('email', 'not-an-email').field('phone', '12345678').field('product', 'DTF Ink')
      .field('requirements', 'Need a quotation').field('consent', 'false')
      .attach('reference', Buffer.from('sample'), { filename: 'reference.pdf', contentType: 'application/pdf' }).expect(400);
    assert.equal(response.body.error.code, 'INVALID_ENQUIRY');
    assert.deepEqual(readdirSync(uploadDirectory), []);
  });
});