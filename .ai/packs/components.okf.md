---
okf_version: "0.2"
id: "pack/components"
type: "knowledge"
title: "Components"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/components.md"]
attestation:
  method: "agent"
  checks: ["cross-checked against actual src/components/ tree"]
summary: "All components are .astro. UI atoms in src/components/ui/, section composites in src/components/sections/, layout in src/components/layout/. Full prop-level API in docs/components.md."
load_when: "Building or modifying any component."
token_budget: 300
related: ["docs/components.md", ".ai/patterns/section-component.okf.md"]
---

# Components

`src/components/ui/`: Button, AllergenBadge, DietaryBadge, CategoryIcon, ReviewBadge, AllergenHeaderLegend, MapEmbed.
`src/components/sections/`: HeroSection, FeatureCard, UserReviews, MenuItemCard, MenuBistroCard, PhotoGrid, OurStorySection, FaqAccordion.
`src/components/layout/`: NavBar, MobileNavDrawer, Footer, MobileBottomBar.

New components must be visually verified at `/dev/ui` (see `.ai/packs/visual-outcomes.okf.md`) and documented in `docs/components.md` before considered done.

**Full prop-level API**: `docs/components.md`.
