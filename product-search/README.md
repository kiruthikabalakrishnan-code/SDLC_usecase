# Product Search

Self-contained React app implementing the approved SCRUM-5 product search and filter. Product records and placeholder imagery are local; there is no backend, database, or runtime product-data network request.

## Requirements

- Node.js `>=20.19.0`
- npm `>=10.8.0`

## Setup and commands

Run these commands from `product-search/`:

```powershell
npm ci
npx playwright install chromium
npm run dev
npm run test:unit
npm run test:e2e
npm run build
```

The Vite development server binds to `127.0.0.1:4173` and uses a strict port. Playwright starts the same server automatically. The E2E suite uses Chromium.
