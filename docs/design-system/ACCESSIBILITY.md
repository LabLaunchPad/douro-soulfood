# Accessibility Playbook (WCAG 2.2)

Real status against WCAG 2.2, verified via actual browser tests this session — not assumed from the presence of a CI gate alone (a real gap this playbook exists to close: CI's `@axe-core/playwright` currently only runs against 2 of 7 routes, per `docs/design-system.md`'s cross-reference; broader manual/scripted verification is what caught the findings below).

## 1.4.3 Contrast (Minimum) — AA, 4.5:1 text / 3:1 large text

**Status: fixed, verified.** `--color-brand-gold` used as static text measured ~2:1; introduced `--color-brand-gold-ink` and swapped every static/hover-text usage on light backgrounds. `--color-text-tertiary` was a 4.1–4.3:1 near-miss, darkened to 5.7–6:1. Re-verified via a real Puppeteer contrast-measurement pass: the dominant finding (147 instances) dropped to 0. See `COLOR_SYSTEM.md` for full detail including two residual findings ruled out as environment artifacts.

## 2.5.8 Target Size (Minimum) — AA, 24×24 CSS px

**Status: compliant, verified.** Spot-checked: hamburger/close buttons 32×32px, footer social icons 32×32px (24px icon + 6px padding), `Button` component's smallest variant 36px min-height. All clear the floor with margin.

## 2.4.11 Focus Not Obscured (Minimum) — AA

**Status: compliant, verified.** Ran a real 40-element keyboard-tab test across a representative page. The one apparent hit (skip-link bounding box overlapping the fixed nav's bounding box) was a false positive from a naive box-only check — the skip link is `z-[100]`, the nav is `z-50`, so it always renders above, never actually obscured. Verified by reading the source, not just the geometry.

## 2.2.2 Pause, Stop, Hide — A

**Status: compliant for the one qualifying case.** The hero background video is the only auto-updating, non-essential content lasting >5s. It's gated by a dedicated JS check for `prefers-reduced-motion: reduce` (the global CSS rule doesn't cover native video autoplay) — skips loading/playing entirely when set. See `MOTION_SYSTEM.md`.

## 1.4.10 Reflow — AA

**Status: verified via real viewport tests.** No horizontal overflow or clipped content found at 390px width across all 7 routes.

## Keyboard & focus-visible

`:focus-visible` outlines present and using a consistent 2px gold outline pattern (`Button`, skip-link, and others). A prior audit (referenced in `docs/design-system.md`) found and fixed one missing-outline case in `MobileNavDrawer`'s close button — the fix (a real ring, not `outline: none` with nothing replacing it) is the reference pattern; don't reintroduce the bug it fixed.

## Semantic structure

Skip-to-main-content link present (`Base.astro`, `sr-only`/`focus:not-sr-only`). Landmark elements used correctly (`<nav>`, `<main>`, `<footer>`). Opening-hours list uses `<dl>`/`<dt>`/`<dd>` (semantically correct for name/value pairs), fixed 2026-08-07 for visual column alignment without changing the semantic structure.

## Known process gap

CI's automated accessibility gate (`@axe-core/playwright`) covers 2 of 7 routes. This playbook's manual/scripted verification catches what that gate can't see (cross-page consistency, contrast on routes CI doesn't visit, real keyboard-navigation flow) — but widening the CI gate to all 7 routes is the actual fix for making this repeatable without a human/agent audit each time. Tracked as a backlog item, not yet done.
