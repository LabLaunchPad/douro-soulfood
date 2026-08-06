# Next Best Action

## The action
Investigate and fix `/menu`'s real, measured Lighthouse performance regression (0.64 vs required ≥0.90; LCP 8960ms vs required <2500ms).

## Why it matters
It's the only real, currently-known budget-breaking issue in the repo — everything else (docs, task system, memory, benchmarks structure) is now in place, but this is a genuine product-affecting problem an actual visitor would experience as slow menu loading. It's also the first real exercise of the just-built benchmark/task system on a genuine finding rather than a demonstration.

## Exact command to run
1. Reproduce: `pnpm build && pnpm preview` (background), then `CHROME_PATH=/opt/pw-browsers/chromium-*/chrome-linux/chrome npx lighthouse http://localhost:4321/menu --view --chrome-flags="--headless --no-sandbox"` — use `--view` (not `--output=json`) this time to get the interactive report and see the actual network waterfall/LCP element, which the JSON-only run this session didn't surface clearly.
2. Once the LCP-blocking resource is identified, decide the fix: likely candidate is moving the largest, non-lazy-loaded menu images into `src/assets/` so Astro's image service can actually recompress them (see `.ai/decisions/image-policy.okf.md`'s documented `public/`-passthrough limitation).
3. Start via: "Fix issue: /menu's Lighthouse performance score is 0.64 with an 8960ms LCP" (see `.ai/commands/fix-issue.md`).

## Files likely needed
`src/pages/menu.astro`, `.ai/packs/performance.okf.md`, `.ai/decisions/image-policy.okf.md`, `benchmarks/reports/PERF-POST-MIGRATION.okf.md` (the existing finding), `.ai/tasks/backlog/README.md` (where it's currently logged).
