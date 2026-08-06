---
okf_version: "0.2"
id: "decision/stack"
type: "decision"
title: "Stack: Astro 6 + Tailwind v4 + Keystatic + Cloudflare"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["package.json", "astro.config.mjs"] }
attestation: { method: "agent", checks: ["read package.json and astro.config.mjs directly"] }
summary: "The stack is settled and stable: Astro 6 (output:'server', Cloudflare adapter), Tailwind v4, Keystatic (local storage), Cloudflare Pages/Workers hosting. Not up for casual reconsideration."
load_when: "Any proposal to change framework, CMS, styling approach, or hosting."
token_budget: 250
related: ["docs/architecture.md"]
---

# Decision: Stack

Astro 6.x (Node ≥22.12), `@astrojs/cloudflare` adapter, Tailwind CSS v4, Keystatic (Git-backed, local storage mode), Cloudflare Pages/Workers. This combination is settled infrastructure, not an open question for routine tasks — proposing a stack-level change requires the same weight as any other `<stop_and_ask_conditions>` item in `AGENTS.md`, not a silent swap.
