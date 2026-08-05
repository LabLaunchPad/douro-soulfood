---
okf_version: "0.2"
id: "pack/content-cms"
type: "knowledge"
title: "Content & CMS"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["keystatic.config.ts", "src/content.config.ts"]
attestation:
  method: "agent"
  checks: ["read keystatic.config.ts schema directly this session"]
summary: "Keystatic (Git-backed, local storage). Two collections (menu_items, faq) + one settings singleton. keystatic.config.ts and src/content.config.ts must be hand-synced on any schema change."
load_when: "Any Keystatic schema or content-collection change."
token_budget: 350
related: ["keystatic.config.ts", "src/content.config.ts", "docs/architecture.md"]
---

# Content & CMS

Keystatic, `storage.kind: 'local'`. Collections: `menu_items` (dish name, DE+EN description, price in EUR cents, image, category, sub-category, dietary tags, allergens, prep time, add-ons, price variants) and `faq` (question/answer, order). Singleton: `settings` (site name, contact, address, hours, social, Lieferando URL) — read via direct JSON import, not `getCollection()`.

**`keystatic.config.ts` (CMS schema) and `src/content.config.ts` (Astro's zod schema) are two independent definitions of the same shape.** Changing one without the other is the single most common real drift bug in this repo's history — verify both before considering a content-schema change done.

**Full detail**: read the two config files directly, or `docs/architecture.md`'s Content Architecture section.
