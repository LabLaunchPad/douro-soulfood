# AI Design System Master Prompt — D'ouro Soulfood Bistro

**Version:** 1.0.0
**Status:** Production
**Source of truth for token values:** `src/styles/tokens.css` (this document describes it; if they ever disagree, the CSS file wins)

## Purpose

This document defines the design system operating rules for AI agents, designers, and developers working on this repository. The objective is production-quality interfaces that are visually consistent, reusable, accessible, maintainable, and component-driven.

---

## 1. Vision

Build every interface from this reusable design system instead of designing individual screens. Every UI decision should reinforce consistency, simplicity, accessibility, scalability, composability, maintainability, and predictability. Minimize one-off designs; maximize reusable building blocks.

## 2. Design Philosophy

Principles, in priority order when they conflict: **Mobile First → Accessibility First → Components First → Content First → Tokens First → Reuse Before Create → Composition Over Duplication → Consistency Over Novelty → Simplicity Over Complexity → Clarity Over Decoration.**

## 3. Brand Configuration

| Field | Value |
|---|---|
| Brand Name | D'ouro Soulfood Bistro |
| Brand Personality | Warm, human, precise — "an award-winning family kitchen with an Apple-app's attention to detail" |
| Brand Keywords | Afro-Latin, Brazilian soul, Salzburg, handmade, warm, precise, generous |
| Design Style | "Warm Precision" — Apple iOS spatial clarity + Brazilian sensory warmth. Light theme only, no dark mode (a deliberate choice: the brand is warm cream surfaces, not a dark UI) |

## 4. Design Tokens

All token values live in `src/styles/tokens.css` under a single `@theme { }` block (Tailwind v4). See the companion docs in this folder for full detail per category:
- [`DESIGN_TOKENS.md`](./DESIGN_TOKENS.md) — full token index
- [`TYPOGRAPHY.md`](./TYPOGRAPHY.md)
- [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md)
- [`SPACING_SYSTEM.md`](./SPACING_SYSTEM.md)
- [`GRID_SYSTEM.md`](./GRID_SYSTEM.md)
- [`MOTION_SYSTEM.md`](./MOTION_SYSTEM.md)
- [`ICONOGRAPHY.md`](./ICONOGRAPHY.md)

## 5. Layout System

12-column-equivalent flow via Tailwind's flex/grid utilities (no explicit fixed-column grid framework). Max content width `max-w-7xl` (1280px), aliased `--container-content`. Breakpoints are Tailwind v4 defaults: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px. See [`GRID_SYSTEM.md`](./GRID_SYSTEM.md).

## 6. Component Inventory

Real, current inventory (not a placeholder list — verified against `src/components/` on 2026-08-07). Full contracts in [`COMPONENT_REGISTRY.md`](./COMPONENT_REGISTRY.md).

**Atoms** (`src/components/ui/`): Button, AllergenBadge, DietaryBadge, ReviewBadge, CategoryIcon, FlagIcon, FlagSprites, MapEmbed, AllergenHeaderLegend

**Sections/Organisms** (`src/components/sections/`): HeroSection, FeatureCard, OurStorySection, UserReviews, PhotoGrid, FaqAccordion, MenuItemCard, MenuBistroCard

**Layout shells** (`src/components/layout/`): NavBar, MobileNavDrawer, MobileBottomBar, Footer

**Pages** (`src/pages/`): index (home), menu, about, catering, contact, impressum, datenschutz

There is no Molecule/Template layer distinct from the above — this is a 7-page marketing/menu site, not an app; the Atom → Section → Page hierarchy is the right granularity for its scope. Do not introduce a Molecules folder or a component library abstraction layer unless the site grows a genuine second surface that needs it (per Principle: Simplicity Over Complexity).

## 7. Component Contract

Every reusable component must document: **Identity** (name, category, purpose) · **Structure** (anatomy, props, variants, states) · **Behaviour** (hover/focus/active/disabled/loading/empty) · **Accessibility** (keyboard, screen reader, contrast, touch target) · **Responsive rules** (desktop/tablet/mobile) · **Token mapping** · **Usage / anti-usage**. See [`COMPONENT_GUIDELINES.md`](./COMPONENT_GUIDELINES.md) for the template and [`COMPONENT_REGISTRY.md`](./COMPONENT_REGISTRY.md) for real components filled in against it.

## 8. Screen Review Framework

See [`SCREEN_QA_CHECKLIST.md`](./SCREEN_QA_CHECKLIST.md) — Information Architecture, Visual Hierarchy, Alignment, Components, Interaction, Accessibility, Responsive, Performance.

## 9. AI Review Checklist

See [`REVIEW_CHECKLIST.md`](./REVIEW_CHECKLIST.md).

## 10. Continuous Improvement Loop

Understand → Research → Design → Review → Critique → Accessibility Audit → Responsive Audit → Visual Polish → Refactor → Component Extraction → Documentation → Verification → Approve. Repeat until no meaningful issues remain. See [`UI_AUDIT_TEMPLATE.md`](./UI_AUDIT_TEMPLATE.md) for the reusable audit format this loop produces (used for the 2026-08-07 audit referenced throughout this folder).

## 11. Definition of Done

A screen is complete only if: spacing follows the spacing scale · colours use design tokens · typography follows the defined scale · components are reusable · accessibility checks pass · mobile experience is polished · layout follows the grid · states are implemented · empty/loading/error cases are handled · documentation is updated · no obvious visual inconsistencies remain.

**Current real status against this bar** (2026-08-07 audit): spacing and colour are ~85% compliant (documented gaps, not silent debt — see [`SPACING_SYSTEM.md`](./SPACING_SYSTEM.md) and [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md)). Typography is the one systemic gap: a complete semantic scale is defined but has zero adoption (298 raw Tailwind utility call sites instead) — see [`TYPOGRAPHY.md`](./TYPOGRAPHY.md). This is tracked, not hidden.

## 12. Repository Integration

This folder (`docs/design-system/`) is the deep reference. `docs/design-system.md` (one level up) is the OKF-governed thin summary that AI agents load by default; it points here for full detail. `.ai/packs/design-system.okf.md` points to both. Do not create a third parallel design-docs location.

## 13. Final Directive

Every design decision must be intentional, evidence-based, and aligned with this system. If an existing reusable pattern solves the problem, reuse it. If no suitable pattern exists, design a new one, document it, register it in [`COMPONENT_REGISTRY.md`](./COMPONENT_REGISTRY.md), define its tokens and accessibility requirements, and make it reusable before using it elsewhere. The system evolves through disciplined additions, not isolated exceptions.
