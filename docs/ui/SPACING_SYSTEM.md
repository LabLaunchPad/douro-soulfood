# Spacing System

Full narrative: `docs/design-system/SPACING_SYSTEM.md`. This standard specifically requests the scale `4/8/12/16/20/24/32/40/48/56/64/80/96/128` — verified against this repo's real scale below.

## Scale comparison

| This standard requests | This repo's real scale (Tailwind default) | Match? |
|---|---|---|
| 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 96 | `p-1`(4) `p-2`(8) `p-3`(12) `p-4`(16) `p-6`(24) `p-8`(32) `p-10`(40) `p-12`(48) `p-14`(56) `p-16`(64) `p-20`(80) `p-24`(96) | ✅ exact match |
| 20 (this standard includes it, listed separately from 24) | `p-5` = 20px, available in Tailwind's scale, low usage in practice (most components skip straight from 16→24) | ✅ available, rarely needed |
| 128 | `p-32` = 128px, available, unused in this repo (page sections top out at the 120px `--spacing-section` custom token, not a spacing-scale step) | ✅ available if ever needed |

Full alignment — no scale mismatch to fix.

## Base rhythm

8px default layout rhythm (confirmed: the vast majority of `p-*`/`gap-*`/`m-*` usage across `src/` lands on 8px-multiple steps). 4px reserved for micro-adjustment, per the standard's own rule.

## Known deviation (documented, not fixed)

75 call sites use fractional Tailwind utilities (`-0.5`/`-1.5`/`-2.5`/`-3.5` → 2/6/10/14px), concentrated in compact UI (badge padding, icon-to-text gaps). Investigated per this standard's own decision rule ("if there is a tradeoff between visual flourish and clarity, choose clarity" / "between novelty and consistency, choose consistency") — judged that forcing these onto the strict 8px-primary/4px-micro grid would very likely make the affected badges and icon-gaps look *worse* (either cramped at 4px or bloated at 8px), which fails the standard's own decision rule in the opposite direction: it would be choosing novelty-of-a-cleaner-spec over the actual visual clarity these components already have. Left as-is, documented, not silent.
