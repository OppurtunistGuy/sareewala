# Jai Hind Sarees

A responsive, image-first storefront for **Jai Hind Saree Centre**, Shop No 106, Main Bazar, Pimpri, Pune, Maharashtra 411017. React 19, Vite, Express and SQLite; Poppins, white/deep-blue/yellow styling and locally hosted responsive photography.

**This is a functional ecommerce demo. No real payments, delivery, marketing emails or refunds are enabled.** Products, prices, stock, fabric details, offers, tax and shipping rules are sample fixtures. The app refuses unconfigured live mode.

## Run and check the site

Requires Node.js 24 and npm. In a terminal:

```sh
npm ci
npm run dev
```

Open the development server on port **3000** in your own browser. This command also starts the API on **3001**; both are needed for shopping flows. Cloud onboarding does not publish a public website. The GitHub repository is the source code, not a deployed site URL.

Explore `/collections/women`, `/product/1`, `/account` and `/checkout`. Create a demo account with a test email and unique demo password, add a product, try `WELCOME10`, and place a simulated order. Pending/failed/cancelled outcomes can be selected at checkout. Accounts show orders, eligible return requests and the accurate “refund not issued” status.

`npm run build && npm start` serves the production build and API together on port **3001** (or `PORT`). SQLite data persists in ignored `data/store.sqlite`; never commit this directory. The server renders the initial homepage before hydration and supports refresh/direct routes. See [.env.example](.env.example) and [operations](docs/OPERATIONS.md) for an HTTPS demo deployment.

A static-only Vercel deployment is insufficient for the new API/database. Use a Node host with a persistent volume, or integrate a hosted database/API. No live deployment has been made or verified in this task.

## Implemented and tested

- Collections, combined price/size/colour/category filters, price/newest/popularity sorting, typo-tolerant search and helpful empty states.
- Product details, stock-aware variants, zoom, saved bag and account/anonymous wishlists.
- Server-validated totals, demo first-order coupon rules, address/PIN validation, simulated UPI/card/wallet/COD, atomic inventory and idempotent order creation.
- Password-hashed accounts, expiring HttpOnly sessions, server-side order ownership, CSRF/origin checks, rate limits, security headers and an inline-script hash policy.
- Newsletter consent/duplicate handling, optional consent-gated analytics with no password/payment fields, image/API recovery, keyboard dialogs, mobile menus and accessibility fixes.

Every point in the uploaded 130-item checklist is assessed in [QA report](docs/QA_REPORT.md). Automated test scenarios cover multiple checklist points; a passing demo test does not imply the corresponding live business flow is ready. [Original checklist](docs/QA_CHECKLIST_SOURCE.txt) is preserved verbatim.

```sh
npm run test:api
npm run test:e2e
npm run smoke
npm run vitals
```

Browser tests build the app and start an isolated in-memory server on 4173. Default projects are desktop Chromium and Pixel 7 Chromium emulation. Use installed system Chromium or set `CHROMIUM_PATH`; otherwise Playwright's Chromium is used. Optional Firefox/WebKit projects:

```sh
npx playwright install --with-deps chromium firefox webkit
CROSS_BROWSER=true npm run test:e2e
```

For this Debian 13 cloud image, `bash scripts/setup-cloud-browsers.sh` installs browser runtime dependencies into `/workspace` using verified APT packages. Then set `PLAYWRIGHT_BROWSERS_PATH=/workspace/playwright-browsers`, `XDG_CONFIG_HOME=/workspace/browser-config` and `XDG_CACHE_HOME=/workspace/browser-cache`. Firefox needs a runner that permits its content-process user namespace. Real Chrome/Edge and physical Safari/iOS/Android tests remain separate launch checks.

A GitHub Actions workflow runs API and all browser-engine projects on pushes/PRs and uploads failure traces/screenshots. Its remote execution is not assumed until Actions reports completion.

Cloud tasks already run in isolated environments; use this existing checkout without creating a Git worktree unless explicitly requested. During routine setup, preserve application files and lockfiles and use `npm ci`.

## Business facts and assets

The user-supplied Google Maps listing was independently matched on 2026-10-10: **3.6/5 from 20 reviews**, **10 AM–9 PM daily**. The site attributes these facts and shows the checked date. Phone remains unverified; Justdial was blocked. See [business sources](docs/BUSINESS_SOURCES.md).

Saree photographs are prototype assets from the public [TanahSarees repository](https://github.com/AritraChakraborty2003/TanahSarees), converted to local WebP sizes. Confirm usage rights or replace with approved merchant imagery before commercial publication. Poppins is supplied under its included Fontsource license. The requested [visual reference](https://gitreverse.com/designs/sudathi-com) was inaccessible through the cloud proxy; exact approved-reference comparison remains pending.

Before launch, supply the deployed HTTPS URL, approved catalogue/stock/photos, real shipping/tax/coupon/return/privacy policies, payment and login/email services, and authorised support contact. An app download strip cannot advertise ratings/downloads without a verified Jai Hind app; the current dismissible strip promotes the physical store with directions.
