---
okf_version: "0.2"
id: "pack/security"
type: "knowledge"
title: "Security"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/security.md", "public/_headers"]
attestation:
  method: "agent"
  checks: ["CSP copied verbatim from public/_headers", "verify-csp-hashes.mjs passes", "real headless-Chrome click test: menu/map both work, zero CSP violations"]
summary: "No unconsented third-party request fires anywhere — fonts self-hosted, Maps two-click-gated (MapEmbed.astro). CSP script-src covers every inline script (JSON-LD + 4 page-interactivity scripts) by exact SHA-256 hash, no 'unsafe-inline' — fixed a real bug where the mobile menu and map consent-gate silently didn't work in production."
load_when: "Third-party scripts, embeds, consent flows, or CSP changes."
token_budget: 500
related: ["docs/security.md", "public/_headers", "scripts/checks/verify-csp-hashes.mjs"]
---

# Security

CSP (`public/_headers`): `default-src 'self'; script-src 'self' 'sha256-...' (x5); style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://images.unsplash.com; frame-src https://maps.google.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`.

Any new third-party integration must go through the same two-click-consent pattern `MapEmbed.astro` already implements — default to not loading, load only on explicit user action.

**Inline scripts are allowed by exact SHA-256 hash, never `'unsafe-inline'`.** All 5 (JSON-LD + 4 page-interactivity scripts) are covered. These hashes are pinned to exact minified byte output, which can shift on any toolchain update, not just a source edit — run `pnpm build && node scripts/checks/verify-csp-hashes.mjs` after any dependency bump or edit to `Base.astro`/`NavBar.astro`/`MobileNavDrawer.astro`/`MapEmbed.astro`.

**Full detail, including why this mattered**: `docs/security.md`.
