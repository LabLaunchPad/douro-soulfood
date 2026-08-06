# Recurring Failures

Environment/tooling failures seen more than once in this repo's session history — expected, not surprising, when they recur.

- **`Deploy Preview` GitHub Actions job fails on every PR**, due to a missing `CLOUDFLARE_API_TOKEN` repository secret. Confirmed across dozens of PRs in this repo's history. `Build` job status is the reliable per-PR signal instead. This is a repo-configuration gap (needs a repo-admin to add the secret), not something any single code change can fix.
- **`wrangler pages dev` fails to start locally** in at least one sandboxed agent environment (`workerd` module resolution error). Recurs identically every time it's attempted in that environment — not worth re-attempting without first checking whether the environment has changed.
- **Playwright's browser binary is missing** in that same environment, so `npx playwright test` (full run) fails, while `npx playwright test --list` (no browser needed) succeeds. Use the `--list` fallback for static verification when a full run isn't possible.

## If a "recurring failure" stops recurring
If any of the above suddenly works (e.g. a future environment has a working Chromium binary), update this file to say so — don't keep treating a fixed limitation as still-broken.

- **Date**: 2026-08-06
- **Source**: manual entry via memory-append.mjs
- **Type**: recurring-failure
- **Insight**: Reducing /menu's DOM size by a real, verified 28% (1526 -> 1092 elements, via a shared SVG symbol/use sprite for repeated flag icons) did not produce a cleanly separated Lighthouse performance score in this sandbox (0.77-0.89 after vs 0.81-0.94 before) -- confirming the earlier finding that this environment's Lighthouse measurement noise can swamp real, targeted optimizations.
- **Evidence**: 3 Lighthouse runs post-DOM-fix vs 3 runs post-image-fix, both recorded in benchmarks/reports/MENU-DOM-SIZE-FIX.okf.md
- **Recommended behavior**: Do not keep chasing a specific Lighthouse score number in this sandbox once a real, verified structural improvement has been made and the score still doesn't clearly move -- re-measure from an unrestricted environment before concluding further work is or isn't warranted
- **Status**: active
