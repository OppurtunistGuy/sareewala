# 130-point ecommerce QA report

Assessed **2026-10-10** against the uploaded checklist, with Jai Hind branding and the verified Pimpri store details. This is a tested **server-backed demo**, not a live-store launch approval. Every original point is listed below; no unchecked item is silently counted as a pass.

## Status meanings

- **PASS**: available functionality verified by the cited automated check and/or explicit source/screenshot review.
- **DEMO**: tested with sample catalogue/business rules or simulated payments; live merchant/provider validation still required.
- **PARTIAL**: implementation or limited evidence exists; the stated remaining check is unverified.
- **BLOCKED**: an external prerequisite is missing or unavailable; this is not a passing launch check.
- **N/A**: conditional feature is deliberately not offered.

**Checklist totals:** 83 PASS, 11 PARTIAL, 22 DEMO, 13 BLOCKED, 1 N/A = 130 points. These counts are checklist dispositions, not automated test counts.

## Executed validation and evidence

Full regression passed **37 API tests and 64 browser scenarios**. A final font consistency change passed **8 affected page/accessibility checks** across all four browser projects. The API suite runs against fresh in-memory SQLite fixtures. Browser suites build the production client/SSR bundle and use a separate in-memory server; they do not place live orders or touch the development database. See [test evidence](qa-assets/test-summary.json) for the final command, counts, versions and runner result.

- Node 24 / locked `npm ci`, client + SSR production build, API security/stock/pricing/payment/return/consent checks.
- Desktop Chromium, Chromium Pixel 7 emulation, Firefox desktop and WebKit iPhone 13 emulation. Real branded Chrome/Edge and physical devices are not established by engine emulation.
- WCAG 2 A/AA and 2.1 AA axe checks on main pages and dialogs/forms, keyboard/escape/focus interaction, every required mobile width, interrupted requests, long translated names, rapid clicks, checkout refresh and 200% CSS reflow.
- Local development and production-build health/routes/assets smoke, backup/restore integrity and corrupt-checksum refusal; [operational evidence](qa-assets/operations.json).
- Mobile/desktop Lighthouse lab profiles, served from the built SSR/compressed app. See [lab measurements](qa-assets/performance.json). TBT is reported separately from INP. `npm run vitals` finds no real field samples, so no p75 Core Web Vitals target is signed off.

Final sequential lab measurements:

| Profile | Performance | Accessibility | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|
| Mobile | 97/100 | 100/100 | 2.38 s | 0.011 | 34 ms |
| Desktop | 100/100 | 100/100 | 0.57 s | 0.004 | 0 ms |

Both best-practices scores are 100. SEO is 66 because the demo intentionally blocks indexing; that guard is retained. These are lab samples, not field p75 or INP validation.

Current captures: [desktop homepage](qa-assets/desktop-home.png), [mobile homepage](qa-assets/mobile-home.png), [mobile product](qa-assets/mobile-product.png), [empty bag](qa-assets/mobile-empty-bag.png). They are review evidence, not approved visual-regression baselines. Exact visual reference was blocked by cloud-proxy HTTP 403.

## Live launch prerequisites

Supply an actual deployed HTTPS origin; approved catalogue, licensed photos, prices/stock/variants/specifications; tax/shipping/coupon/return/privacy terms and support contact; real payment/login/email providers and secure configuration. Then integrate and test provider callbacks, fulfilment, email delivery, refunds and account recovery; enable verified product SEO; collect field vitals and test physical/branded browsers. Provision hosted monitoring, encrypted durable backups and rehearse rollback. The app intentionally rejects `DEMO_MODE=false` until that work is done.

The GitHub link supplied in response to the prerequisite question identifies the source repository only. No real provider, policy, catalogue or deployment configuration was inferred from it. No app download rating/count is invented for Jai Hind. Maps facts and attribution are documented in [business sources](BUSINESS_SOURCES.md); Justdial remains inaccessible.

