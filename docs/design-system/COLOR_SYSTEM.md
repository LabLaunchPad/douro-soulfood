# Color System

All colors defined in OKLCH (perceptually uniform, better interpolation than RGB/HSL) inside `src/styles/tokens.css`'s `@theme { }` block, except the menu-page bistro palette (see below), which is a documented, intentional exception.

## Brand roles

| Role | Token | Value | Notes |
|---|---|---|---|
| Primary CTA | `--color-brand-terracotta` | `oklch(0.56 0.18 24.5)` | Earthy rust red; light/dark variants for hover/press |
| Secondary CTA / accent | `--color-brand-gold` | `oklch(0.78 0.18 85.0)` ≈ `#ebab00` | **Decorative use only** — see contrast note below |
| Text-safe accent | `--color-brand-gold-ink` | `oklch(0.46 0.16 85.0)` ≈ `#804b00` | Added 2026-08-07; use for any static/hover *text* that was reaching for `--color-brand-gold` |
| Fresh/vegan indicator | `--color-brand-forest` | `oklch(0.68 0.22 142.5)` | |
| Neutral dark | `--color-brand-espresso` | `oklch(0.12 0.01 0)` | Near-black warm tone, not pure black |
| Neutral light | `--color-brand-cream` | `oklch(0.98 0.005 80)` | Page background family |

## Surface roles

`--color-surface-primary` (page bg) · `--color-surface-elevated` (nav, subtle separation) · `--color-surface-card` (menu items, feature cards) · `--color-surface-glass` (frosted glass, `oklch(1.0 0.002 80 / 0.9)` — opacity raised from `0.72` on 2026-08-07 for testimonial-card legibility)

## Text roles

`--color-text-primary` (`oklch(0.20 0.02 40)`, deep espresso) · `--color-text-secondary` (`oklch(0.42 0.02 45)`, medium-dark warm grey) · `--color-text-tertiary` (`oklch(0.50 0.015 50)`, darkened from `0.58` on 2026-08-07 — was a 4.1–4.3:1 near-miss against the 4.5:1 AA floor) · `--color-text-inverse` (cream, for text on filled dark/CTA surfaces)

## Border roles

`--color-border-subtle` (6% opacity) · `--color-border-default` (10%) · `--color-border-emphasis` (20%) — all derived from the same dark-neutral base at different alpha, not separate hues.

## Bistro menu palette (documented exception)

A secondary, visually distinct gold/cream palette used specifically for the menu page's category banners and allergen legend (deeper ink, brighter gold than the primary brand palette). Stored as raw hex (`--color-bistro-banner: #1B140E` etc.) rather than OKLCH — this was a deliberate 1:1 preservation during an earlier tokenization pass (values were previously hardcoded scattered hex; centralizing them was the fix, remapping them to the OKLCH brand scale was explicitly out of scope to avoid a visual change). Not a violation to "fix" — it's load-bearing menu-page identity.

## Un-tokenized neutrals — fixed 2026-08-07

44 call sites used Tailwind's default `stone-*`/`amber-*`/`zinc-*` palette directly instead of a project token. Investigated each by context rather than blind-swapping all 44:

- **Bistro-theme muted text/placeholders** (`MenuBistroCard.astro`, `AllergenHeaderLegend.astro`, `menu.astro`'s image placeholders — ~28 sites): these belong to the deliberately-separate bistro sub-palette (see above), so routing them through the *main* brand's `--color-text-tertiary` would risk a visual mismatch against that palette's warmer ink/paper tones. Instead, added five new bistro-scoped tokens — `--color-bistro-muted`, `-muted-dark`, `-text`, `-text-strong`, `-placeholder` — set to the exact hex values the `stone-*` classes were already resolving to (`#78716c`/`#57534e`/`#44403c`/`#292524`/`#f5f5f4`). Zero visual change, now under the same token-governance as the rest of the bistro palette.
- **Footer's "Outer Bottom Bar"** (social icons, phone link, copyright, address — 6 sites): unambiguously in the main brand-theme context (not inside the separate silver "metallic capsule" card, which correctly keeps its own `zinc-*` treatment — see below). Routed through the existing `--color-text-tertiary` token. Verified via before/after screenshot: a subtle, appropriate warmth shift (Tailwind's neutral `stone-500` → the brand's warm-toned tertiary grey), not a regression — the rest of the site already used this token for the same semantic role.
- **Amber usages** (prep-time indicators, allergen-warning accents — 6 sites, `AllergenBadge.astro`, `MenuItemCard.astro`, `MenuBistroCard.astro`): left as-is, deliberately. These split across two different visual contexts (light bistro-paper cards vs. dark photo-overlay cards) that would need two different token values anyway, are already internally consistent within each context, and were not flagged in any contrast audit. Not a real gap — introducing a single `--color-warning` token here would either not fit one context or require two tokens for what's currently working correctly without one.
- **Footer's `zinc-300`/`zinc-900`/`zinc-700`/`neutral-*`** ("Main Floating Medium Silver Metallic Capsule Card," per its own source comment): deliberately excluded. This is an intentional, separate "metallic" surface treatment distinct from the cream page background — its `zinc-*` (cooler grey) values are calibrated for contrast against that specific silver card, not a stand-in for the main muted-text role. Left untouched.

## Contrast — verified findings (2026-08-07)

`--color-brand-gold` used as **static text** color (headings, eyebrow labels, hover links) on light backgrounds measured **~2:1 contrast**, against a 4.5:1 WCAG AA requirement (1.4.3) — confirmed via a real Puppeteer contrast-measurement pass, not estimated. **Fixed**: introduced `--color-brand-gold-ink` (same hue, `L=0.46` instead of `0.78`) and swapped every static-text usage on a light background to it; kept the original token for decorative/icon/dark-overlay use where contrast rules don't apply (verified per-instance which category each of ~30 call sites fell into before swapping — not a blind rule). Re-verified after the fix: the 147-instance low-contrast finding for this pattern dropped to 0.

`--color-text-tertiary` was a 4.1–4.3:1 near-miss (fixed, see above).

Two residual `low-contrast` findings from the automated detector (testimonial glass-card text, ~1–1.8:1; hero nav text on load) were checked against real Puppeteer screenshots and both render with clearly legible text — traced to this sandbox's headless Chromium not compositing `backdrop-filter` the way it screenshots. Documented as a detector/environment limitation, not a live defect, so a future audit doesn't re-flag and "re-fix" a token that's already correct.

## Zero hardcoded hex outside one explicit exception

`FlagSprites.astro` contains 8 raw hex values — literal German/UK national-flag colors (`#DD0000`, `#FFCE00`, `#012169`, `#C8102E`, etc.). This is correctly excluded from the "no hardcoded hex" rule: these are fixed national-flag colors, not brand decisions, and would be wrong if remapped to any brand token.
