---
okf_version: "0.2"
id: "decision/keystatic-sync"
type: "decision"
title: "keystatic.config.ts and src/content.config.ts must be hand-synced"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["keystatic.config.ts", "src/content.config.ts"] }
attestation: { method: "agent", checks: ["confirmed both schemas match field-for-field this session"] }
summary: "The CMS schema (keystatic.config.ts) and Astro's typed content-collection schema (src/content.config.ts) are two independent definitions of the same shape. There is no automatic sync — this is a manual discipline, and it has caused real drift before."
load_when: "Any content-schema change (adding/removing/renaming a field on menu_items, faq, or settings)."
token_budget: 250
related: [".ai/packs/content-cms.okf.md"]
---

# Decision: Keystatic/Astro schema sync is manual, always

This is not automated and Astro v6 provides no built-in mechanism to keep these two files in sync — a schema drift bug (missing 5 fields on `menu_items`) was found and fixed once already in this repo's history. Any content-schema change task must update both files in the same change and verify by opening `/keystatic` and confirming an existing item's fields round-trip correctly, or by running `pnpm build` (which validates every content JSON file against the zod schema at build time).
