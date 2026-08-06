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
summary: "Schema.org Restaurant JSON-LD, OG/Twitter cards, canonical URLs, sitemap.xml. Known gap: JSON-LD likely blocked by CSP script-src without a nonce/hash — see security pack."
load_when: "Meta tags, structured data, sitemap changes."
token_budget: 300
related: ["docs/prd.md", ".ai/packs/security.okf.md"]
---

# SEO

`Base.astro`'s `<head>`: title/description meta, canonical URL, OpenGraph + Twitter cards, `Restaurant` JSON-LD (address, phone, cuisine, aggregate rating). Sitemap via `@astrojs/sitemap` (now filters out `/dev/*`). `robots.txt` disallows `/keystatic/` and `/dev/`.

**Known, cross-referenced gap** (see `.ai/packs/security.okf.md`): the JSON-LD `<script>` is likely dropped by CSP's `script-src 'self'` without a nonce/hash — meaning the structured data may not actually be crawlable in production despite being correctly authored. Not yet fixed; needs per-route build-time hash injection.

**Full detail**: `docs/prd.md`'s SEO Requirements section.
