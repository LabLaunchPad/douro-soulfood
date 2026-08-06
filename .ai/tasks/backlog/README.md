# Backlog

Not-yet-started tasks live here as OKF files, using the templates in `.ai/tasks/templates/`. Promote a task to `.ai/tasks/active/` when work begins on it.

## Known follow-ups (from prior sessions' audits, not yet task-ified)
- **`/menu` fails the Lighthouse performance budget** (0.64 vs required ≥0.90, LCP 8960ms vs required <2500ms) — real, measured finding from `benchmarks/reports/PERF-POST-MIGRATION.okf.md`. `/menu` serves 27 `<img>` tags, more than any other route, several at full original resolution (up to 2048×2048) due to the known `public/`-passthrough image limitation. Root cause not fully confirmed (Lighthouse's own opportunity audit only surfaced a modest redirect-related saving) — needs a network-waterfall investigation before attempting a fix.
- ~~Fix `Base.astro`'s inline JSON-LD/CSP gap~~ — **done, and turned out more severe than documented**: CSP's `script-src 'self'` was silently blocking ALL 5 inline scripts on the site (JSON-LD + 4 page-interactivity scripts), not just JSON-LD. **This meant the mobile hamburger menu and the Google Maps consent-gate button did not work in production** — confirmed via a real headless-Chrome click test before/after. Fixed by adding each script's exact SHA-256 hash to `public/_headers`' CSP. New verification script: `node scripts/checks/verify-csp-hashes.mjs` (run after any build-tooling update or edit to the affected components, since minified byte content — and therefore the hash — can shift on toolchain changes alone). See `.ai/packs/security.okf.md`.
- Add Playwright coverage for `/about`, `/catering`, `/contact` (per `.ai/packs/testing.okf.md`) — currently zero.
- Convert raw `public/images/` assets to `src/assets/` for real image compression gains (per `.ai/packs/performance.okf.md`) — currently only `width`/`height`/`decoding` correctness is achieved, not byte-size reduction.
- PR #20 (Impressum/Datenschutz legal pages) — blocked on business-owner-supplied legal facts, not actionable by an agent.
