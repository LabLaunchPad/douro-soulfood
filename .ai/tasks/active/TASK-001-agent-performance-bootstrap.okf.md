---
okf_version: "0.2"
id: "task/agent-performance-bootstrap"
type: "task"
title: "Agent Performance Bootstrap"
status: "active"
created: "2026-08-06"
updated: "2026-08-06"
freshness: "current"
lifecycle: "active"
trust: "draft"
provenance:
  source: "ai"
  references: [".ai/performance/agent-performance-model.md", ".ai/dashboards/agent-scorecard.okf.md"]
attestation:
  method: "agent"
  checks: ["node .ai/scripts/command-lint.mjs", "node .ai/scripts/hook-lint.mjs", "node .ai/scripts/validate-agent-docs.mjs", "node .ai/scripts/validate-okf.mjs"]
summary: "Seed task: establish the agent performance system end-to-end (role matrix, command registry, hooks, status system, memory/metrics scaffolding, eval harness), validate it with real tooling, and produce a scorecard — the first entry in .ai/tasks/active/, closing the loop the AI Agent Performance and Efficiency OS master prompt asked for."
load_when: "Checking what the first seeded task in the new task system was, or picking up follow-on agent-performance work."
token_budget: 700
related: [".ai/agents/README.md", ".ai/commands/README.md", ".ai/hooks/README.md", ".ai/dashboards/agent-scorecard.okf.md"]
---

# Agent Performance Bootstrap

## Task ID
`agent-performance-bootstrap`

## Outcome
The agent performance and efficiency system (14-role matrix, 15-command registry, 13-hook spec set, live status system, memory/metrics/eval scaffolding) exists, is internally consistent, validates cleanly with the lint/validation scripts, and has a real (not fabricated) scorecard reflecting what has and hasn't actually been measured yet.

## Type
docs-only

## Priority
P1

## Required context
`.ai/INDEX.md`, `.ai/agents/README.md`, `.ai/commands/README.md`, `.ai/hooks/README.md`, `.ai/performance/agent-performance-model.md`, `.ai/dashboards/agent-scorecard.okf.md`.

## Constraints
- No invented metrics — every scorecard value is either real (from this session's own work) or explicitly `pending`.
- No new heavy dependencies for the validation scripts (Node built-ins only).
- Don't duplicate the existing task-template/decision-record systems from prior phases — extend, don't fork.

## Acceptance criteria
- Given `.ai/commands/README.md`'s registry of 15 commands, when `node .ai/scripts/command-lint.mjs` runs, then all 15 pass (all 8 required fields present).
- Given `.ai/hooks/README.md`'s registry of 13 hooks, when `node .ai/scripts/hook-lint.mjs` runs, then all 13 pass.
- Given the full `.ai` tree, when `node .ai/scripts/validate-agent-docs.mjs` and `node .ai/scripts/validate-okf.mjs` run, then both pass with no errors.
- Given the scorecard, when read, then every non-`pending` value traces to real evidence from this session (build runs, benchmark reports, etc.), not a guess.

## Evidence required
- `node .ai/scripts/command-lint.mjs` → 15/15 pass (real output captured during Phase 9/12).
- `node .ai/scripts/hook-lint.mjs` → 13/13 pass.
- `node .ai/scripts/validate-agent-docs.mjs` and `node .ai/scripts/validate-okf.mjs` → both exit 0.
- `pnpm build` → exits 0 (confirms nothing in this round broke the actual site).

## Benchmark impact
None directly — this is documentation/tooling scaffolding, not application code. `benchmarks/` metrics are unaffected.

## Stop/ask conditions
- If any lint/validation script fails and the fix isn't a small, obvious correction (e.g. a missing field), stop and report rather than mass-editing files to force a pass.
- If a future agent is tempted to fill in `pending` scorecard values with plausible-looking numbers instead of real measurements, that's a hard stop — leave them `pending`.
