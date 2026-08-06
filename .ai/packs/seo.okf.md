---
okf_version: "0.2"
id: "pack/seo"
type: "knowledge"
title: "SEO"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/prd.md", "src/layouts/Base.astro"]
attestation:
  method: "agent"
  checks: ["cross-checked against Base.astro's actual head tags and .ai/packs/security.okf.md's JSON-LD/CSP finding"]
summary: "Schema.org Restaurant JSON-LD, OG/Twitter cards, canonical URLs, sitemap.xml. Fixed: JSON-LD was blocked by CSP script-src, now allowed via a SHA-256 hash — see security pack."
load_when: "Meta tags, structured data, sitemap changes."
token_budget: 300
related: ["docs/prd.md", ".ai/packs/security.okf.md"]
---

# SEO

`Base.astro`'s `<head>`: title/description meta, canonical URL, OpenGraph + Twitter cards, `Restaurant` JSON-LD (address, phone, cuisine, aggregate rating). Sitemap via `@astrojs/sitemap` (now filters out `/dev/*`). `robots.txt` disallows `/keystatic/` and `/dev/`.

**Fixed** (see `.ai/packs/security.okf.md`): the JSON-LD `<script>` was dropped by CSP's `script-src 'self'` — now allowed via a SHA-256 content hash in `public/_headers`, verified with a real headless-Chrome check that the structured data is present with zero CSP console errors.

**Full detail**: `docs/prd.md`'s SEO Requirements section.
