---
okf_version: "0.2"
id: "pack/visual-outcomes"
type: "knowledge"
title: "Visual Outcomes"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["src/pages/dev/ui.astro"]
attestation:
  method: "agent"
  checks: ["route actually loaded via pnpm dev:astro and inspected live this session; confirmed 404 in production preview"]
summary: "/dev/ui previews Button, badges, ReviewBadge, MenuItemCard (incl. empty/unavailable states), MenuBistroCard, FeatureCard, HeroSection. Dev-only (404s in production), excluded from sitemap.xml and robots.txt."
load_when: "Any UI component change needing visual verification before considered done."
token_budget: 300
related: ["src/pages/dev/ui.astro", "docs/components.md"]
---

# Visual Outcomes

`src/pages/dev/ui.astro` — component preview route, gated to `import.meta.env.DEV` (404s in a production build, since `output: 'server'` makes every `src/pages/` file a live route otherwise). Excluded from `sitemap.xml` (`astro.config.mjs`'s sitemap `filter`) and `robots.txt` (`Disallow: /dev/`).

New/changed components should be added here with real prop shapes (not placeholder text) and manually checked against: mobile width, keyboard-tab focus-visible outlines, `prefers-reduced-motion`, and token-vs-hardcoded-color comparison — the checklist already in the route's own footer.

**Verified this session**: actually loaded via `pnpm dev:astro`, confirmed 404 on the real deployed preview URL, confirmed absent from the real production `sitemap.xml`.
