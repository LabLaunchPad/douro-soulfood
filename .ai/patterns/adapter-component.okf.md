---
okf_version: "0.2"
id: "pattern/adapter-component"
type: "spec"
title: "Pattern: adapter component (for wrapping a React island)"
status: "draft"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "experimental"
trust: "draft"
provenance: { source: "human", references: ["docs/adr/react-islands.md"] }
attestation: { method: "manual", checks: [] }
summary: "The adapter file-split (src/components/islands/*.tsx + src/components/adapters/*Adapter.astro) is a policy requirement, not yet exercised by real code, since no React island exists yet."
load_when: "Implementing an approved React island."
token_budget: 200
related: [".ai/patterns/react-island.okf.md", "docs/adr/react-islands.md"]
---

# Pattern: adapter component

Every React island must be wrapped by a matching `.astro` adapter — pages never import the `.tsx` island directly. This keeps every page's import graph Astro-only at a glance and centralizes the `client:*` hydration directive decision in exactly one file per component.

No real example exists yet in this repo — see `.ai/patterns/react-island.okf.md` for the paired skeleton. This pattern will be marked `verified` once a first real island proves it out.