## Findings fixed in this task

Implemented missing server-backed accounts/wishlists/orders/returns, price and stock checks, first-order coupon, safe payment simulations and idempotency. Fixed mobile search clipping, filter/variant accessibility, image retry state, contrast in small text and dialogs, long-name overflow, footer target spacing and decorative cart-count accessibility. Added initial HTML rendering, responsive compressed imagery, correctly ordered preload/viewport metadata and recovery states.

GitHub Actions is configured to rerun engine/API tests on pushes/PRs; its remote result and actual deployment are not claimed by this local report. [Operations](OPERATIONS.md) records the tested development/start commands and deployment, monitoring, backup and rollback steps.

## A. App & Initial Load

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| A1 | Homepage loads without blank screens or crashes | PASS | Browser A/D/H/I/J: homepage renders server HTML and hydrates; API/product content loads. |
| A2 | Logo, navigation, banners and product images render correctly | PASS | Browser A/D/H/I/J: logo/navigation and every visible image checked for natural dimensions. |
| A3 | No console errors or failed critical network requests | PASS | Browser A/D/H/I/J: pageerror and failed-request listeners are empty on normal loads. |
| A4 | App promotion strip displays correctly and can be dismissed | PARTIAL | Dismissible store-promotion strip persists after refresh. No verified Jai Hind app/listing/download count exists; app-download claims are withheld. |
| A5 | Refresh and direct URL visits work without errors | PASS | Browser A/B, C/F, E/I/J/S and checkout/order tests cover refresh and direct product/collection/account/order URLs. |

## B. Banners & Promotions

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| B1 | Hero images are sharp and correctly cropped on all screens | PASS | Desktop/mobile captures and all viewport tests review object-fit crops; responsive local WebP candidates. |
| B2 | Every promotional CTA navigates to its intended destination | PASS | Hero CTA and category/collection CTAs resolve to the intended collection; directions use the verified Place ID. |
| B3 | Carousel controls, swipe gestures and indicators work | PASS | Browser A/B tests previous/next buttons, indicators and pointer-based swipe changes. |
| B4 | Sale claims, discount percentages and offer dates are accurate | DEMO | Demo prices/MRP and WELCOME10 dates/conditions agree with the server fixtures; actual merchant offer approval is outstanding. |
| B5 | No text overlaps or clipped promotional content | PASS | Viewport/reflow checks and screenshot review show promotional text without horizontal overflow. |

## C. Categories & Collections

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| C1 | Women, Men, Kids and other category links work | PASS | Browser C/F visits Women/Men/Kids and fallback; Men/Kids honestly show no available inventory. |
| C2 | Category images and labels match their destination | PASS | Collection labels and buttons use matching filters; category tabs resolve to their own routes. |
| C3 | Product listings show the correct category | DEMO | Eight demo Women products match their category; no invented Men/Kids products. Real catalogue still required. |
| C4 | Filters and sorting update results correctly | PASS | Browser C/F verifies combined collection/colour/price filters and all four sort modes. |
| C5 | Empty collections show a useful fallback | PASS | Unavailable categories and zero matches show a useful explanation and reset/explore CTA. |

## D. Design Consistency

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| D1 | Poppins is applied consistently, including after font loading | PASS | Browser font-family assertion and self-hosted latin Poppins 400/500/600/700, including editorial emphasis. |
| D2 | Deep blue, white and yellow match the design system | PARTIAL | White #fff, primary blue #153f73 and yellow #f9d65b match the supplied brief. Exact external design-system comparison blocked by inaccessible reference. |
| D3 | Buttons, spacing, radii and typography are consistent | PASS | Common button/form/dialog styles and responsive screenshot review; shared spacing/type tokens. |
| D4 | Hover, focus, active, loading and disabled states are polished | PASS | Disabled out-of-stock options, focus-visible outlines, hover states, skeletons, busy controls and error recovery reviewed. |
| D5 | No layout shifts, stretched photos or overlapping components | PASS | Viewport/long-name/reflow checks; lab CLS 0.011 mobile and 0.004 desktop; no stretched images in captures. |

