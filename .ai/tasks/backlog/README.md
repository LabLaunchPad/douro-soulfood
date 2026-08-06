# Backlog

Not-yet-started tasks live here as OKF files, using the templates in `.ai/tasks/templates/`. Promote a task to `.ai/tasks/active/` when work begins on it.

## Known follow-ups (from prior sessions' audits, not yet task-ified)
- **`/menu` fails the Lighthouse performance budget** (0.64 vs required ≥0.90, LCP 8960ms vs required <2500ms) — real, measured finding from `benchmarks/reports/PERF-POST-MIGRATION.okf.md`. `/menu` serves 27 `<img>` tags, more than any other route, several at full original resolution (up to 2048×2048) due to the known `public/`-passthrough image limitation. Root cause not fully confirmed (Lighthouse's own opportunity audit only surfaced a modest redirect-related saving) — needs a network-waterfall investigation before attempting a fix.
- Fix `Base.astro`'s inline JSON-LD/CSP gap (per `.ai/packs/security.okf.md` and `.ai/packs/seo.okf.md`) — needs per-route build-time hash injection, real infrastructure work.
- ~~Add Playwright coverage for `/about`, `/catering`, `/contact`~~ — **done**: `tests/{about,catering,contact}.spec.ts` added (28 tests × 2 viewport projects = 56 new test cases; `npx playwright test --list` now shows 134 total, up from 76). Content/structure verified against the real page source and built HTML output before each assertion was written. Full execution (not just `--list`) still not run in this sandbox — see `.ai/memory/learned-constraints.md`'s note on the Playwright browser-binary version mismatch (installed `chromium-1194` vs. the pinned `@playwright/test`'s expected `chromium_headless_shell-1223`).
- Convert raw `public/images/` assets to `src/assets/` for real image compression gains (per `.ai/packs/performance.okf.md`) — currently only `width`/`height`/`decoding` correctness is achieved, not byte-size reduction.
- PR #20 (Impressum/Datenschutz legal pages) — blocked on business-owner-supplied legal facts, not actionable by an agent.
