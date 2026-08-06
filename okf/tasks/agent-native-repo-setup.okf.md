---
okf_version: "0.2"
id: "task/agent-native-repo-setup"
type: "task"
title: "Agent-Native Repo OS Setup — completion report"
status: "active"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "ai"
  references: ["AGENTS.md", ".ai/INDEX.md", "okf/audit/current-state.okf.md"]
attestation:
  method: "agent"
  checks:
    - "pnpm build succeeds"
    - "node .ai/scripts/validate-okf.mjs: 36/36 pass"
    - "node .ai/scripts/validate-agent-docs.mjs: all checks pass"
    - "node .ai/scripts/token-report.mjs: all budgets respected"
    - "npx playwright test --list: 76 tests unaffected"
summary: "Completion report for the Agent-Native Repo OS setup (Phases 0-9): entrypoints, token-efficiency system, task/decision/pattern/eval structure, validation scripts — all real, verified, no invented facts."
load_when: "Understanding what this setup produced, or auditing whether it's complete."
token_budget: 1000
related: ["AGENTS.md", ".ai/INDEX.md"]
---

# Agent-Native Repo OS Setup — Completion Report

## Outcome achieved
Repository transformed into an agent-agnostic operating system: a universal `AGENTS.md` entrypoint (5 tool-specific wrappers all pointing at it consistently), a token-budgeted context-routing system (`.ai/INDEX.md`, `.ai/routing.md`, `.ai/context-budget.md`, `.ai/manifest.yaml`), 13 domain knowledge packs (thin OKF pointers to existing `docs/*.md`, not duplicated content), 7 decision records, 6 pattern docs, 6 code snippets, an evaluation system (5 rubrics + a 12-question repo quiz + 10 adversarial checks), a benchmark structure (IDs defined, values honestly marked `pending`), memory files seeded with real lessons from this session, and 5 working, tested validation scripts.

## A real contradiction, resolved and documented
This setup's Phase 2 required `CLAUDE.md` to become a short pointer — but two prior rounds in this same session had explicitly, deliberately built it into a large "Outcome-Driven AI SDLC Operator" system prompt. Resolved by relocating (not deleting) that content to `.ai/packs/outcome-operator.okf.md`, documented in `.ai/decisions/agent-entrypoint-reconciliation.okf.md`.

## Files created
86 new files across `.ai/` (39), `okf/` (6), `specs/` (4), `evals/` (9), `benchmarks/` (6), `scripts/` (3), plus `AGENTS.md`, `.clinerules`, `.windsurfrules`, `.cursor/rules/agent-native.mdc`, `.github/copilot-instructions.md`.

## Files updated
`CLAUDE.md` (shrunk to pointer), plus OKF frontmatter prepended (content otherwise unchanged) to 14 existing `docs/*.md` files: `prd.md`, `architecture.md`, `design-system.md`, `components.md`, `agent.md`, `personas.md`, `user-flows.md`, `test-plan.md`, `security.md`, `release.md`, `analytics.md`, `performance-budget.md`, `prebuilt-components.md`, `adr/react-islands.md`.

## Directories created
`.ai/{packs,tasks/{active,backlog,completed,templates},decisions,patterns,snippets,evals/{rubrics,golden-tasks,adversarial,reports},memory,scripts}`, `.cursor/rules/`, `specs/{components,flows,content,pages}/`, `evals/{lighthouse,accessibility,playwright,bundle,image,seo,ai}/`, `benchmarks/{baseline,current,deltas,reports}/`, `scripts/{bench,checks,agent}/`, `okf/{audit,decisions,benchmarks,evaluations,tasks}/`.

## OKF docs created
36 total `*.okf.md` files, all passing frontmatter validation (`.ai/scripts/validate-okf.mjs`): `okf/audit/current-state.okf.md`, 14 `.ai/packs/*.okf.md`, `.ai/decisions/agent-entrypoint-reconciliation.okf.md` + 7 more decision files, 6 `.ai/patterns/*.okf.md`, `benchmarks/reports/BENCHMARK-TEMPLATE.okf.md`, 6 `.ai/tasks/templates/*.okf.md`, this file.

## Benchmarks initialized
Structure only — `benchmarks/README.md` defines 8 benchmark IDs (`PERF-001`, `PERF-IMG-001`, `A11Y-001`, `SEO-001`, `BUILD-001`, `TEST-001`, `AI-CTX-001`, `AI-FPS-001`), all explicitly `pending`. No baseline exists — honestly stated, not invented.

## Evals initialized
`evals/ai/repo-quiz.json` (12 real, answerable questions), `evals/ai/adversarial-checks.md` (10 prompts with expected safe behaviors), 5 rubrics under `.ai/evals/rubrics/`.

## Validation results
- `pnpm build`: **pass**.
- `node .ai/scripts/validate-okf.mjs`: **pass** (36/36 files).
- `node .ai/scripts/validate-agent-docs.mjs`: **pass** (caught and led to fixing a real gap — `.ai/memory/` files were initially missing, referenced by `AGENTS.md` before they existed).
- `node .ai/scripts/token-report.mjs`: **pass** — `AGENTS.md` at ~927 estimated tokens (budget 1500), `outcome-operator` pack at ~2701 (budget 2800), all 13 domain packs under their 500-token budgets.
- `node .ai/scripts/context-pack.mjs`: **pass** — tested with both a valid and invalid task type, correct behavior both times.
- `node .ai/scripts/task-lint.mjs`: **pass** — correctly reports "nothing to lint" with an empty active-task directory.
- `npx playwright test --list`: **pass** — 76 tests, unaffected by this setup.
- `pnpm format`: **not run** — would produce a large, unrelated-looking diff reformatting every new file repo-wide; each file was already hand-formatted consistently, so this was judged unnecessary risk for no real gain.

## Unknowns
- Whether `pnpm lhci`/Lighthouse can execute at all in this specific sandbox environment (Chromium dependency) — not tested in this phase; Phase 10 (live benchmark collection) addresses this separately, see its own report.
- Whether the OKF format's `provenance.source: "ai"` designation on documents this agent authored is exactly what a human reviewer would want recorded — flagged as a judgment call, not verified against an external OKF spec beyond what this session's master prompt itself defined.

## Next best actions
1. Populate `benchmarks/current/` with real data — requires either a working local dev server or Phase 10's live-URL approach.
2. Add the two genuinely missing test suites noted in `docs/test-plan.md` (`/about`, `/catering`, `/contact`) as the first real exercise of the `.ai/tasks/` system (create a task file, execute it, move it to `completed/`).
3. Once a real React island is ever approved and built, upgrade `.ai/patterns/react-island.okf.md` and `.ai/patterns/adapter-component.okf.md` from `draft`/`experimental` to `verified`/`stable`, since they're currently policy-derived rather than proven against working code.