## E. E-commerce Product Experience

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| E1 | Product cards show correct names, images and prices | DEMO | API catalog assertions and browser product cards match sample names/photos/paise prices; merchant catalogue not supplied. |
| E2 | Product detail pages open for every active item | PASS | Browser E/I/J/S opens all eight active product routes and missing-product fallback. |
| E3 | Size, colour and variant selection work correctly | DEMO | Free-size standard variant works; each product has its labelled colour and unavailable premium variant. Real variants require merchant data. |
| E4 | Unavailable variants cannot be purchased | PASS | Native disabled property is asserted; API rejects zero-stock/unknown variants regardless of client state. |
| E5 | Add to Cart and Buy Now perform the correct actions | PASS | Add-to-cart changes the saved bag; Buy Now navigates with the selected variant to checkout. |

## F. Filters & Sorting

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| F1 | Price, size, colour and category filters work | PASS | Price, category, size and colour filter controls implemented; combined collection/colour/size/minimum/maximum-price browser checks and empty state. |
| F2 | Multiple filters can be combined and cleared | PASS | Browser C/F combines filters, checks one/zero matches, then clears to eight styles. |
| F3 | Sorting by price, newest and popularity is correct | PASS | Ascending/descending price, newest and popularity each assert the expected first product. |
| F4 | Result counts update after filtering | PASS | Live result counts assert eight/one/zero and update with route filters. |
| F5 | Filters remain usable on mobile | PASS | Android/WebKit projects open mobile filters and use collection/colour/price/sort controls. |

## G. Global Navigation

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| G1 | Header links and logo navigate correctly | PASS | Logo returns home; header collection/account/store links and direct routes reviewed. |
| G2 | Search, account, wishlist and cart icons work | PASS | Search, account page, wishlist drawer and bag drawer exercised in browser suites. |
| G3 | Mobile menu opens, closes and navigates correctly | PASS | Mobile menu opens/closes, exposes category and account controls, and closes after route navigation. |
| G4 | Dropdown menus work with mouse, touch and keyboard | PASS | Hover dropdowns, touch buttons and ArrowDown/Escape keyboard handling checked. |
| G5 | Sticky header does not obscure content | PASS | Sticky header and scroll-padding reviewed; product/form controls remain usable after scrolling. |

## H. Homepage Sections

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| H1 | Every section matches the approved visual design | BLOCKED | Exact approved visual design is unavailable: gitreverse reference returns proxy 403 and no approved baseline was supplied. |
| H2 | Sections appear in the correct order | PASS | Browser section-order assertion and capture review: hero, trust, collections, offer, top picks, editorial, store, newsletter. |
| H3 | Top Picks, sale banners and collection grids populate | DEMO | Top picks, offer banner and four collection cards populate with labelled demo imagery/prices. |
| H4 | Trust badges and promotional messaging are accurate | PASS | Physical-store claims use verified address/hours/Google rating; no unverified app ratings, testimonials or delivery badges. |
| H5 | No duplicate, empty or broken homepage modules | PASS | Rendered section/card counts and all-image checks find no broken or accidental empty homepage modules. |

## I. Images & Media

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| I1 | All product and lifestyle images load successfully | PASS | All images are scrolled into view and checked complete/naturalWidth > 0 in each engine. |
| I2 | Responsive images use appropriate sizes and formats | PASS | 320/480/960/original WebP srcsets, correct hero sizes and viewport-before-preload avoid duplicate oversized requests. |
| I3 | Lazy loading works without leaving blank cards | PASS | Lazy product/editorial images load as scrolled into view; failure fallback has a working retry button. |
| I4 | Image zoom or galleries work where implemented | PASS | Product zoom opens accessible modal and Escape closes it; each product has one honest sample photo. |
| I5 | Meaningful images have appropriate alt text | PASS | Browser assertions require meaningful nonempty alt text; decorative icons are hidden from assistive technology. |

