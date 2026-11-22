# ShopLedger Agent Guide

## Stack
- Node.js application using CommonJS modules.
- Express 4.17.1 with body-parser 1.19.0.
- Browser UI is static HTML, CSS, and JavaScript in `public/`.
- Application state is stored in `data/db.json` through `lib/store.js`.

## Module map
- `routes/products.js` — product listing and active coupon endpoints.
- `routes/orders.js` — order listing, retrieval, placement, and cancellation.
- `routes/customers.js` — customer listing and Khata settlement endpoint.
- `routes/reports.js` — dashboard, GST reconciliation, pricing preview, and admin export endpoints.
- `lib/coupons.js` — coupon normalization, validation, discount calculation, and active coupon listing.
- `lib/dates.js` — current date, date key normalization, and fiscal year helpers.
- `lib/inventory.js` — product lookup, sellable stock, stock checks, reservation/release, and summary.
- `lib/invoice.js` — invoice figure calculation and printable HTML rendering.
- `lib/ledger.js` — customer balances, Khata charges/reversals, and settlements.
- `lib/orders.js` — order creation, lookup, cancellation, and filtering.
- `lib/pricing.js` — checkout subtotal, discount delegation, and line-level totals.
- `lib/reports.js` — dashboard summary and invoice-to-order GST reconciliation.
- `lib/store.js` — JSON database read/write, structure defaults, and audit log append.
- `lib/tax.js` — item GST rate/slab lookup and CGST/SGST split.

## Commands
- Start the app: `node server.js`.
- Run tests: `node --test` (no test files are currently present).

## Rules
1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket
- Invoice total and GST breakdown do not match what the customer was billed.
- Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).
