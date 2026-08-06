---
okf_version: "0.2"
id: "dashboard/agent-scorecard"
type: "evaluation"
title: "Agent Scorecard"
status: "active"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "draft"
provenance:
  source: "ai"
  references: [".ai/metrics/agent-efficiency.md"]
attestation:
  method: "agent"
  checks: ["no values invented — every entry is 'pending' unless a real number exists from this session's own work"]
summary: "Tracks the 12 agent-efficiency metrics' current status. Almost entirely 'pending' — no automated instrumentation exists yet to collect these across sessions; the two entries with real data are the only ones actually measured this session."
load_when: "Assessing whether the agent-performance system has real data yet, or checking a specific metric's current value."
token_budget: 600
related: [".ai/metrics/agent-efficiency.md", ".ai/performance/agent-performance-model.md"]
---

# Agent Scorecard

| Metric | Target | Current value | Evidence | Status |
|---|---|---|---|---|
| Context tokens per task | Per `.ai/context-budget.md` budgets | pending | — | not yet instrumented |
| Files read per task | ≤6 before implementation | pending | — | not yet instrumented |
| % relevant context loaded | High | pending | — | not yet instrumented |
| First-pass success rate | High | pending | — | not yet instrumented |
| Rework rate | Low | pending | — | not yet instrumented |
| Human intervention rate | Low (only for real stop conditions) | pending | — | not yet instrumented |
| Hallucination/incident rate | Zero | **0 known incidents this session** | This session's own work — every claim traced to a real check; one prior overly-broad assumption (Playwright/Chromium "unavailable") was caught and corrected before being acted on further | measured, this session only |
| Build pass rate | High | **100% this session** (every `pnpm build` run this session succeeded, ~15+ runs across all phases) | Direct session history | measured, this session only |
| Test pass rate | High | pending (full Playwright execution not run — `--list` only, 76/76 collecting correctly) | `npx playwright test --list` output | partial |
| Benchmark regression rate | Low | **1 real regression found this session** (`/menu` performance) | `benchmarks/reports/PERF-POST-MIGRATION.okf.md` | measured, this session only |
| Doc drift rate | Low | pending — no repeat audit has run yet to check whether this session's own docs stayed accurate over time | — | not yet instrumented |
| Command success rate | High | pending — the command registry itself was just created this session, unused in practice yet | — | not yet instrumented |

## Honest summary
This scorecard is **mostly structure, not data** — consistent with `benchmarks/README.md`'s same honest framing for performance benchmarks. The 4 entries with real values reflect this single session's own work, not a track record across many sessions. Re-run this assessment after future sessions accumulate real task history via `.ai/tasks/completed/`.
