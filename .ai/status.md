# Repo Status

> Point-in-time snapshot. Stale the moment this session ends unless a future agent updates it — treat as a starting point, verify anything load-bearing (per `.ai/truth-gates.md`).

## Current repo status
D'ouro Soulfood Bistro site — Astro 6 + Tailwind v4 + Keystatic, deployed to Cloudflare Pages. `main` branch is stable; `pnpm build` passes. The Agent-Native Repo OS + AI Agent Performance/Efficiency system (this file included) was just built on branch `claude/agent-native-repo-os`, not yet merged.

## Active task
None in `.ai/tasks/active/` besides the seeded starter (`TASK-001-agent-performance-bootstrap.okf.md`, see Phase 11).

## Next best action
See `.ai/next-action.md`.

## Current blockers
- PR #20 (Impressum/Datenschutz legal pages) blocked on business-owner-supplied legal facts — not agent-actionable.
- `wrangler pages dev`'s local runtime fails to start in at least one sandboxed agent environment (workerd module error) — use `pnpm dev:astro`/`pnpm preview` instead.
- Headless Chrome against a live Cloudflare Workers preview URL hits a proxy-TLS interstitial in that same environment — use `astro preview` (local, no proxy) + Lighthouse instead, per `benchmarks/reports/PERF-POST-MIGRATION.okf.md`.

## Latest verified benchmark state
First real Lighthouse data collected this session (`benchmarks/reports/PERF-POST-MIGRATION.okf.md`): 4/5 routes pass every budget. **`/menu` fails performance (0.64 vs required ≥0.90) and LCP (8960ms vs required <2500ms)** — real, measured, logged as a follow-up in `.ai/tasks/backlog/README.md`, not yet fixed.

## Latest known risks
- `/menu`'s performance regression (above) — root cause not fully confirmed, correlated with serving 27 images at full original resolution.
- `Base.astro`'s inline JSON-LD is likely dropped by CSP `script-src 'self'` without a nonce/hash — documented (`.ai/packs/security.okf.md`), unfixed.
- Zero test coverage for `/about`, `/catering`, `/contact`.

## Last updated
This entry: created alongside the AI Agent Performance and Efficiency OS setup. Update this file (or better, prefer `node .ai/scripts/agent-status.mjs`'s live output once real task/benchmark data accumulates) at the end of future sessions rather than letting it silently go stale.
