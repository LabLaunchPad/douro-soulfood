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
summary: "Schema.org Restaurant JSON-LD, OG/Twitter cards, canonical URLs, sitemap.xml. Fixed: JSON-LD was blocked by CSP script-src, now allowed via a SHA-256 hash. Verified: Googlebot's 2MB-per-resource crawl limit is not violated on any indexable page."
load_when: "Meta tags, structured data, sitemap changes, or crawl-budget/page-size questions."
token_budget: 350
related: ["docs/prd.md", ".ai/packs/security.okf.md"]
---

# SEO

`Base.astro`'s `<head>`: title/description meta, canonical URL, OpenGraph + Twitter cards, `Restaurant` JSON-LD (address, phone, cuisine, aggregate rating). Sitemap via `@astrojs/sitemap` (now filters out `/dev/*`). `robots.txt` disallows `/keystatic/` and `/dev/`.

**Fixed** (see `.ai/packs/security.okf.md`): the JSON-LD `<script>` was dropped by CSP's `script-src 'self'` — now allowed via a SHA-256 hash, verified with a real headless-Chrome check.

**Verified: Googlebot's 2MB-per-resource crawl limit** (uncompressed, per-file, [Google's current docs](https://developers.google.com/search/docs/crawling-indexing/googlebot#file-size)) **is not violated.** Measured every built HTML/CSS/JS asset directly: largest crawlable page (`/menu`) is ~148KB, largest public CSS ~64KB — both far under 2MB. One real outlier (`keystatic-page.*.js`, ~2.64MB) exists but is loaded only by `/keystatic` (the CMS admin route), already `Disallow`'d in `robots.txt` and excluded from the sitemap — unreachable by Googlebot. No action needed.

**Full detail**: `docs/prd.md`'s SEO Requirements section.
