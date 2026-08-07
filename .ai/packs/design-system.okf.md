---
okf_version: "0.2"
id: "pack/design-system"
type: "knowledge"
title: "Design System"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/design-system.md", "src/styles/tokens.css"]
attestation:
  method: "agent"
  checks: ["verified zero hardcoded hex outside flag-SVG fills in a prior audit this session"]
summary: "All design tokens live in src/styles/tokens.css as CSS custom properties (--color-brand-gold, --radius-*, --ease-spring). Light theme is default. Apple-iOS precision with Brazilian warmth."
load_when: "Any styling/token work."
token_budget: 300
related: ["docs/design-system.md", "docs/design-system/", "docs/ui/", "src/styles/tokens.css"]
---

# Design System

Single source of truth: `src/styles/tokens.css`, referenced via `var(--...)`. Zero hardcoded hex colors anywhere in `src/` except literal flag-emoji SVG fills (a legitimate, explicitly-allowed exception, not a violation).

Light theme is default (warm cream surfaces, high-contrast espresso text) — not dark. Fraunces (display/headings) + DM Sans (body), both self-hosted (`public/fonts/`), not loaded from Google.

Use `class:list={[...]}` for conditional/merged classes. No `cn()`/`clsx` helper exists — don't reintroduce one.

`tokens.css`'s semantic type scale was realigned 2026-08-07 to match the real, disciplined Tailwind-utility usage pattern already in `src/` (was invented values with zero adoption; now the token values equal the Tailwind steps in real use, zero visual change). See `docs/design-system/TYPOGRAPHY.md`.

**Full detail**: `docs/design-system.md` (summary) → `docs/design-system/` (deep reference: component registry, accessibility playbook, audit template).
