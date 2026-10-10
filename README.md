# Jai Hind Sarees storefront

A responsive React + Vite fashion storefront with self-hosted Poppins and local WebP photography.

## Development

Requires Node.js 24 (validated with 24.19.0) and npm 11.

```sh
cd /workspace/sareewala
npm ci --cache /tmp/sudathi-npm-cache --no-audit --no-fund
npm run dev -- --port 3000
```

Build with `npm run build`. No backend, service credentials, or environment variables are required.

## Prototype behaviour

Search, category filtering, banner navigation, product details, wishlist, and bag quantities work. Wishlist and bag persist in localStorage. Newsletter interest is saved only on the device, with a visible explanation. Account authentication, checkout, payments, and email delivery need a commerce backend.

The product grid is a lookbook with example photographs, not a verified inventory. Current styles, fabric details, prices, delivery, and return terms must be confirmed with the shop. Unverified ratings, testimonials, app claims, and discount promises have been removed.

## Visual assets

Saree photographs for this prototype were sourced from the public repository https://github.com/AritraChakraborty2003/TanahSarees (`Backend/uploads`), converted to local WebP files. Confirm usage rights or replace with approved Jai Hind Sarees imagery before commercial publication. Poppins is provided by @fontsource/poppins under its included font license.

The requested reference https://gitreverse.com/designs/sudathi-com could not be retrieved because the cloud egress proxy returned HTTP 403. The implementation follows the supplied visual brief.

## Validation

Production build passes. Chromium checks confirmed all images render, desktop and mobile layout, no mobile horizontal overflow, no runtime errors, search, wishlist, product details, bag updates and persistence, and mobile navigation.

Cloud tasks already run in isolated environments; use this existing checkout without creating a Git worktree unless explicitly requested.

## Business information

- Brand: Jai Hind Sarees
- Shop name: Jai Hind Saree Centre
- Address: Shop No 106, Main Bazar, Pimpri, Pune, Maharashtra 411017

The name and address were initially supplied by the user and then independently matched against their Google Maps listing: https://maps.app.goo.gl/gKjPygNjHQbdbp6v5. On 2026-10-10, the listing showed a 3.6/5 rating from 20 reviews and opening hours of 10 AM–9 PM every day. These facts are attributed to Google Maps on the site, with a checked date. Directions target the verified Google Place ID. Phone number remains unverified. Justdial requests are still blocked by the cloud proxy. See [business sources](docs/BUSINESS_SOURCES.md) for research details.

The header, store strip, visit section, contact dialog, footer, page metadata, and local-storage keys use the Jai Hind branding.