## J. JavaScript & Interactions

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| J1 | No uncaught JavaScript exceptions | PASS | Normal-load browser pageerror collection stays empty; API errors use visible recovery paths. |
| J2 | No hydration warnings or broken interactive components | PASS | Server-rendered homepage hydrates without recorded exceptions; carousel/menu/filters/cart remain interactive. |
| J3 | Rapid clicks do not duplicate actions | PASS | Rapid add/newsletter/order clicks produce one logical action/request/order; idempotency enforced server-side. |
| J4 | Dialogs, menus and drawers open and close reliably | PASS | Repeated modal/drawer open/close and Escape handling checked, with focus returned to trigger. |
| J5 | Back and forward browser navigation work correctly | PASS | Browser E/I/J/S exercises back to product and forward to collection, plus direct missing-page fallback. |

## K. Keyboard Accessibility

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| K1 | All actionable elements are keyboard reachable | PASS | Keyboard dropdown, modal and form controls exercised; native elements and visible focus states. |
| K2 | Tab order follows the visual layout | PASS | Shared dialog focus order and native form sequence reviewed; no positive tabindex hacks. |
| K3 | Focus indicators are visible | PASS | Focus-visible outlines retained for buttons/links/inputs/selects; keyboard screenshot/manual review. |
| K4 | Escape closes dialogs and menus where appropriate | PASS | Escape closes navigation dropdowns, dialogs, search and filters; explicit close buttons also available. |
| K5 | No keyboard traps occur | PASS | Dialogs intentionally contain Tab focus, with Escape/close exits and restored trigger focus; browser G/K checks. |

## L. Loading & Performance

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| L1 | Core Web Vitals are measured on mobile and desktop | PARTIAL | Mobile/desktop Lighthouse lab LCP/CLS/TBT measured and consented LCP/INP/CLS collection added. No real-user mobile/desktop cohort exists yet. |
| L2 | LCP target is 2.5 seconds or less at the 75th percentile | BLOCKED | p75 LCP needs real deployed traffic. Final mobile lab is 2.38 s and desktop 0.57 s; lab values cannot establish field p75. |
| L3 | INP target is 200 ms or less at the 75th percentile | BLOCKED | p75 INP requires real-user interactions. Consent-gated collection exists; Lighthouse TBT is not INP. |
| L4 | CLS target is 0.1 or less at the 75th percentile | BLOCKED | p75 CLS requires real deployed traffic. Lab CLS is below 0.1 on both profiles, but no field distribution is available. |
| L5 | Slow connections show usable loading and error states | PASS | Delayed API test shows skeleton; interrupted API and image requests expose retry and recover. API timeout is 15 seconds. |

## M. Mobile Responsiveness

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| M1 | Layouts work at 320, 360, 375, 390 and 430 px | PASS | Browser M/X explicitly checks 320, 360, 375, 390, 430, 760, 1024 and 1440 px. |
| M2 | No unwanted horizontal scrolling | PASS | scrollWidth <= innerWidth asserted at all required sizes, landscape and enlarged reflow. |
| M3 | Text, product cards and CTAs remain readable | PASS | Mobile screenshots reviewed; cards/text/buttons wrap and remain readable at the minimum width. |
| M4 | Tap targets are large enough and spaced correctly | PASS | Critical buttons/fields have 44 px height; adjacent smaller controls retain spacing. Lighthouse target-size audit and mobile interactions reviewed. |
| M5 | Mobile search, menu, filters and checkout are usable | PASS | Mobile projects exercise search submit, navigation/dropdown, filters and complete checkout. |

