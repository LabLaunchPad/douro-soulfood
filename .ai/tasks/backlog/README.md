# Backlog

Not-yet-started tasks live here as OKF files, using the templates in `.ai/tasks/templates/`. Promote a task to `.ai/tasks/active/` when work begins on it.

## Known follow-ups (from prior sessions' audits, not yet task-ified)
- ~~`/menu` fails the Lighthouse performance budget due to oversized images~~ — **partially resolved**: `/menu`'s image payload was cut 80% (4.18MB → 828KB) by resizing 32 `public/images/menu/` files to their real display size. See `benchmarks/reports/MENU-IMAGE-FIX.okf.md`. This surfaced two new, more specific follow-ups below — the performance budget still isn't reliably met.
- **NEW: `/menu`'s DOM is 12x larger than other routes** (1526 elements vs ~127 on `/about`) — per Lighthouse's `dom-size-insight` audit, this (not images) is now the dominant factor behind `/menu`'s slower FCP/LCP under simulated CPU throttling. Likely lever: `MenuBistroCard.astro` renders 2 full inline SVG flag icons per dish card across 40+ items — a shared flag-icon component/sprite could cut DOM nodes substantially without a visual change. Needs its own before/after DOM-size measurement pass. See `benchmarks/reports/MENU-IMAGE-FIX.okf.md`.
- **NEW: a 64KB `Footer.*.css` chunk is render-blocking on every route** (440–750ms estimated FCP/LCP savings depending on page) — not menu-specific, likely a Vite/Tailwind chunking artifact worth investigating separately.
- Fix `Base.astro`'s inline JSON-LD/CSP gap (per `.ai/packs/security.okf.md` and `.ai/packs/seo.okf.md`) — needs per-route build-time hash injection, real infrastructure work.
- Add Playwright coverage for `/about`, `/catering`, `/contact` (per `.ai/packs/testing.okf.md`) — currently zero.
- Convert raw `public/images/` assets to `src/assets/` for real Astro-pipeline compression gains (per `.ai/packs/performance.okf.md`) — the `/menu` fix above shrank files directly via a one-off script rather than migrating architecture; a full `src/assets/` migration would let Astro's `<Image>` handle this automatically going forward, still not done.
- PR #20 (Impressum/Datenschutz legal pages) — blocked on business-owner-supplied legal facts, not actionable by an agent.
