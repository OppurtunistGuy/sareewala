# Demo deployment, monitoring and recovery

This is a server-backed demo, not a live shop. Real products, approved policies, provider-backed payments and transactional email are external launch prerequisites. The app refuses to start with `DEMO_MODE=false` until live commerce is integrated. Do not remove this guard to claim launch readiness.

## Development and production demo

Use Node.js 24. `npm ci --cache /tmp/sudathi-npm-cache --no-audit --no-fund`, then `npm run dev` starts Vite on 3000 and the watched API on 3001. The API has a persistent SQLite database in ignored `data/store.sqlite`. Keep that directory private.

`npm run build && npm start` serves the production bundle and API from one Node process. A static-only Vercel deployment cannot run the new persistent database/API: deploy to a Node host with a persistent volume or integrate a hosted database and API before retaining a static hosting workflow.

For an HTTPS production demo, set `NODE_ENV=production`, `DEMO_MODE=true`, `PUBLIC_URL` to the actual HTTPS origin and `TRUST_PROXY=true` only behind a trusted reverse proxy. Forward HTTPS to the Node service; sessions then use Secure cookies. The server redirects plain HTTP to the configured HTTPS origin, sends HSTS/security headers, and serves history fallback routes. The optional Dockerfile needs a persistent `/app/data` volume and an HTTPS reverse proxy. Docker execution and hosted deployment are not verified in this cloud task.

Sample inventory, prices, fabric/size/care descriptions, stock, the 10% coupon, 5% tax and shipping rules are visibly labelled demo. Do not substitute an unapproved real domain, product schema, contact number or merchant policy.

The demo stays `noindex,nofollow`. With no `PUBLIC_URL`, `/robots.txt` disallows indexing and `/sitemap.xml` returns an explanatory 503. Configuring an origin enables a homepage sitemap, but live SEO still requires switching to approved product data and explicitly removing the demo indexing guard.

## Tests and monitoring

- `npm run test:api`: isolated in-memory API, auth, checkout, return, stock, privacy and injection checks.
- `npm run test:e2e`: builds the app and uses an isolated in-memory test server on 4173. Chromium defaults to `/usr/bin/chromium`; set `CHROMIUM_PATH` when needed. Android is device emulation, not a real-device claim.
- `CROSS_BROWSER=true PLAYWRIGHT_BROWSERS_PATH=/workspace/playwright-browsers npm run test:e2e`: adds Firefox and WebKit after installing those browsers. Use the cloud dependency script and XDG variables in README.md on this Debian image. WebKit is iOS emulation; Firefox requires a runner allowing content-process user namespaces. These engine checks do not establish physical-device or branded-browser compatibility.
- `SITE_URL=https://actual-origin npm run smoke`: read-only deployed route/assets/health smoke check. Run after every real deployment and rollback.
- An external uptime monitor should GET `/api/health`; response must be `{ok:true,mode:"demo"}`. Monitor restart frequency, disk space and backup age at the hosting provider. No monitor has been provisioned.
- Optional, consent-gated web-vitals records are written to the database. `npm run vitals` reports sample count and p75. Lab Lighthouse values do not prove real-user p75 targets or real iOS/Android performance.

## Backups and restore

`npm run backup -- /private/path/store.sqlite` creates a consistent SQLite snapshot, runs its integrity check and writes a SHA-256 companion file. Use a private, durable backup destination; order/account data is sensitive. The script will not overwrite an existing backup.

Stop the server before restoring. `DB_PATH=/private/path/live.sqlite npm run restore -- /private/path/store.sqlite --server-stopped` verifies checksum and database integrity and preserves any prior database/WAL/SHM under `.pre-restore-<timestamp>` names before copying. The flag is an operator assertion, not automatic process detection. Never restore into an active database.

Tested recovery uses temporary fixture databases only. Configure encrypted offsite retention and an appropriate privacy/deletion policy before production. Do not commit databases, passwords, backups or real addresses to Git.

## Rollback

Record the deployed commit and database migration version. Roll back the app to a known-good commit on the hosting provider, retain the database, and rerun the production smoke test. If data rollback is necessary, stop the service, verify a known-good backup, restore as above and check orders before reopening access. A hosted rollback is untested without an actual deployment URL.