## N. Newsletter & Notifications

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| N1 | Newsletter accepts valid email addresses | DEMO | Valid email plus explicit consent records interest in SQLite; no email provider exists and UI says no marketing emails will be sent. |
| N2 | Invalid and duplicate submissions are handled | PASS | Browser native email validation and API invalid/duplicate checks; duplicate returns 409. |
| N3 | Success and failure messages are accurate | PASS | Success states say interest recorded only; failure/duplicate text comes from backend response. |
| N4 | Submission does not create duplicate requests | PASS | Synchronous submit lock and disabled loading state; rapid-click browser test asserts exactly one request. |
| N5 | Marketing consent is collected where required | PASS | Required newsletter checkbox and API consent=true validation; optional analytics has a separate opt-in. |

## O. Offers & Discounts

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| O1 | MRP, selling price and discount calculation agree | DEMO | MRP/current price in paise and rounded percentage match demo fixtures; client totals recomputed by API. |
| O2 | Coupon eligibility and expiry rules are enforced | DEMO | Demo WELCOME10 eligibility/minimum/expiry tested, including expired fixture; real promotion policy unapproved. |
| O3 | Coupon cannot be redeemed beyond permitted limits | DEMO | First-order-only server rule rejects reuse and post-order coupon attempts; cap ₹300 and maximum quantities checked. |
| O4 | Offer stacking follows configured business rules | DEMO | Exactly one demo coupon permitted; stacked/invalid codes rejected, no implicit offer stacking. |
| O5 | Cart and checkout totals reflect valid discounts | DEMO | Browser checkout quote and API exact arithmetic assertions include valid discount, shipping and included demo GST. |

## P. Payments & Checkout

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| P1 | Shipping address and PIN code validation work | PASS | Required address fields and six-digit nonzero-leading PIN checked client/server; invalid PIN rejected. |
| P2 | Shipping charges and taxes calculate correctly | DEMO | Demo inclusive 5% GST, ₹79 shipping and free-shipping threshold after discount checked. Merchant tax/shipping rules missing. |
| P3 | UPI, cards, wallets or COD work where enabled | BLOCKED | UPI/card/wallet/COD simulations pass API tests; no payment gateway or approved COD fulfilment is connected. No real charge occurs. |
| P4 | Failed, cancelled and pending payments are handled safely | DEMO | Failed/cancelled/pending simulation creates no order or stock change; pending can confirm; failed key cannot be reused. |
| P5 | One successful payment produces exactly one order | DEMO | Concurrent/duplicate successful simulation creates one stored order and one stock deduction. Real gateway webhook/reconciliation still required. |

## Q. Quality & Content

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| Q1 | No spelling mistakes or placeholder content | DEMO | Business branding/address copy reviewed. Sample catalogue/prices/policies remain expressly labelled demo, so this cannot pass a live no-placeholder launch gate. |
| Q2 | Product descriptions and specifications are accurate | BLOCKED | Real product descriptions/specifications/photos have not been supplied or merchant-approved; current fixtures are visibly sample data. |
| Q3 | Sizes, fabric and care information are available | DEMO | Fabric, free-size length/blouse and care fields are present for each demo product; real accuracy requires merchant confirmation. |
| Q4 | Promotional claims and ratings are substantiated | PASS | Google Maps 3.6/5 from 20 reviews and daily 10 AM–9 PM substantiated in BUSINESS_SOURCES.md; demo discount claims show conditions. |
| Q5 | No dead links or outdated policy text | DEMO | Internal route/policy/support controls work; directions use real listing. Policy dialogs truthfully identify unapproved demo terms. |

## R. Returns & Refunds

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| R1 | Return policy and eligibility are clearly shown | DEMO | Seven-day demo eligibility and non-returnable exclusions shown on product, policy and order pages; real policy unapproved. |
| R2 | Return request workflow works where supported | DEMO | Owned confirmed demo order return can be requested once; expiry/nonreturnable/ownership API assertions pass. |
| R3 | Refund status reflects backend records accurately | DEMO | Requests persist as requested; refund remains not issued. UI never invents a completed refund. |
| R4 | Non-returnable products are labelled correctly | DEMO | Non-returnable demo item labelled on cards/details/order and excluded server-side. |
| R5 | Support and order-help links work | PASS | Order-help/account controls and Google directions links resolve. No unverified phone/contact channel is invented. |

