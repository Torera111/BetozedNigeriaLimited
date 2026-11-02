import { randomUUID } from 'node:crypto';
import { mkdirSync, promises as fs } from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import multer from 'multer';
import { ZodError, z } from 'zod';

const filters = ['Printing materials', 'Consumables', 'Advertising'];
const enquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(180).optional().default(''),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(5).max(50),
  product: z.string().trim().min(1).max(180),
  quantity: z.string().trim().max(160).optional().default(''),
  location: z.string().trim().max(180).optional().default(''),
  requirements: z.string().trim().min(1).max(5000),
  consent: z.union([z.literal('true'), z.literal('on'), z.literal(true)]).transform(() => true),
});

const productQuerySchema = z.object({
  filter: z.enum(filters).optional(),
  search: z.string().trim().max(100).optional(),
});

function makeUploadMiddleware(uploadDirectory) {
  mkdirSync(uploadDirectory, { recursive: true });
  const allowedTypes = new Map([
    ['image/jpeg', ['.jpg', '.jpeg']],
    ['image/png', ['.png']],
    ['image/webp', ['.webp']],
    ['application/pdf', ['.pdf']],
  ]);

  return multer({
    storage: multer.diskStorage({
      destination: uploadDirectory,
      filename: (_request, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
    }),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (_request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      if (!allowedTypes.get(file.mimetype)?.includes(extension)) {
        callback(new Error('Reference must be a JPG, PNG, WebP or PDF file.'));
        return;
      }
      callback(null, true);
    },
  }).single('reference');
}

function whatsappUrl(phoneNumber, enquiry) {
  const phone = String(phoneNumber ?? '').replace(/\D/g, '');
  if (!/^[1-9]\d{7,14}$/.test(phone)) return null;

  const message = [
    'Hello Betozed, I have submitted a quotation enquiry.',
    `Enquiry reference: ${enquiry.id}`,
    `Name: ${enquiry.name}`,
    `Product: ${enquiry.productInterest}`,
    `Quantity / size: ${enquiry.quantity || 'Not specified'}`,
    `Location: ${enquiry.location || 'Not specified'}`,
    `Requirements: ${enquiry.requirements}`,
    enquiry.referenceFileName ? 'I will attach my reference file in this chat.' : '',
  ].filter(Boolean).join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function createApp({ prisma, whatsappPhoneNumber = process.env.WHATSAPP_PHONE_NUMBER, uploadDirectory = process.env.UPLOAD_DIR || 'uploads', frontendOrigins = process.env.FRONTEND_ORIGINS } = {}) {
  if (!prisma) throw new Error('A Prisma client must be provided to createApp.');

  const app = express();
  const origins = (frontendOrigins || 'http://localhost:4173,http://localhost:5173')
    .split(',').map((origin) => origin.trim()).filter(Boolean);
  const upload = makeUploadMiddleware(path.resolve(uploadDirectory));

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: origins }));
  app.use(express.json({ limit: '32kb' }));

  app.get('/api/health', (_request, response) => response.json({ status: 'ok' }));

  app.get('/api/products', async (request, response, next) => {
    try {
      const parsed = productQuerySchema.safeParse(request.query);
      if (!parsed.success) {
        response.status(400).json({ error: { code: 'INVALID_QUERY', message: 'The product filter or search query is invalid.' } });
        return;
      }

      const { filter, search } = parsed.data;
      const where = { isActive: true };
      if (filter) where.filter = filter;
      if (search) where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];

      const products = await prisma.product.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }], take: 100 });
      response.json({ data: products });
    } catch (error) {
      next(error);
    }
  });

  app.get('/api/products/:slug', async (request, response, next) => {
    try {
      const product = await prisma.product.findFirst({ where: { slug: request.params.slug, isActive: true } });
      if (!product) {
        response.status(404).json({ error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found.' } });
        return;
      }
      response.json({ data: product });
    } catch (error) {
      next(error);
    }
  });

  const enquiryLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });
  app.post('/api/enquiries', enquiryLimiter, upload, async (request, response, next) => {
    try {
      const parsed = enquirySchema.safeParse(request.body);
      if (!parsed.success) {
        if (request.file?.path) await fs.unlink(request.file.path).catch(() => {});
        response.status(400).json({ error: { code: 'INVALID_ENQUIRY', message: 'Please check the required enquiry fields.', fields: parsed.error.flatten().fieldErrors } });
        return;
      }

      if (!whatsappUrl(whatsappPhoneNumber, { id: 'check', ...parsed.data })) {
        if (request.file?.path) await fs.unlink(request.file.path).catch(() => {});
        response.status(503).json({ error: { code: 'WHATSAPP_NOT_CONFIGURED', message: 'WhatsApp contact is not configured for enquiries.' } });
        return;
      }

      const record = await prisma.enquiry.create({
        data: {
          name: parsed.data.name,
          company: parsed.data.company,
          email: parsed.data.email,
          phone: parsed.data.phone,
          productInterest: parsed.data.product,
          quantity: parsed.data.quantity,
          location: parsed.data.location,
          requirements: parsed.data.requirements,
          contactConsent: true,
          referenceFileName: request.file?.originalname,
          referenceMimeType: request.file?.mimetype,
          referenceStorageKey: request.file?.filename,
        },
      });

      response.status(201).json({
        data: {
          id: record.id,
          createdAt: record.createdAt,
          whatsappUrl: whatsappUrl(whatsappPhoneNumber, { ...record, referenceFileName: record.referenceFileName }),
        },
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found.' } }));
  app.use(async (error, request, response, _next) => {
    if (request.file?.path) await fs.unlink(request.file.path).catch(() => {});

    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE';
      response.status(tooLarge ? 413 : 400).json({ error: { code: tooLarge ? 'REFERENCE_TOO_LARGE' : 'INVALID_REFERENCE', message: tooLarge ? 'Reference must be 10 MB or smaller.' : 'Only one reference file can be uploaded.' } });
      return;
    }
    if (error instanceof ZodError) {
      response.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Request data is invalid.' } });
      return;
    }
    if (error.message?.startsWith('Reference must be')) {
      response.status(400).json({ error: { code: 'INVALID_REFERENCE', message: error.message } });
      return;
    }

    console.error(error);
    response.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' } });
  });

  return app;
}