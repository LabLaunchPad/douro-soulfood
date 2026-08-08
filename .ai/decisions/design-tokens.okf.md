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

## Addendum (2026-08-07): formalized Primitive → Semantic tier labeling

The file's tokens were already informally grouped by primitive-vs-semantic role (brand/bistro palettes vs. surface/text/border); this pass added explicit `TIER 1 — PRIMITIVE` / `TIER 2 — SEMANTIC` banner comments so the hierarchy is stated, not just implied, plus a governance note in the file header (search for an existing token before adding a new one; reuse > new alias > new primitive). No token values changed — verified via `pnpm build` and a rendered-page screenshot showing identical computed `body` background/text colors before and after.

There is deliberately no third "component token" tier (e.g. `--button-radius`): Tailwind v4's `@theme` already turns every Tier 1/2 token into a utility class directly, so an indirection layer would only rename existing utilities. `docs/design-system/COMPONENT_REGISTRY.md`'s per-component token-mapping tables serve that purpose instead.

Also fixed stale header comments left over from the `talkintacos.net` structural-reference build (e.g. "Taco Green (#06B906)" mislabeling the terracotta token, a duplicated label on the forest token, "Dark Black (#0D0D0D)" mislabeling the cream token) — comment-only, no value change.
