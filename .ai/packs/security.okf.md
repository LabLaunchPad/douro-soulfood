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
  checks: ["CSP copied verbatim from public/_headers", "node scripts/checks/verify-csp-hashes.mjs passes", "verified via real headless-Chrome click test: mobile menu opens, map consent-gate loads, zero CSP console violations"]
summary: "No unconsented third-party request fires anywhere — fonts self-hosted, Maps two-click-gated (MapEmbed.astro). CSP script-src now covers every inline script (JSON-LD + all 4 page-interactivity scripts) by exact SHA-256 hash, no 'unsafe-inline'. This closed a real, previously-live bug: the mobile hamburger menu and map consent-gate button did not work in production because their inline scripts were silently CSP-blocked."
load_when: "Third-party scripts, embeds, consent flows, or CSP changes."
token_budget: 400
related: ["docs/security.md", "public/_headers", "scripts/checks/verify-csp-hashes.mjs"]
---

# Security

CSP (`public/_headers`): `default-src 'self'; script-src 'self' 'sha256-...' (x5); style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://images.unsplash.com; frame-src https://maps.google.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`.

Any new third-party integration must go through the same two-click-consent pattern `MapEmbed.astro` already implements — default to not loading, load only on explicit user action.

**Fixed** (was: "known, documented, unfixed gap"): CSP's `script-src` blocks every inline `<script>` element regardless of `type`, and Astro auto-inlines small page scripts rather than externalizing them (JSON-LD, mobile-menu toggle, nav-scroll behavior, map consent-gate, hours indicator — 5 total). Each is now allowed via its exact SHA-256 content hash instead of `'unsafe-inline'`. **This was a real, live functional bug, not just an SEO nitpick**: the mobile hamburger menu and the Maps consent-gate button silently did nothing in production before this fix (confirmed via a real headless-Chrome click test before/after).

**Maintenance note**: these hashes are pinned to exact minified byte content, which can change on ANY toolchain update (Astro/Vite/esbuild version bump), not just a hand-edited source change. Run `pnpm build && node scripts/checks/verify-csp-hashes.mjs` after any dependency bump or edit to `Base.astro`/`NavBar.astro`/`MobileNavDrawer.astro`/`MapEmbed.astro` to catch a stale hash before it silently breaks in production again.

**Full detail**: `docs/security.md`.
