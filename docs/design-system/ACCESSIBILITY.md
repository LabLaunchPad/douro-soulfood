# Accessibility Playbook (WCAG 2.2)

Real status against WCAG 2.2, verified via actual browser tests this session — not assumed from the presence of a CI gate alone.

Update 2026-08-07: CI's `@axe-core/playwright` gate now runs against all 7 routes (was 5/7 with working assertions — `about`/`catering`/`contact`/`home`/`menu` already had them; this doc's earlier "2 of 7" figure was itself stale. `impressum` and `datenschutz` had no spec file at all — added `tests/impressum.spec.ts` and `tests/datenschutz.spec.ts`, following the existing content+accessibility+SEO pattern). Running the full 7-route matrix at tablet/wide/narrow/mobile/desktop viewports surfaced three real violations, all fixed this pass: `MobileBottomBar` rendered outside any landmark (`region`) — changed its wrapper `<div>` to `<nav aria-label="…">`; a duplicate nested `Gästebewertungen` landmark on the homepage (`landmark-unique`) — removed the redundant outer wrapper's `aria-label` since `UserReviews.astro` already declares it; and body-text links on `/impressum`/`/datenschutz` distinguishable by color alone (`link-in-text-block`, serious) — added a default (not hover-only) underline.

## 1.4.3 Contrast (Minimum) — AA, 4.5:1 text / 3:1 large text

**Status: fixed, verified.** `--color-brand-gold` used as static text measured ~2:1; introduced `--color-brand-gold-ink` and swapped every static/hover-text usage on light backgrounds. `--color-text-tertiary` was a 4.1–4.3:1 near-miss, darkened to 5.7–6:1. Re-verified via a real Puppeteer contrast-measurement pass: the dominant finding (147 instances) dropped to 0. See `COLOR_SYSTEM.md` for full detail including two residual findings ruled out as environment artifacts.

## 2.5.8 Target Size (Minimum) — AA, 24×24 CSS px

**Status: compliant, verified, floor raised 2026-08-07.** WCAG's own floor is 24×24px; this site had already adopted a stricter 44px convention, and as of the mobile-first conversion redesign that floor is 48px sitewide — `Button.astro`'s `sm`/`md`/`lg` sizes are all `min-h-12` (48px, previously `sm` was 36px/`md` was 44px), and every hand-rolled tap target that previously used `min-h-11` (`MobileBottomBar`, `FaqAccordion` summary, `MapEmbed` button, `NavBar`/`MobileNavDrawer` pill, homepage category tiles) now uses `min-h-12`. Verified via measured `boundingBox()` height (not just class presence) across the homepage's CTAs post-redesign. Deliberate density exception 2026-09-27: footer nav/legal links and the footer phone link hold the 24px AA floor on desktop (`md:min-h-6`) instead of 48px — a full-height footer would materially alter the capsule design; mobile keeps `min-h-12`.

## 2.4.11 Focus Not Obscured (Minimum) — AA

**Status: compliant, verified.** Ran a real 40-element keyboard-tab test across a representative page. The one apparent hit (skip-link bounding box overlapping the fixed nav's bounding box) was a false positive from a naive box-only check — the skip link is `z-[100]`, the nav is `z-50`, so it always renders above, never actually obscured. Verified by reading the source, not just the geometry.

## 2.2.2 Pause, Stop, Hide — A

**Status: compliant for both qualifying cases.** The hero background video is auto-updating, non-essential content lasting >5s. It's gated by a dedicated JS check for `prefers-reduced-motion: reduce` (the global CSS rule doesn't cover native video autoplay) — skips loading/playing entirely when set. See `MOTION_SYSTEM.md`. The testimonial marquee (`UserReviews.astro`) is the second case: hover-pause alone does not satisfy 2.2.2 (keyboard/touch users get nothing; a focus-only stop that restarts on blur is explicitly not a mechanism per the Understanding doc). Fixed 2026-09-27 with a native `<button data-marquee-toggle>` first in the section's reading order (label swaps pausieren/fortsetzen, `aria-controls` the track, explicit stop sticks until re-activated), transient `:hover` pause as supplement only, and the existing reduced-motion static fallback. Track B stays `aria-hidden`. Guarded by `tests/p0-regression.spec.ts` (toggle, stickiness, reduced-motion, aria-hidden).

## 1.4.10 Reflow — AA

**Status: verified via real viewport tests.** No horizontal overflow or clipped content found at 390px width across all 7 routes.

## Keyboard & focus-visible

`:focus-visible` outlines present and using a consistent 2px gold outline pattern (`Button`, skip-link, and others). A prior audit (referenced in `docs/design-system.md`) found and fixed one missing-outline case in `MobileNavDrawer`'s close button — the fix (a real ring, not `outline: none` with nothing replacing it) is the reference pattern; don't reintroduce the bug it fixed. Fixed 2026-09-27: the same `focus:outline-none`-with-no-replacement pattern was found on the hamburger trigger (`NavBar.astro`) and the drawer close button had regressed to it — both now carry the explicit `focus-visible` gold ring (deleting the override alone would have worked via the global `:focus-visible` rule, but the explicit classes match the logo-link/hero-CTA pattern and survive future global resets). Same pass: `MenuBistroCard`'s stretched-card link used `focus:outline-none` + off-token amber ring — now `focus-visible` ring in `brand-gold-ink` (gold-ink, not gold: the card surface is light paper, same contrast logic as the gold/gold-ink text split). `ReviewBadge`'s star wrapper carried contradictory `role="img" aria-hidden="true"` — dropped the role (parent already names the rating; a role without a name is worse than none). Guarded by `tests/p0-regression.spec.ts` (real Tab, computed outline) and `tests/p1-homepage.spec.ts`.

## Semantic structure

Skip-to-main-content link present (`Base.astro`, `sr-only`/`focus:not-sr-only`). Since 2026-09-27 the link actually moves focus: `<main id="main-content" tabindex="-1">` (previously Safari/AT focus stayed on body). Landmark elements used correctly (`<nav>`, `<main>`, `<footer>`); the homepage proof strip is labelled `Google-Bewertung` (was the confusable `Bewertungen`, colliding with the `Gästebewertungen` reviews section in landmark rotors). Hero background layer is `aria-hidden` decorative (was `role="region" aria-live="polite"`). Category icons and badge stars are `aria-hidden` (no unnamed graphics). Opening-hours list uses `<dl>`/`<dt>`/`<dd>` (semantically correct for name/value pairs), fixed 2026-08-07 for visual column alignment without changing the semantic structure.

## Known process gap

~~CI's automated accessibility gate (`@axe-core/playwright`) covers 2 of 7 routes.~~ **Closed 2026-08-07** — all 7 routes now have a passing `zero axe accessibility violations` test (`tests/*.spec.ts`, `wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa` tags). This playbook's manual/scripted verification still matters for what an automated gate structurally can't see (cross-page consistency, real keyboard-navigation flow) — but the "does every route pass axe" question is now answered by CI on every push, not by a periodic manual/agent audit.
