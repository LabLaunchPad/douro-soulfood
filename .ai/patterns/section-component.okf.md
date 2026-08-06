---
okf_version: "0.2"
id: "pattern/section-component"
type: "spec"
title: "Pattern: section component (deduplicating near-identical page markup)"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["src/components/sections/PhotoGrid.astro"] }
attestation: { method: "agent", checks: ["PhotoGrid.astro deduplicated two verbatim-identical grid blocks in index.astro this session"] }
summary: "When a page has two+ near-identical markup blocks differing only in data, extract a section component taking that data as a prop array, rather than leaving the duplication or over-abstracting into something more generic than needed."
load_when: "Considering whether to extract a page section into a reusable component."
token_budget: 250
related: [".ai/packs/components.okf.md", "src/components/sections/PhotoGrid.astro"]
---

# Pattern: section component

Reference example: `src/components/sections/PhotoGrid.astro` — replaced two verbatim-identical grid blocks in `index.astro` ("Beliebte Gerichte" and "Galerie") that differed only in which image array they mapped over.

Rule of thumb: extract when the duplication is **real and current** (two+ actual instances in the codebase today), not speculative ("might need this again someday"). `FaqAccordion.astro` and `OurStorySection.astro` are the other reference examples — each wraps genuinely reusable, previously-inline markup with a typed `Props` interface, without inventing configurability the current usage doesn't need.

Counter-example, deliberately not done: `menu.astro`'s repeated per-category "3-photo showcase row" blocks were explicitly left as inline duplication in this repo's history, because forcing a shared component there was judged a new abstraction beyond the actual ask at the time — extraction is a judgment call, not an automatic rule.