## S. Search & SEO

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| S1 | Search returns relevant products and suggestions | PASS | Search product suggestions and relevant collection results; product/collection routes preserve queries. |
| S2 | Misspellings and no-results searches are handled | PASS | Edit-distance-one typo test “silkk” finds four silk styles; empty searches show reset suggestions. |
| S3 | Page titles and meta descriptions are unique | PASS | Product/account/checkout/category titles and descriptions set on server and client; metadata escapes interpolated text. |
| S4 | Canonical URLs, sitemap and robots rules are correct | BLOCKED | Deployed HTTPS origin missing. Demo stays noindex; robots disallows all without origin and sitemap returns explanatory 503. Live canonical/sitemap validation pending. |
| S5 | Product structured data uses valid real product details | BLOCKED | Real product data missing, so no fabricated Product/Offer schema is emitted. Verified ClothingStore structured data is present. |

## T. Tracking & Analytics

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| T1 | Page view, product view and search events fire correctly | PASS | Consent-gated page_view/product_view/search events implemented; browser observes view events and API strips raw search text/PII. |
| T2 | Add-to-cart and begin-checkout events fire once | PASS | Browser rapid-click/checkout test observes one add/begin event per action; server event IDs deduplicate. |
| T3 | Purchase events fire only for confirmed orders | PASS | Browser observes one purchase only after confirmed owned order; API rejects nonexistent/foreign/unconfirmed orders. |
| T4 | Analytics never exposes passwords or payment secrets | PASS | API whitelists identifiers/counts/totals/routes and strips password/email/card/query fields; client test inspects payloads. |
| T5 | Consent preferences are respected | PASS | Essential-only sends no analytics; enabling emits events and disabling stops them. Newsletter consent is independent. |

## U. User Accounts & Wishlist

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| U1 | Login, registration and logout work | PASS | API login/register/logout and browser account/order journey checked; salt+scrypt password hash and HttpOnly cookie. |
| U2 | OTP or password reset works if supported | N/A | OTP and password reset are not offered in this demo; no deceptive reset/OTP controls. Choose real login/email provider before adding recovery. |
| U3 | Account sessions persist and expire correctly | PASS | Session survives reload and expires after seven days; API expiration fixture denies protected order access. |
| U4 | Wishlist add/remove and persistence work | PASS | Anonymous wishlist survives reload; account wishlist persists server-side and is isolated between users. |
| U5 | Users cannot access another customer's account or orders | PASS | Server authorisation prevents reading/returning another customer’s order and segregates wishlists; not a client-only guard. |

## V. Visual Regression

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| V1 | Desktop screenshots match approved reference layouts | BLOCKED | Current desktop captures exist, but no approved reference screenshot/baseline was supplied; cannot assert a reference match. |
| V2 | Mobile screenshots match approved reference layouts | BLOCKED | Current mobile captures exist, but no approved reference screenshot/baseline was supplied; cannot assert a reference match. |
| V3 | No accidental typography or spacing regressions | PARTIAL | Current typography/spacing reviewed with screenshots and viewport tests; approved regression baseline remains unavailable. |
| V4 | All modal, error, hover and empty states are reviewed | PASS | Policy/privacy/empty bag/wishlist/zoom/form/checkout states checked with axe; API/image errors and busy/disabled states reviewed. |
| V5 | Image crops and banners remain consistent after changes | PARTIAL | Current hero/gallery crops reviewed at required sizes; future approved-baseline comparison remains pending. |

