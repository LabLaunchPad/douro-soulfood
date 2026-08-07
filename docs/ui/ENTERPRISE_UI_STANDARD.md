# Ship-Ready Enterprise UI Standard — D'ouro Soulfood Bistro

**Version:** 1.1.0
**Status:** Production
**Scope applied here:** web, mobile web, responsive marketing/menu site (this is not a SaaS/dashboard/auth product — several sections of the source standard below are marked N/A for that reason, honestly, not silently skipped)

## Purpose

This is this repository's copy of the Ship-Ready Enterprise UI Standard, filled in with real values verified against this codebase (not placeholders), and cross-referenced against `docs/design-system/` where the two systems cover the same ground (color/typography/spacing tokens are literally the same `src/styles/tokens.css` — there is one token source, described from two angles by two standards).

## Relationship to `docs/design-system/`

Both doc trees exist by explicit choice (not oversight — the alternative of merging them was offered and declined). They describe the same underlying tokens through two different lenses:
- `docs/design-system/` — the "Warm Precision" brand-and-component lens (component contracts, brand voice, the typography-scale-realignment history).
- `docs/ui/` (this folder) — the enterprise-checklist lens (surface roles, component-state completeness, WCAG 2.2 target-size specifics, QA gates).

If a token *value* ever needs to change, change it once in `src/styles/tokens.css` and update both doc trees — there is one source of truth for values, two documented perspectives on them.

## 1. Diagnosis applied to this repo

Real findings, not the standard's generic failure list:
- ✅ Role-based color tokens exist and are ~98% adopted (2 sub-palettes — bistro-menu and footer-metallic — are deliberate exceptions, not drift; see `COLOR_SYSTEM.md`).
- ✅ Single spacing system (Tailwind 4px scale); 75 documented half-step exceptions in compact UI, judged defensible not drift (see `SPACING_SYSTEM.md`).
- ✅ Type hierarchy exists and is now token-aligned (see `TYPOGRAPHY.md`).
- ✅ No invented one-off components found — verified against the real component inventory (see `COMPONENT_REGISTRY.md`).
- ⚠️ Component states: this is a static-content site with no async data, so Loading/Error states as the standard defines them mostly don't apply — documented explicitly per-component rather than silently assumed (see `COMPONENT_STANDARDS.md`).
- ✅ Keyboard focus, contrast, and target size verified this session against WCAG 2.2 (see `ACCESSIBILITY_GUIDELINES.md`).
- ✅ Mobile verified via real Puppeteer screenshots, not assumption (see `MOBILE_QA_CHECKLIST.md`).

## 2. Design principles

Mobile first · Accessibility first · Tokens first · Components first · Content first · Reuse before reinvention · Consistency before creativity · Clarity before decoration · Stability before novelty · Verification before approval.

## 3. Brand configuration

| Field | Value |
|---|---|
| Brand Name | D'ouro Soulfood Bistro |
| Brand Personality | Warm, human, precise |
| Brand Tone | Direct, warm German-first copy — no corporate register |
| Brand Style | "Warm Precision" — Apple iOS spatial clarity + Brazilian sensory warmth |
| Brand Audience | Local Salzburg diners, walk-in + delivery (Lieferando) customers |
| Product Category | Restaurant marketing + digital menu site |

## 4–9. Token system, layout, components, accessibility, mobile, visual polish

See the companion files in this folder — each covers one category in depth, grounded in real grep/measurement data from 2026-08-07:
[`BRAND_TOKENS.md`](./BRAND_TOKENS.md) · [`DESIGN_TOKENS.md`](./DESIGN_TOKENS.md) · [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md) · [`SURFACE_SYSTEM.md`](./SURFACE_SYSTEM.md) · [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) · [`SPACING_SYSTEM.md`](./SPACING_SYSTEM.md) · [`GRID_SYSTEM.md`](./GRID_SYSTEM.md) · [`COMPONENT_STANDARDS.md`](./COMPONENT_STANDARDS.md) · [`COMPONENT_REGISTRY.md`](./COMPONENT_REGISTRY.md) · [`ACCESSIBILITY_GUIDELINES.md`](./ACCESSIBILITY_GUIDELINES.md) · [`RESPONSIVE_GUIDELINES.md`](./RESPONSIVE_GUIDELINES.md) · [`MOTION_GUIDELINES.md`](./MOTION_GUIDELINES.md)

## 10. Verification loop

Applied for real on 2026-08-07 (see `VISUAL_QA_CHECKLIST.md` and `MOBILE_QA_CHECKLIST.md` for the filled-in results): understand → select existing patterns → apply tokens → build with the grid → verify states → verify mobile (real screenshots) → verify accessibility (real keyboard/contrast tests) → stress test (long/short labels) → inspect contrast/focus → remove noise → refactor → re-check → approve.

## 11–12. QA checklist and Definition of Done

See [`VISUAL_QA_CHECKLIST.md`](./VISUAL_QA_CHECKLIST.md), [`MOBILE_QA_CHECKLIST.md`](./MOBILE_QA_CHECKLIST.md), and [`AI_REVIEW_PROMPT.md`](./AI_REVIEW_PROMPT.md) (the reusable prompt for running this checklist against future changes).

## 13. Repository structure

This folder matches the standard's section 13 exactly, populated with real content rather than left as scaffolding.

## 14. Governance

Any new color, surface, component, background style, motion pattern, or layout pattern must be justified, mapped to a token, documented here, tested, accessible, and added to `COMPONENT_REGISTRY.md` before broad use. No exceptions bypass the system without recording why (see each file's "deliberate exception" notes for the precedent pattern to follow).
