# Changelog

## [Unreleased]

### Changed
- Migrated CMS from TinaCMS to Keystatic
- Rewrote homepage copy to German
- Migrated delivery link-out from Foodora to Lieferando
- Security: bumped Astro/Keystatic for CVE fixes, added HTTP security
  headers, general dependency hygiene
- Design tokens: added a type scale, z-index scale, named breakpoints,
  and a tokenized "bistro" menu palette
- Repo-wide structure cleanup: removed dead components and orphaned
  content, sorted components into `ui/`/`sections/`/`layout/`,
  extracted menu page logic into `src/lib/`, synced the Keystatic and
  Astro content schemas, wired the Settings singleton into the Contact
  page, removed the unused React integration, fixed drifted docs and
  tests to match the shipped site

## [0.1.0] - 2026-05-06

### Added
- Astro 6 + TinaCMS + Tailwind v4 + Cloudflare Pages stack
- Apple iOS-inspired design system with D'ouro brand colors
- Glass navigation, Button, FeatureCard, Footer components
- 5 page routes: Home, Menu, About, Catering, Contact
- TinaCMS schema: settings, home, menu_items, faq collections
- AI agent docs: prd, design-system, architecture, agent, components
- CI/CD with Lighthouse auditing
- GitHub issue/PR templates, CODEOWNERS
