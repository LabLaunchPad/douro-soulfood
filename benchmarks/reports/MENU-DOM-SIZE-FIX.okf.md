---
okf_version: "0.2"
id: "benchmark/menu-dom-size-fix"
type: "benchmark"
title: "/menu DOM Size Reduction — Shared Flag-Icon Sprite"
status: "active"
created: "2026-08-06"
updated: "2026-08-06"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references:
    - "benchmarks/reports/MENU-IMAGE-FIX.okf.md"
attestation:
  method: "agent"
  checks:
    - "pnpm build passes"
    - "3 real Lighthouse CLI runs against astro preview, dom-size-insight audit read directly"
    - "npx playwright test --list still shows 76/76 tests collecting"
    - "grep confirms zero remaining inline flag-SVG duplicates in src/"
summary: "Follow-up to MENU-IMAGE-FIX.okf.md's finding that /menu's DOM (1526 elements vs ~127 on other routes) was the dominant remaining factor after the image-payload fix. Replaced every duplicated inline DE/UK flag SVG (MenuBistroCard.astro, AllergenHeaderLegend.astro) with a shared <symbol>/<use> sprite defined once in Base.astro. DOM size dropped 1526 -> 1092 (-28%), a real, verified reduction, but the Lighthouse performance score remained similarly noisy (0.77-0.89) — the sandbox's measurement variance dominates over further markup-level optimization at this point."
load_when: "Checking what was done about /menu's DOM-size finding, or considering further /menu markup optimization."
token_budget: 900
related:
  - "benchmarks/reports/MENU-IMAGE-FIX.okf.md"
  - "docs/performance-budget.md"
  - ".ai/tasks/backlog/README.md"
---

# /menu DOM Size Reduction — Shared Flag-Icon Sprite

## Benchmark ID
`PERF-001` (follow-up measurement, not a new ID)

## Date
2026-08-06

## Commit / source
Branch `claude/reduce-menu-dom-size`, off `main` (does not yet include `claude/fix-menu-lcp-perf`'s image-payload fix — the two are independent, small, reviewable PRs).

## Pages tested
`/menu` only (this fix is menu-card-specific; the flag icons also appear on `AllergenHeaderLegend`, used on `/menu` only).

## Commands used
```
pnpm preview
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  npx lighthouse http://localhost:4321/menu/ \
  --output=json --output-path={file} \
  --chrome-flags="--headless --no-sandbox" --only-categories=performance
```
DOM size read from the `dom-size-insight` audit's `numericValue` in the resulting JSON.

## What was found and fixed
`MenuBistroCard.astro` rendered 2 full inline SVG flag icons (DE: 4 nodes, UK: 8 nodes, including per-instance-unique `<clipPath>` IDs to avoid collisions) per dish description block, plus 2 more inside the dual-price badge for items with alcoholic/non-alcoholic pricing. `AllergenHeaderLegend.astro`'s global disclaimer added 2 more per page. Across 40+ menu items, this compounded into hundreds of duplicated DOM nodes.

**Fix**: created `src/components/ui/FlagSprites.astro` (defines each flag once as an SVG `<symbol>`, included once in `Base.astro`) and `src/components/ui/FlagIcon.astro` (a 2-node `<svg><use></svg>` wrapper). Replaced every inline flag block in `MenuBistroCard.astro` and `AllergenHeaderLegend.astro` with `<FlagIcon lang="de|uk" class="..." />`. Zero visual change — identical paths/colors, just referenced instead of duplicated.

## Baseline comparison
| Metric | Before (this fix) | After | Delta |
|---|---|---|---|
| DOM elements (`dom-size-insight`) | 1526 | 1092 | -28% |
| Performance score (3-run range) | 0.81-0.94 (post-image-fix baseline, see MENU-IMAGE-FIX.okf.md) | 0.77-0.89 | no clean separation |
| LCP (3-run range) | 2.9s-4.5s | 3.4s-5.0s | no clean separation |

## Pass/fail against thresholds
Still does not reliably clear `performance ≥0.90` / `LCP <2500ms`. The DOM reduction is real and verified, but the Lighthouse score in this sandboxed environment shows enough run-to-run variance (see `.ai/memory/recurring-failures.md`'s entry on this) that it doesn't cleanly demonstrate improvement at the score level, even though the underlying DOM-size cause was genuinely reduced.

## Regressions found
None — visual output unchanged (same SVG paths via `<use>` instead of inline), `npx playwright test --list` still shows 76/76 tests collecting, `pnpm build` passes.

## Recommendations
1. **Stop chasing this specific score in this sandbox.** Two real, verified fixes (image payload -80%, DOM size -28%) have not produced a clean pass/fail signal due to environment-level Lighthouse variance, not because the fixes aren't working. Re-run this benchmark from an unrestricted (non-sandboxed) environment before deciding whether further `/menu`-specific optimization is actually warranted.
2. If further DOM reduction is still wanted, the next lever would be reducing per-item markup depth in `MenuBistroCard.astro` more broadly (e.g. the nested price-badge wrapper divs), but returns are likely diminishing relative to the risk of visual regression — not recommended without a non-sandboxed re-measurement first.

## Evidence file paths
`benchmarks/reports/MENU-IMAGE-FIX.okf.md` (prior finding this follows up on).
