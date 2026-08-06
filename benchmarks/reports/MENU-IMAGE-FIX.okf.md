---
okf_version: "0.2"
id: "benchmark/menu-image-fix"
type: "benchmark"
title: "/menu Performance Regression — Image Optimization Fix + Root-Cause Finding"
status: "active"
created: "2026-08-06"
updated: "2026-08-06"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references:
    - "benchmarks/current/metrics.json"
    - "benchmarks/deltas/menu-image-optimization.json"
    - "benchmarks/reports/PERF-POST-MIGRATION.okf.md"
attestation:
  method: "agent"
  checks:
    - "pnpm build passes"
    - "6 real Lighthouse CLI runs (3 before, 3 after) against astro preview"
    - "sharp metadata re-read on all 32 resized files confirms valid, non-corrupt images at expected dimensions"
    - "npx playwright test --list still shows 76/76 tests collecting"
summary: "Fixed /menu's real, oversized image payload (4.18MB -> 828KB, -80%) by resizing 32 public/images/menu/ files in place to match their actual display sizes. This is a genuine, verified improvement, but it did not fully close the performance-budget gap: repeated measurement showed the original single 0.64/8960ms reading doesn't reliably reproduce (post-fix scores ranged 0.81-0.94 across 6 runs), and the dominant remaining factor was identified as DOM size (1526 elements on /menu vs ~127 on other routes), not images — logged as a new, separate backlog item rather than fixed in this pass."
load_when: "Checking what was actually done about the /menu performance regression, or investigating /menu's remaining DOM-size finding."
token_budget: 1200
related:
  - "docs/performance-budget.md"
  - "benchmarks/current/metrics.json"
  - ".ai/decisions/image-policy.okf.md"
  - ".ai/tasks/backlog/README.md"
---

# /menu Performance Regression — Image Optimization Fix + Root-Cause Finding

## Benchmark ID
`PERF-001`, `PERF-IMG-001`

## Date
2026-08-06

## Commit / source
Branch `claude/fix-menu-lcp-perf`, off `main` at `ea9cc13`.

## Pages tested
`/menu` (primary), plus `/`, `/about`, `/catering`, `/contact` (re-run to confirm no regression elsewhere).

## Commands used
```
pnpm preview   # astro preview, local Node server on :4321
CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  npx lighthouse http://localhost:4321/{route}/ \
  --output=json --output-path={file} \
  --chrome-flags="--headless --no-sandbox"
```
Image resizing used `sharp` (an existing transitive dependency of Astro's own image service — no new package added) run as a one-off Node script against `public/images/menu/*`, resizing to the images' real maximum CSS display size (700px for the 3-photo showcase grids, 500px for card thumbnails), preserving aspect ratio (`fit: 'inside'`, no cropping), keeping the original filename/format.

## What was found and fixed
1. **Real bug confirmed**: `total-byte-weight` audit scored 0.5 on `/menu`, with 4.18MB transferred — dominated by `ques3.webp` (1.26MB), `pao-de-queijo.png` (679KB), `quesdillas2.webp` (631KB), and others, all served unprocessed from `public/` at up to 2048×2048 native resolution while displayed at ≤340px CSS size. This is the known, documented `public/`-passthrough limitation (`.ai/decisions/image-policy.okf.md`) actually manifesting as a real, measurable cost, not just a theoretical one.
2. **Fix applied**: resized all 32 *referenced* files in `public/images/menu/` (15 from `menu-items` content JSON, 9 from `menu.astro`'s showcase grids, 9 shared with `index.astro`'s `PhotoGrid`; 11 further files in the same directory were confirmed unreferenced and left untouched) to their real display size, same format/filename. Total directory size: 19MB → 6.3MB (all files); the 32 referenced files' contribution to `/menu`'s network payload: 4.18MB → 828KB.
3. **Verification**: `pnpm build` passes; every resized file re-read with `sharp` to confirm valid image data at the expected dimensions; `npx playwright test --list` still shows 76/76 tests collecting (no markup changed, only binary image bytes).

## Image findings
Before: 27 `<img>`/`<Image>` tags on `/menu`, several at native 1024–2048px resolution despite ≤340px display size. After: same tag count and lazy-loading coverage (unchanged — only the underlying files were recompressed), total payload cut ~80%.

## Baseline comparison
`benchmarks/baseline/` holds the original (pre-fix) `PERF-POST-MIGRATION` run as the repo's only prior baseline. See `benchmarks/deltas/menu-image-optimization.json` for the full before/after comparison.

## Pass/fail against thresholds
`/menu` still does **not** reliably pass the `performance ≥0.90` / `LCP <2500ms` thresholds in `docs/performance-budget.md` in this sandboxed environment. Representative post-fix run: performance 0.81, LCP 4472ms. Across 6 total runs (3 pre-fix, 3 post-fix) scores ranged 0.81–0.94 with no clean pre/post separation — **this environment's Lighthouse measurements carry real run-to-run variance**, and the original single 0.64/8960ms reading could not be reliably reproduced even before this fix. Stated honestly rather than claimed as fully resolved.

## Regressions found
None in other routes — `/`, `/about`, `/catering`, `/contact` re-measured at comparable-or-better scores than the original baseline (see `benchmarks/current/metrics.json`).

## Root-cause finding for the remaining gap (new, not previously known)
Lighthouse's `dom-size-insight` audit shows `/menu` has **1526 DOM elements** vs. **~127 on `/about`** (a route that passes every budget comfortably) — a >10x difference. `mainthread-work-breakdown` correspondingly shows 640ms of main-thread work on `/menu` vs. 233ms on `/about`. The LCP element itself is a text `<p>` early in the page (not an image), and its own render-delay breakdown is small (~155ms) — meaning the bulk of `/menu`'s slower FCP/LCP is downstream of general page-parsing/layout cost from the large DOM, not from any single blocking resource. A secondary, page-independent finding: a 64KB `Footer.*.css` chunk is render-blocking on **every** route (440–750ms estimated FCP/LCP savings depending on page), not menu-specific.

## Recommendations (both logged to `.ai/tasks/backlog/README.md`, not fixed in this pass)
1. **DOM-size reduction on `/menu`**: each dish card (`MenuBistroCard.astro`) renders 2 full inline SVG flag icons (DE/UK) plus nested wrapper divs per item; across 40+ items this compounds fast. A shared, reusable flag-icon approach (e.g. a single `<use>`-referenced SVG sprite, or a small `FlagIcon.astro` component) would cut DOM nodes without changing visual output — worth a dedicated pass with before/after DOM-size measurement, not bundled into this fix to keep this change reviewable and low-risk.
2. **Render-blocking Footer CSS**: investigate why a chunk named `Footer.*.css` is large enough (64KB) to matter and is render-blocking on every route — likely a Vite/Tailwind chunking artifact, not menu-specific. Out of scope here since it's repo-wide, not a `/menu` regression.
3. Re-run this benchmark from an unrestricted environment (not this sandbox) to get a lower-variance baseline before deciding whether further `/menu`-specific work is still warranted.

## Evidence file paths
`benchmarks/current/metrics.json`, `benchmarks/deltas/menu-image-optimization.json`, `benchmarks/reports/PERF-POST-MIGRATION.okf.md` (original finding).
