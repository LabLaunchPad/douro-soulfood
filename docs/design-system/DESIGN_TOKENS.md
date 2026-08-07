# Design Tokens — Master Index

Source of truth: `src/styles/tokens.css`, a single `@theme { }` block (Tailwind v4 — every `--color-*`/`--radius-*`/`--text-*` custom property here auto-generates matching Tailwind utility classes). All values below verified against that file on 2026-08-07.

The file is organized in two explicit tiers, labeled inline: `TIER 1 — PRIMITIVE` (brand/bistro palettes, radius/shadow/spacing/motion/type/breakpoint scales) and `TIER 2 — SEMANTIC` (surface/text/border/container/z-index, built from Tier 1). There's deliberately no third "component token" tier — see the file's own header comment and `.ai/decisions/design-tokens.okf.md` for why.

## Token categories

| Category | Count | Detail doc | Adoption status |
|---|---|---|---|
| Color | ~45 tokens across brand/surface/text/border roles + 8 bistro-menu hex + 5 bistro-muted hex | [`COLOR_SYSTEM.md`](./COLOR_SYSTEM.md) | Strong (0 raw hex outside literal flag SVGs; 38/44 previously-un-tokenized call sites fixed 2026-08-07, remaining 6 verified as correctly context-specific, not a gap) |
| Typography | 12 semantic scale steps (`--text-label` → `--text-display-md`), realigned 2026-08-07 to equal Tailwind's real, disciplined 17-combination usage pattern | [`TYPOGRAPHY.md`](./TYPOGRAPHY.md) | Tokens now describe reality (298 call sites render identically; new/refactored components should reach for the named token) |
| Spacing | Tailwind's default 4px scale + 2 custom section tokens | [`SPACING_SYSTEM.md`](./SPACING_SYSTEM.md) | Good (75 documented half-step exceptions in compact UI, not silent). `--spacing-section-mobile` (72px) was defined but unused anywhere in `src/` until 2026-08-07's mobile-homepage pass — now adopted as `py-section-mobile` across all 8 homepage section boundaries (`index.astro`, `PhotoGrid.astro`, `OurStorySection.astro`, `FaqAccordion.astro`, `UserReviews.astro`); `--spacing-section` (desktop, 120px) remains unused, out of scope for that mobile-only pass |
| Radius | 7 steps (`--radius-xs` 6px → `--radius-full`) | this doc | Strong (Tailwind's `rounded-*` utilities map directly to these; fully adopted) |
| Shadow/Elevation | 5 steps + 1 brand glow | this doc | Consistent |
| Motion | 4 easing curves + 4 durations | [`MOTION_SYSTEM.md`](./MOTION_SYSTEM.md) | Consistent |
| Z-index | 6 named layers | this doc | Partial (new overlay components use it; older components use raw `z-10`/`z-20` etc.) |

## Radius scale

```
--radius-xs:   0.375rem (6px)   — badges, tiny tags
--radius-sm:   0.625rem (10px)  — buttons, inputs, small cards
--radius-md:   0.875rem (14px)  — medium cards, dropdowns
--radius-lg:   1.25rem (20px)   — feature cards, modals
--radius-xl:   1.75rem (28px)   — hero overlays, large panels
--radius-2xl:  2.5rem (40px)    — glassmorphic hero elements
--radius-full: 9999px           — avatars, pills, chips
```

## Shadow / elevation scale

```
--shadow-xs: 0 1px 2px  oklch(0.20 0.02 40 / 0.03)
--shadow-sm: 0 2px 8px  oklch(0.20 0.02 40 / 0.05)
--shadow-md: 0 4px 16px oklch(0.20 0.02 40 / 0.08)
--shadow-lg: 0 8px 32px oklch(0.20 0.02 40 / 0.12)
--shadow-xl: 0 16px 48px oklch(0.20 0.02 40 / 0.16)

--shadow-glow-gold: 0 0 40px oklch(0.6812 0.2208 142.67 / 0.15)
  — deliberate brand decoration ("glows with Brazilian sunshine," per
  the source comment), not AI-slop drift. Verified intentional in the
  2026-08-07 audit; do not remove or flag as an anti-pattern.
```

## Z-index scale

```
--z-index-dropdown: 1000
--z-index-sticky:   1100
--z-index-overlay:  1200
--z-index-modal:    1300
--z-index-popover:  1400
--z-index-toast:    1500
```

Named for new overlay-type components. Existing shipped components (`NavBar` at `z-50`, skip-link at `z-[100]`, MobileNavDrawer, etc.) predate this scale and use raw Tailwind `z-*` values — verified in the 2026-08-07 accessibility audit that the two current fixed/sticky layers (`NavBar` `z-50`, skip-link `z-[100]`) stack correctly (skip-link always wins, never obscured — WCAG 2.2 SC 2.4.11 verified compliant). Route new overlay components (modals, toasts, dropdowns) through the named scale, not raw numbers.
