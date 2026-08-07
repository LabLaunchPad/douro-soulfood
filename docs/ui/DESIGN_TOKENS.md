# Design Tokens

Source of truth: `src/styles/tokens.css`, a single Tailwind v4 `@theme { }` block. This file maps this standard's requested token categories (section 4) to the real names in that file.

## 4.1 Color tokens — this standard's names vs. this repo's real tokens

| Standard's requested role | This repo's real token |
|---|---|
| `color.primary` | `--color-brand-terracotta` |
| `color.primaryHover` / `.primaryActive` | `--color-brand-terracotta-light` / `-dark` |
| `color.secondary` | `--color-brand-gold` (decorative) / `--color-brand-gold-ink` (text-safe) |
| `color.accent` | `--color-brand-forest` (fresh/vegan indicator) |
| `color.success` | Not separately tokenized — no success/confirmation UI exists on this static site (no forms with submission states) |
| `color.warning` | Amber accents (`amber-*`), deliberately not tokenized — see `COLOR_SYSTEM.md` for why |
| `color.error` | Not tokenized — no error states exist (no forms, no async data) |
| `color.info` | Not tokenized — not needed |
| `text.primary` / `.secondary` / `.muted` | `--color-text-primary` / `-secondary` / `-tertiary` |
| `text.inverse` | `--color-text-inverse` |
| `text.disabled` | Not tokenized — no disabled interactive states exist (all CTAs are always-enabled links/buttons; the one conditional-availability case, `MenuItemCard`'s `available=false`, uses an overlay banner, not a disabled-button pattern) |
| `border.default` / `.subtle` / `.strong` | `--color-border-default` / `-subtle` / `-emphasis` |
| `border.focus` | `--color-brand-gold` via `focus-visible:outline` (not a dedicated border token, but consistently applied) |
| `surface.*` | See [`SURFACE_SYSTEM.md`](./SURFACE_SYSTEM.md) |

**Honest gap**: this repo doesn't have Success/Error/Info color roles because it doesn't have the UI surfaces that would need them (no forms with validation, no async success/failure states, no notification/toast system). Per this standard's own governance rule (section 14: "any new... must be justified by a real need"), adding these tokens speculatively would violate that rule, not satisfy it. Add them when a real feature needs them, not before.

## 4.4 Spacing tokens

This repo's real scale is Tailwind's default (verified to already equal the standard's requested `4/8/12/16/24/32/40/48/56/64/80/96` scale exactly) plus two custom section-level tokens: `--spacing-section` (120px desktop) / `--spacing-section-mobile` (72px). See [`SPACING_SYSTEM.md`](./SPACING_SYSTEM.md).

## 4.5 Radius, elevation, motion

| Standard's token | This repo's real token | Value |
|---|---|---|
| `radius.xs`–`.full` | `--radius-xs`–`-full` | 6px / 10px / 14px / 20px / 28px / 40px / 9999px |
| `shadow.none`–`.xl` | `--shadow-xs`–`-xl` + `--shadow-glow-gold` | See [`SURFACE_SYSTEM.md`](./SURFACE_SYSTEM.md) |
| `motion.fast/normal/slow` | `--duration-fast/normal/slow/entrance` | 200ms / 350ms / 500ms / 700ms |

Full detail: [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md), [`TYPOGRAPHY.md`](./TYPOGRAPHY.md), [`SPACING_SYSTEM.md`](./SPACING_SYSTEM.md), [`SURFACE_SYSTEM.md`](./SURFACE_SYSTEM.md), [`MOTION_GUIDELINES.md`](./MOTION_GUIDELINES.md).
