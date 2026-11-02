# Betozed API

Express 5 API backed by PostgreSQL and Prisma. It exposes the product catalog and stores quotation enquiries. It does not implement checkout, Paystack, payment records, stock levels, or inventory management. Bank details are not stored or sent by the API; the business can share them manually with the customer in WhatsApp during the quotation conversation.

## Setup

1. Install Node.js 20.19+ or 22.12+ and PostgreSQL.
2. From this folder, install dependencies with `npm install`.
3. If `.env` does not exist, copy `.env.example` to `.env`; otherwise add or update `DATABASE_URL`, `WHATSAPP_PHONE_NUMBER`, and `SALES_EMAIL` without replacing existing values. Use the WhatsApp number in international format without `+`, spaces, or punctuation.
4. Create the local database, then run `npm run db:migrate -- --name init`.
5. Generate the Prisma client and load the starter catalog with `npm run db:generate` and `npm run db:seed`.
6. Start the API with `npm run dev`. The default URL is `http://localhost:5000`.

The API stores enquiry reference files under `UPLOAD_DIR` (default `uploads/`) and never serves that directory publicly. Use persistent private storage and backups for deployed environments; the local disk upload adapter is intended for development/small deployments.

## API

- `GET /api/health` returns API liveness.
- `GET /api/products` returns active products. Optional query parameters: `filter` (`Printing materials`, `Consumables`, or `Advertising`) and `search`.
- `GET /api/products/:slug` returns one active product.
- `POST /api/enquiries` accepts `multipart/form-data` fields `name`, `company`, `email`, `phone`, `product`, `quantity`, `location`, `requirements`, and `consent`; optional `reference` accepts JPG, PNG, WebP, or PDF up to 10 MB. On success it saves the enquiry and responds with its id and a prefilled WhatsApp URL.

The WhatsApp URL contains an enquiry reference and the customer's name, product, requested quantity, location, and requirements. It omits their email and phone. The customer chooses the returned “Continue on WhatsApp” link; the site does not send messages automatically.

## Frontend connection

In development the React enquiry form posts to `http://localhost:5000/api/enquiries`. For deployment, configure `VITE_ENQUIRY_ENDPOINT` to the public API endpoint when building the frontend. Add the deployed frontend origin to `FRONTEND_ORIGINS` on the API.

## Database design

`Product` stores the public catalog, category/filter, display content, and active/sort state. `Enquiry` stores customer contact/requirements, consent, lifecycle status, and private reference-file metadata. There are deliberately no stock, checkout, payment, or bank-account models.