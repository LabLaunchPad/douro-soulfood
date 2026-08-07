# Accessibility Guidelines (WCAG 2.2)

Cross-reference: `docs/design-system/ACCESSIBILITY.md` covers the same verified findings from the component/token angle. This file applies this standard's specific target-size framing (§7), which distinguishes a *preferred* 44×44px target from the WCAG 2.2 *minimum* AA target of 24×24px — a distinction the other doc didn't separately call out.

## Target size — preferred vs. minimum, checked separately

| Element | Measured size | Meets 24×24 minimum (WCAG 2.2 SC 2.5.8)? | Meets 44×44 preferred? |
|---|---|---|---|
| `Button` `lg` | 48px min-height | ✅ | ✅ |
| `Button` `md` | 44px min-height | ✅ | ✅ (exactly) |
| `Button` `sm` | 36px min-height | ✅ | ❌ (8px short) — **not live**: this variant is used only in the `src/pages/dev/ui.astro` component showcase page, not in any production UI. No fix needed; nothing real to fix. |
| Hamburger/close toggle | 32×32px → **44×44px** | ✅ | ✅ (fixed 2026-08-07) |
| Footer social icons | 32×32px → **44×44px** (24px icon + 10px padding) | ✅ | ✅ (fixed 2026-08-07) |

**Fixed 2026-08-07**: bumped `NavBar`'s hamburger toggle and `MobileNavDrawer`'s close button from `w-8 h-8` (32px) to `w-11 h-11` (44px), and Footer's two social-icon links' padding from `p-1.5` (6px) to `p-3` (10px), reaching the same 44px total. Verified via before/after screenshots — no visual regression, just more comfortable tap area. `Button`'s `sm` variant is left at 36px since it isn't used in production (only in the dev showcase page); revisit if it's ever actually shipped somewhere.

## Contrast (WCAG 1.4.3, AA 4.5:1)

Fixed and verified this session — see `docs/design-system/ACCESSIBILITY.md` for the full before/after. Summary: `--color-brand-gold` as static text (~2:1 → fixed via `--color-brand-gold-ink`), `--color-text-tertiary` (4.1–4.3:1 near-miss → darkened).

## Keyboard & focus (WCAG 2.4.11, 2.4.7)

Verified via a real 40-element keyboard-tab test: skip link (`z-[100]`) never obscured by the fixed nav (`z-50`). `:focus-visible` outlines present and consistent (2px gold) across all interactive components.

## Motion (WCAG 2.2.2)

Hero video is the one auto-updating, non-essential content >5s on the site — gated by a dedicated JS `prefers-reduced-motion` check (the global CSS rule doesn't cover native video autoplay). See `MOTION_GUIDELINES.md`.

## Semantic structure

Skip-to-main-content link, correct landmark elements (`<nav>`, `<main>`, `<footer>`), `<dl>`/`<dt>`/`<dd>` for the opening-hours name/value list (fixed for visual alignment this session without changing the semantic structure).

## Known process gap

CI's `@axe-core/playwright` accessibility gate covers 2 of 7 routes. Not yet widened — a real, tracked gap, not hidden.
