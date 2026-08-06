---
okf_version: "0.2"
id: "decision/design-tokens"
type: "decision"
title: "Single design-token source: src/styles/tokens.css"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["src/styles/tokens.css"] }
attestation: { method: "agent", checks: ["verified zero hardcoded hex outside flag-SVG fills in a prior repo-wide audit this session"] }
summary: "All colors, radii, shadows, easing come from CSS custom properties in src/styles/tokens.css. No hardcoded hex, no second token source, no external design-system library's own tokens."
load_when: "Any styling decision, especially when adapting a prebuilt/borrowed component."
token_budget: 200
related: [".ai/packs/design-system.okf.md", "docs/prebuilt-components.md"]
---

# Decision: Single design-token source

`src/styles/tokens.css` is the only source of design tokens. This was enforced by a repo-wide audit that tokenized a previously-hardcoded 8-hex-value palette (~52 occurrences) earlier in this repo's history — the enforcement mechanism is "grep for hex codes outside legitimate flag-SVG fills," and it's expected to return zero results at any point in time.
