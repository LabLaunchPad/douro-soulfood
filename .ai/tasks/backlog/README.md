# Backlog

Not-yet-started tasks live here as OKF files, using the templates in `.ai/tasks/templates/`. Promote a task to `.ai/tasks/active/` when work begins on it.

## Known follow-ups (from prior sessions' audits, not yet task-ified)
- Fix `Base.astro`'s inline JSON-LD/CSP gap (per `.ai/packs/security.okf.md` and `.ai/packs/seo.okf.md`) — needs per-route build-time hash injection, real infrastructure work.
- Add Playwright coverage for `/about`, `/catering`, `/contact` (per `.ai/packs/testing.okf.md`) — currently zero.
- Convert raw `public/images/` assets to `src/assets/` for real image compression gains (per `.ai/packs/performance.okf.md`) — currently only `width`/`height`/`decoding` correctness is achieved, not byte-size reduction.
- PR #20 (Impressum/Datenschutz legal pages) — blocked on business-owner-supplied legal facts, not actionable by an agent.
