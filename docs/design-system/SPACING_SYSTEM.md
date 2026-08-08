# Spacing System

## Base grid: 4px (Tailwind default scale)

```
p-1  = 4px    p-6  = 24px   p-16 = 64px
p-2  = 8px    p-8  = 32px   p-20 = 80px
p-3  = 12px   p-10 = 40px   p-24 = 96px
p-4  = 16px   p-12 = 48px
p-5  = 20px   p-14 = 56px
```

This matches the Material 3 / Carbon-style "4/8px rhythm" rule exactly — Tailwind's own default scale already lands on it.

## Section-level spacing (custom tokens)

```
--spacing-section: 7.5rem (120px)        — desktop section vertical padding
--spacing-section-mobile: 2rem (32px)    — mobile section vertical padding (was 4.5rem/72px until the 2026-08-07 mobile-first conversion redesign — a deliberate tighter, app-like rhythm per an explicit design brief, not a consistency fix)
```

## Rules

- Never invent a spacing value outside the scale above.
- Align padding, margin, and gap to the same scale — don't mix a `p-4` card with a `gap-[13px]` internal layout.
- On mobile, the 32px section rhythm holds consistently across all 9 homepage section-wrapper declarations (and every other route) — components inside a section compress further, the section rhythm itself does not. A component's own root section (e.g. `PhotoGrid.astro`, `OurStorySection.astro`, `FaqAccordion.astro`, `UserReviews.astro`) should be rendered directly, not wrapped in a second `<section class="py-section-mobile">` in the calling page — doing so silently doubles the padding (caught and fixed 2026-08-08 for `UserReviews` on the homepage, which had exactly this bug).

## Known deviation: fractional (half-step) spacing

**75 call sites** (verified via grep, 2026-08-07) use fractional Tailwind spacing utilities — `-0.5`, `-1.5`, `-2.5`, `-3.5` → 2px / 6px / 10px / 14px — which fall between the 4px grid steps. Concentrated in compact UI: icon-to-text gaps and badge/chip internal padding (`AllergenHeaderLegend.astro`, `MenuBistroCard.astro`, `ReviewBadge.astro`, `Footer.astro`, `menu.astro`, `Button.astro`).

```
grep -rnoE '\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(0\.5|1\.5|2\.5|3\.5)\b' src/
→ 75 matches
```

**This is documented as a known deviation, not silently accepted debt, and deliberately not auto-fixed.** Reasoning: half-steps are common, defensible practice for icon+text gaps at small scale, where a pure 4px gap reads cramped and 8px reads loose — 6px is frequently the actually-correct choice for a 12–14px icon next to 11–12px text. Normalizing all 75 to the strict grid would require per-instance visual judgment (some genuinely should move to 4/8px; some are correct as-is), which is exactly the kind of change this design system's own verification-loop rule says must be visually checked one at a time, not regex-replaced. Treat this list as the backlog for that pass, not as "already fine."

## Zero arbitrary bracket-pixel spacing

`grep -rnoE '\b(p|m|gap)-\[[0-9.]+px\]' src/` → 0 matches. No one-off `p-[13px]`-style escapes from the scale exist — the only deviation is the fractional-utility half-steps above, which are still *on* Tailwind's design-token system, just at a finer grain than the strict 4px rule.
