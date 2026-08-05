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
  checks: ["CSP copied verbatim from public/_headers"]
summary: "No unconsented third-party request fires anywhere — fonts self-hosted, Maps two-click-gated (MapEmbed.astro). Known unfixed gap: inline JSON-LD likely blocked by CSP script-src without a nonce/hash."
load_when: "Third-party scripts, embeds, consent flows, or CSP changes."
token_budget: 350
related: ["docs/security.md", "public/_headers"]
---

# Security

CSP (`public/_headers`): `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://images.unsplash.com; frame-src https://maps.google.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`.

Any new third-party integration must go through the same two-click-consent pattern `MapEmbed.astro` already implements — default to not loading, load only on explicit user action.

**Known, documented, unfixed gap**: `Base.astro`'s inline JSON-LD `<script>` is likely dropped by `script-src 'self'` in production (CSP applies to all `<script>` elements regardless of `type`, verified via research). Fixing needs per-route build-time hash injection — real infrastructure work, not a quick fix.

**Full detail**: `docs/security.md`.
