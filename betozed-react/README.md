# Betozed Nigeria — React frontend

A complete React + TypeScript + Vite frontend reconstructed from the eight supplied screenshots. Every reference section and all 12 product cards are included. The screenshots' browser controls, pink canvas and surrounding empty space are excluded from the webpage.

## Run locally

Use Node.js 22.12 or newer and npm. Extract the ZIP, open the `betozed-react` folder in VS Code, then run:

```bash
npm ci
npm run dev
```

Open the address printed by Vite (normally `http://localhost:4173`).

```bash
npm run typecheck
npm test
npm run build
npm run preview
```

`npm run build` creates the deployable static frontend in `dist/`. A React-aware backend is not required to serve this folder.

## Screenshot alignment

| Reference images | Page content |
| --- | --- |
| 01 | Desktop header, hero, benefits, categories and all products |
| 02 | Desktop support, applications, about, FAQ and beginning of enquiry |
| 03 | Complete desktop enquiry, closing call to action and footer |
| 04–07 | The same page in tablet and phone layouts |
| 08 | Remaining phone enquiry, call to action and footer |

| Viewport | Layout behaviour |
| --- | --- |
| Above 1100 px | Four product columns; side-by-side hero, about, FAQ and enquiry; one-row header |
| 641–1100 px | Three product columns; stacked hero, about, FAQ and enquiry; two-row header; three category and application columns |
| Up to 640 px | Two product columns; stacked categories, applications and process; collapsible navigation; single-column form; two-column footer links |
| Below 360 px | Smaller gutters, brand and product typography keep the two-column catalogue usable |

All views use the same DOM, content data, spacing tokens and image assets. Cards stretch to equal row heights and place their enquiry links consistently at the bottom. No fixed page width or clipped overflow is used. The container caps at 1248 px on wide screens.

Some supplied photos vary between desktop, tablet and phone. This implementation uses the desktop photos consistently and changes their crop at smaller widths. Assets are extracted from the screenshots, so their sharpness is limited by those screenshots. Replace the corresponding files in `public/images/` with the original images when available; no component edits are needed.

## Interactions

- Product filters select the relevant catalogue items.
- Category, application and footer range links set the relevant filter.
- Each product's enquiry link preselects its name and focuses the product field while retaining other form values.
- The FAQ opens one answer at a time and supports closing the active answer.
- The mobile navigation toggles, closes after selecting a link, and closes with Escape while returning focus to the menu button.
- The enquiry form validates required fields, email, contact permission and the reference size. Delivery in progress disables the fields and blocks duplicate submissions. Failed delivery preserves the entered information.
- Internal links point to real page sections. Keyboard focus, field labels, accessible button state, a skip link and reduced-motion preferences are supported.

## Enquiry delivery

This is a frontend project. With no endpoint configured, submitting valid details prepares a downloadable text enquiry and clearly says that it has **not been sent**. Selected reference files remain on the user's device and must be included separately with the downloaded text. Nothing is emailed, uploaded or stored in a database in this mode.

To connect your backend, copy `.env.example` to `.env.local` and set:

```dotenv
VITE_ENQUIRY_ENDPOINT=https://your-backend.example/api/enquiries
```

Restart Vite or rebuild after changing this value. Your endpoint must accept `POST` with `multipart/form-data`, handle delivery, and return a successful HTTP status only when the request has been accepted. Cross-origin endpoints must allow the frontend origin. Field names are `name`, `company`, `email`, `phone`, `product`, `quantity`, `location`, `requirements`, `consent` and optional `reference`. The adapter is in `src/lib/enquiry.ts`. It aborts a stalled request after 20 seconds and reports HTTP failures.

Vite environment variables are public browser configuration. Put private credentials in the backend.

## Project files

```text
src/App.tsx                 Page composition and shared product selection
src/components/             Header, hero, products, support, applications,
                            about, FAQ, enquiry, footer and shared primitives
src/data/content.ts         Navigation, products and page copy
src/lib/enquiry.ts           Enquiry validation, formatting and delivery adapter
src/styles.css              Shared styles and responsive breakpoints
public/images/              Local images from the references
tests/                      Interaction and delivery tests
```

## Verification

TypeScript, production compilation and automated DOM interaction tests are included. The tests cover the complete page, valid anchor targets, catalogue filtering, category links, product preselection, mobile menu controls, FAQ state, incomplete forms, local preparation, failed delivery, duplicate requests, oversized references, multipart delivery and timeouts.

Browser visual verification was not run in the authoring environment because its required browser-control skill was unavailable. JSDOM tests validate behaviour and semantics; they do not measure rendered layout or prove pixel-perfect matching. For final visual review, inspect the page at 320, 375, 430, 768, 1024, 1280 and 1440 px and check wrapping, card alignment, navigation and the form. The responsive CSS was reviewed at these sizes.

To regenerate the source ZIP, run `npm run package:source` with Python 3 installed. The package excludes dependencies, build output, credentials and hosting identity.
