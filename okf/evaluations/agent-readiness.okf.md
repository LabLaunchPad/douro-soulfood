---
okf_version: "0.2"
id: "evaluation/agent-readiness"
type: "audit"
title: "Agent Readiness Audit"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["AGENTS.md", ".ai/INDEX.md", "okf/audit/current-state.okf.md"]
attestation:
  method: "agent"
  checks: ["verified against actual directory contents before/after this session's own Agent-Native Repo OS setup"]
summary: "Audits this repo's readiness for AI agent work before the AI Agent Performance and Efficiency OS setup. Most core systems (entrypoint, context, tasks, memory, benchmarks, evals) already exist from the prior Agent-Native Repo OS setup this same session — this audit's job is identifying what THIS round's spec adds (agents/commands/hooks/status/metrics) that didn't exist yet."
load_when: "Before running or re-running the AI Agent Performance and Efficiency OS setup."
token_budget: 900
related: ["okf/audit/current-state.okf.md", ".ai/INDEX.md"]
---

# Agent Readiness Audit

## 1. Agent entrypoints — present
`AGENTS.md`, `CLAUDE.md` (pointer), `.cursor/rules/agent-native.mdc`, `.windsurfrules`, `.clinerules`, `.github/copilot-instructions.md` — all created in this session's prior Agent-Native Repo OS setup, all consistently pointing at `AGENTS.md`/`.ai/INDEX.md`, verified via `.ai/scripts/validate-agent-docs.mjs`.

## 2. Context system — present
`.ai/INDEX.md`, `.ai/routing.md`, `.ai/context-budget.md`, `.ai/truth-gates.md`, `.ai/manifest.yaml`, 14 `.ai/packs/*.okf.md`. This round extends (not replaces) these — e.g. `.ai/routing.md` needs new rows for agent/command/hook routing, `.ai/manifest.yaml` needs new entries.

## 3. Command system — absent
No `.ai/commands/` directory exists before this round. `CLAUDE.md`'s relocated `outcome-operator.okf.md` pack has a `<commands>` block (`RUN FULL OUTCOME LOOP`, `EXECUTE OUTCOME-XXX`, etc.) but these are informal, not a structured command registry with inputs/outputs/stop-conditions per command. This round creates that structure.

## 4. Task system — present, partial
`.ai/tasks/{active,backlog,completed}/` with 6 templates (`outcome-task.okf.md`, `fix-task.okf.md`, `feature-task.okf.md`, `doc-task.okf.md`, `benchmark-task.okf.md`, `component-task.okf.md`) already exist and are OKF-formatted with all required fields — this round's `.ai/tasks/templates/outcome-task.md` requirement is already satisfied by the existing `.okf.md` version (not duplicated). `.ai/tasks/active/` is currently empty (no task mid-flight) — this round's Phase 11 seeds the first one.

## 5. Memory system — present, partial
`.ai/memory/{learned-constraints,anti-patterns,recurring-failures,human-approvals}.md` exist, seeded with real lessons from this session. Absent before this round: `.ai/memory/README.md`, `experience-ledger.okf.md`, `approved-decisions.md`, `human-preferences.md`, `templates/learning-entry.md`. Note: `approved-decisions.md` (this round's spec) and `human-approvals.md` (existing) cover overlapping ground — reconciled by treating `human-approvals.md` as the canonical log and `approved-decisions.md` as a thin pointer, not a duplicate.

## 6. Benchmark system — present, with real data
`benchmarks/{baseline,current,deltas,reports}/`, 8 benchmark IDs, and — as of this session's own Phase 10 — real, measured Lighthouse data for all 5 routes (not just structure). `/menu` has a confirmed real performance regression logged in `.ai/tasks/backlog/README.md`.

## 7. Evaluation system — present, partial
`.ai/evals/rubrics/*.md` (5 files), `evals/ai/repo-quiz.json` (12 questions), `evals/ai/adversarial-checks.md` (10 prompts) exist. Absent before this round: `evals/ai/agent-commands.json`, `evals/ai/context-routing.json`, `evals/ai/golden-tasks/`.

## 8. Missing systems (what this round actually adds)
- `.ai/agents/` — no role-based agent matrix exists yet.
- `.ai/commands/` — no structured command registry.
- `.ai/hooks/` — no workflow hook specs.
- `.ai/status.md`, `.ai/next-action.md` — no always-ready status snapshot.
- `.ai/performance/agent-performance-model.md` — no explicit definition of "high-performance agent behavior" for this repo.
- `.ai/metrics/`, `.ai/dashboards/` — no efficiency metrics or scorecard.

## 9. Risks
- Scope overlap risk between this round's spec and the prior round's already-built systems (context budget, routing, manifest, memory, evals) — mitigated by extending existing files rather than creating parallel ones, documented per-file below.
- `.ai/status.md`/`.ai/next-action.md` are inherently point-in-time snapshots — they will go stale the moment this session ends unless a future agent updates them; flagged as an expected, accepted limitation, not a defect.

## 10. Recommendations
Extend `.ai/context-budget.md`, `.ai/routing.md`, `.ai/manifest.yaml` in place rather than creating v2 files. Create `.ai/agents/`, `.ai/commands/`, `.ai/hooks/` as genuinely new structure. Keep every role card and command/hook spec well under its stated token budget — this repo already has ~90 files from the prior round; padding would work against the token-efficiency goal both rounds share.