## W. Web Browser Compatibility

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| W1 | Chrome and Edge desktop flows work | PARTIAL | System Chromium desktop passes. Actual branded Chrome and Microsoft Edge binaries were not installed/tested. |
| W2 | Firefox desktop flows work | PASS | Playwright Firefox desktop suite passes after supported runner permissions resolved its user-namespace crash. |
| W3 | Safari on iOS works | PARTIAL | Playwright WebKit iPhone 13 emulation passes; this is not physical Safari/iOS verification. |
| W4 | Chrome on Android works | PARTIAL | Chromium Pixel 7 emulation passes; physical Android Chrome verification remains outstanding. |
| W5 | Touch, mouse, keyboard and browser back work | PASS | Mouse clicks, mobile/touch-style controls, pointer swipe, keyboard and back/forward checked in available engine projects. |

## X. Cross-device Edge Cases

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| X1 | Portrait and landscape layouts work | PASS | Required portrait widths and 844×390 landscape checked for overflow and visible controls. |
| X2 | Zoom at 200% does not hide essential functions | PARTIAL | 200% CSS zoom/reflow and enlarged text checks keep checkout usable. Actual browser toolbar zoom/physical-device accessibility review remains pending. |
| X3 | Long names and translated text do not overflow | PASS | Injected long Hindi/English product and escaped account names at 320 px remain inside viewport; no HTML execution. |
| X4 | Slow or interrupted network requests recover gracefully | PASS | Aborted catalog/image requests expose recoverable state and retry restores content; delayed catalog shows loading skeleton. |
| X5 | Refresh during cart or checkout does not corrupt state | PASS | Bag reload and checkout refresh preserve valid lines and checkout idempotency key; malformed storage resets safely. |

## Y. Your Security & Data

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| Y1 | HTTPS is enforced and no mixed content loads | PARTIAL | Production-mode tests verify HTTP→HTTPS redirect, Secure session cookie and HSTS behind configured trusted proxy. Actual HTTPS deployment/mixed-content crawl pending. |
| Y2 | Sensitive API keys are not exposed in frontend bundles | PASS | No provider secrets were configured or embedded; built client is static app code, with private server/DB/env excluded. /server is denied. |
| Y3 | Authentication and authorisation are enforced server-side | PASS | Auth, ownership, stock/price/coupon and checkout eligibility enforced in API with expired-session/foreign-order tests. |
| Y4 | Forms and APIs resist common injection and XSS attacks | PASS | Parameterized SQLite, body limits, CSRF/origin/rate controls and hashed inline script CSP; SQL injection and rendered XSS-name tests pass. |
| Y5 | Payments, personal data and logs follow applicable privacy rules | BLOCKED | Demo has no payment credentials and analytics strips PII; live privacy retention/deletion/contact, payment processor obligations and merchant policy approval remain unresolved. |

## Z. Zero-critical-defect Launch Gate

| ID | Original requirement | Status | Evidence / remaining work |
|---|---|---|---|
| Z1 | All critical shopping journeys pass end to end | DEMO | All critical DEMO journeys pass (account→product→checkout→order→return); real buying/email/refund journeys are externally blocked. |
| Z2 | No open P0 or P1 defects remain | BLOCKED | Demo defects found in this task were fixed. Live checkout/catalog/policies/deployment/device gates remain release blockers, so no live zero-P0/P1 claim. |
| Z3 | No broken critical links or missing product assets | PASS | Local smoke routes/assets pass and every visible photo loads; no broken critical demo internal routes/assets found. |
| Z4 | Monitoring, backups and rollback procedures are ready | PARTIAL | Health/smoke and documented monitoring/rollback exist; fixture backup/restore integrity, non-overwrite and checksum refusal pass. Hosted alerts/offsite backups/rollback not provisioned. |
| Z5 | Production smoke tests pass after deployment | BLOCKED | GitHub URL is not a deployment URL. Local production-build smoke passes; post-deployment smoke cannot run without the real hosted origin. |
