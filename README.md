# Sudathi storefront

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

Product names, prices, reviews, promotional claims, and app statistics are demo content to replace with approved brand data before launch. App buttons open store search pages.

## Visual assets

Saree photographs for this prototype were sourced from the public repository https://github.com/AritraChakraborty2003/TanahSarees (`Backend/uploads`), converted to local WebP files. Confirm usage rights or replace with approved Sudathi imagery before commercial publication. Poppins is provided by @fontsource/poppins under its included font license.

The requested reference https://gitreverse.com/designs/sudathi-com could not be retrieved because the cloud egress proxy returned HTTP 403. The implementation follows the supplied visual brief.

## Validation

Production build passes. Chromium checks confirmed all images render, desktop and mobile layout, no mobile horizontal overflow, no runtime errors, search, wishlist, product details, bag updates and persistence, and mobile navigation.

Cloud tasks already run in isolated environments; use this existing checkout without creating a Git worktree unless explicitly requested.
