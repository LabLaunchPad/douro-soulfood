---
okf_version: "0.2"
id: "pack/accessibility"
type: "knowledge"
title: "Accessibility"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/agent.md", "src/components/layout/MobileNavDrawer.astro"]
attestation:
  method: "agent"
  checks: ["verified skip link, drawer focus-trap, and axe-core CI gate exist"]
summary: "Semantic HTML, focus-visible styles required, prefers-reduced-motion respected globally, skip-to-main-content link present. Playwright + axe-core enforce WCAG 2A/2AA/2.1A/2.1AA in CI."
load_when: "Any UI change."
token_budget: 350
related: ["docs/agent.md", "docs/test-plan.md"]
---

# Accessibility

Skip link (`#main-content`) present in `Base.astro`, `sr-only`/`focus:not-sr-only`. `MobileNavDrawer.astro` is the reference pattern for any future modal/dialog: `inert`/`aria-hidden` toggling while closed, a Tab focus trap while open, focus moved to the close button on open and back to the trigger on close/`Escape`.

Every interactive element needs a visible `focus-visible` outline — a prior bug (`outline: none` with nothing replacing it) was already caught and fixed once in `MobileNavDrawer.astro`'s close button; don't reintroduce that pattern.

`prefers-reduced-motion` is respected globally via `Base.astro`'s `<style>` block for CSS animations/transitions — that block does **not** cover `<video autoplay>`, which needs its own JS check (see `HeroSection.astro`'s hero-video script: skips loading/playing entirely when reduced motion is set, satisfying WCAG 2.2.2 for the looping, non-essential background video).

CI runs `@axe-core/playwright` against WCAG 2A/2AA/2.1A/2.1AA tags on both tested pages — a real, enforced gate, not aspirational.

**Full detail**: `docs/agent.md`'s Critical Rules section.
