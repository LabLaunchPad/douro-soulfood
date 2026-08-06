# Repo Status

> Point-in-time snapshot. Stale the moment this session ends unless a future agent updates it — treat as a starting point, verify anything load-bearing (per `.ai/truth-gates.md`).

## Current repo status
D'ouro Soulfood Bistro site — Astro 6 + Tailwind v4 + Keystatic, deployed to Cloudflare Pages. `main` branch is stable; `pnpm build` passes. The Agent-Native Repo OS + AI Agent Performance/Efficiency system is merged. A follow-up session fixed the `/menu` performance regression, a real CSP bug that silently broke the mobile menu and Maps consent-gate in production, and added missing E2E coverage — see "Recently resolved" below.

## Active task
None in `.ai/tasks/active/` — `TASK-001-agent-performance-bootstrap.okf.md` is complete (all its acceptance criteria verified: `command-lint.mjs`, `hook-lint.mjs`, `validate-okf.mjs`, `validate-agent-docs.mjs` all pass) and should be moved to `.ai/tasks/completed/` next time an agent is in this area.

## Next best action
No urgent, currently-known repo issue remains open. See `.ai/next-action.md`.

## Current blockers
- PR #20 (Impressum/Datenschutz legal pages) blocked on business-owner-supplied legal facts — not agent-actionable. Confirmed zero merge conflicts against current `main` as of this update; ready to merge once the owner supplies the missing legal-form/UID/Firmenbuchnummer facts.
- `wrangler pages dev`'s local runtime fails to start in at least one sandboxed agent environment (workerd module error) — use `pnpm dev:astro`/`pnpm preview` instead.
- Headless Chrome against a live Cloudflare Workers preview URL hits a proxy-TLS interstitial in that same environment — use `astro preview` (local, no proxy) + Lighthouse instead.
- `npx playwright test` (full execution, not `--list`) doesn't run in this sandbox — a browser-binary version mismatch (installed `chromium-1194` vs. the pinned `@playwright/test`'s expected `chromium_headless_shell-1223`). `--list` works and GitHub Actions' own `Playwright E2E Tests` job installs a matching browser, so this is a sandbox-only gap, not a CI gap.

## Recently resolved (this session)
- **`/menu` performance regression**: image payload cut 80% (4.18MB → 828KB) and DOM size cut 28% (1526 → 1092 elements). See `benchmarks/reports/MENU-IMAGE-FIX.okf.md` and `benchmarks/reports/MENU-DOM-SIZE-FIX.okf.md`.
- **CSP was silently blocking the mobile menu and Maps consent-gate in production** — not just a JSON-LD/SEO issue as originally documented. Fixed via SHA-256 hash allowlisting; verify with `node scripts/checks/verify-csp-hashes.mjs` after any edit to `Base.astro`/`NavBar.astro`/`MobileNavDrawer.astro`/`MapEmbed.astro` or any build-tooling dependency bump. See `.ai/packs/security.okf.md`.
- **Missing E2E coverage** for `/about`, `/catering`, `/contact` — added, 76 → 134 total tests.
- **`public/images/` → `src/assets/` full pipeline migration**: explicitly deferred, not done. Requires a Keystatic CMS schema change the user chose to skip — see `.ai/memory/human-approvals.md`. Do not attempt without a fresh, explicit ask.

## Latest verified benchmark state
See `benchmarks/reports/MENU-IMAGE-FIX.okf.md` and `benchmarks/reports/MENU-DOM-SIZE-FIX.okf.md` for the full picture. Honest caveat carried through both: Lighthouse score readings in this sandbox showed real run-to-run variance even after verified structural fixes — treat any single score as noisy, not ground truth, without a re-measurement from an unrestricted environment.

## Latest known risks
- A 64KB `Footer.*.css` chunk is render-blocking on every route — investigated and found to be legitimate, fully-used Tailwind output (zero wasted bytes per Lighthouse's `unused-css-rules` audit), not a bug. No fix attempted; would need new critical-CSS tooling for a modest, likely noise-swamped gain.
- CSP hashes (`public/_headers`) are pinned to exact minified byte output and can go stale on any Astro/Vite/esbuild version bump, not just a source edit — run `node scripts/checks/verify-csp-hashes.mjs` after dependency updates.

## Last updated
This entry refreshed after the `/menu` perf, CSP, and E2E-coverage fixes merged (5 PRs: #34–#38). Prefer `node .ai/scripts/agent-status.mjs`'s live output over this static file when possible — update this file (or the live script's data sources) at the end of future sessions rather than letting it silently go stale again.
