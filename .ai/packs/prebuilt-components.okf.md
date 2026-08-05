---
okf_version: "0.2"
id: "pack/prebuilt-components"
type: "policy"
title: "Prebuilt Components"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/prebuilt-components.md"]
attestation:
  method: "agent"
  checks: ["cross-checked against docs/prebuilt-components.md"]
summary: "Borrow-and-adapt protocol: Radix UI, Headless UI, React Aria, shadcn/ui/Park UI/HyperUI patterns. Full adaptation checklist required (tokens, a11y, mobile-first, typed props, visual states) before considered done."
load_when: "Considering an external component pattern for something hard to build correctly from scratch."
token_budget: 300
related: ["docs/prebuilt-components.md", ".ai/patterns/adapter-component.okf.md"]
---

# Prebuilt Components

Approved sources: Radix UI, Headless UI, React Aria (behavior/headless-first), shadcn/ui, Park UI, Tailwind, HyperUI (copy-paste patterns). Never install a full design system that overrides `src/styles/tokens.css`.

Every borrowed component needs: license check first, full re-skin against project tokens (colors/radius/shadows/easing), `focus-visible` + reduced-motion support, mobile-first layout, typed props, DE/EN support where relevant, all applicable visual states checked in `/dev/ui`, and a source-attribution comment block in the file itself.

No component in this repo has been borrowed yet — every current component is hand-authored.

**Full checklist**: `docs/prebuilt-components.md`.
