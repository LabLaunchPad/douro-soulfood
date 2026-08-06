# Next Best Action

## The action
Investigate `/menu`'s DOM-size finding: 1526 elements vs ~127 on other routes, now confirmed as the dominant remaining factor behind its Lighthouse performance score (the image-payload cause was fixed — see `benchmarks/reports/MENU-IMAGE-FIX.okf.md`).

## Why it matters
It's the next real, currently-known lever on the only route that still doesn't reliably meet the performance budget. Likely cause: `MenuBistroCard.astro` renders 2 full inline SVG flag icons per dish card, repeated across 40+ items.

## Exact command to run
1. Reproduce: `pnpm build && pnpm preview` (background), then Lighthouse against `/menu/` with `--only-categories=performance`, check the `dom-size-insight` audit's `numericValue`.
2. Consider extracting the repeated DE/UK flag SVGs into a single shared component or sprite (`<use href="#flag-de">`) to cut duplicate DOM nodes without a visual change.
3. Re-measure DOM size and Lighthouse score before/after; commit only if genuinely improved and `pnpm build` + `npx playwright test --list` still pass.
4. Start via: "Fix issue: /menu's DOM has 1526 elements, ~12x other routes" (see `.ai/commands/fix-issue.md`).

## Files likely needed
`src/components/sections/MenuBistroCard.astro`, `.ai/packs/performance.okf.md`, `benchmarks/reports/MENU-IMAGE-FIX.okf.md` (this session's finding), `.ai/tasks/backlog/README.md`.

## Lower-priority, also open
A 64KB `Footer.*.css` render-blocking chunk affects every route (440–750ms estimated savings) — repo-wide, not menu-specific, worth a separate look.
