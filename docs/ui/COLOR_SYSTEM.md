# Color System

Full narrative and fix history: `docs/design-system/COLOR_SYSTEM.md`. This file states the current, verified status against this standard's specific rules.

## Token coverage (verified via grep, 2026-08-07)

- **Zero raw hex** outside `FlagSprites.astro`'s literal national-flag fills (explicit, correct exception — flag colors aren't brand decisions).
- **38 of 44** previously-un-tokenized `stone-*`/`amber-*`/`zinc-*` call sites now route through tokens (Footer → `--color-text-tertiary`; bistro-theme components → 5 new `--color-bistro-*` tokens).
- **6 remaining** amber accents (prep-time/allergen warnings) deliberately left un-tokenized — they span two visual contexts (light bistro paper vs. dark photo overlay) that would need two different token values, are internally consistent within each context, and have never failed a contrast check.
- **Footer's `zinc-*`/`neutral-*`** "Metallic Capsule Card" — deliberately excluded from tokenization. This is a real, intentional, separate surface treatment (see `SURFACE_SYSTEM.md`), not a stand-in for the main text-muted role.

## Contrast (WCAG 2.2 §7, this standard's §7)

`--color-brand-gold` used as static text measured ~2:1 against light backgrounds (need 4.5:1) — **fixed**: `--color-brand-gold-ink` introduced for text use, original token kept for decorative/icon/dark-overlay use only. `--color-text-tertiary` was a 4.1–4.3:1 near-miss — **fixed**, darkened to 5.7–6:1. Both verified via a real Puppeteer contrast-measurement pass, re-verified after the fix (the 147-instance finding dropped to 0).

## Color-does-not-carry-meaning-alone check (this standard's §7)

- Allergen badges use both color (amber) AND a letter code (A/B/E/F/G-M/R) — meaning isn't color-only.
- Dietary badges (vegan/vegetarian/gluten-free/etc.) use both color AND the tag label text — not color-only.
- Star ratings use both filled/unfilled star icons AND a numeric score alongside — not color-only.
- The one availability state (`MenuItemCard`'s `available=false`) uses an explicit "Nicht verfügbar" text banner, not just a dimmed/greyed-out visual treatment.

No color-only-signal violations found.
