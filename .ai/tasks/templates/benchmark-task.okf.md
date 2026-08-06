---
okf_version: "0.2"
id: "task/{stable-id}"
type: "task"
title: "Benchmark: {short description}"
status: "draft"
created: "{ISO date or unknown}"
updated: "{ISO date or unknown}"
freshness: "current"
lifecycle: "experimental"
trust: "draft"
provenance: { source: "{repo|human|ai|mixed}", references: [] }
attestation: { method: "{manual|script|ci|agent}", checks: [] }
summary: "{1-3 sentence summary of what's being measured and why}"
load_when: "{when an agent should read this}"
token_budget: 500
related: ["benchmarks/README.md"]
---

# Benchmark: {short description}

## Task ID
`{stable-id}`

## Outcome
{A real, collected metric — never an estimate presented as measured. State the benchmark ID(s) from `benchmarks/README.md` this task produces/updates.}

## Type
benchmark

## Priority
{P0|P1|P2}

## Required context
`.ai/packs/performance.okf.md`, `benchmarks/README.md`, `docs/performance-budget.md`.

## Constraints
Do not invent metric values. Do not modify application code to make a benchmark pass unless the fix is obvious, non-visual, non-functional, and directly addresses the blocker — otherwise report as a follow-up instead.

## Acceptance criteria
- Given {the target page/route}, when {the benchmark tool runs against it}, then {a real metric is recorded, or the run is honestly marked not_run with the exact blocking reason}.

## Evidence required
{The exact command run, its raw output or output file path, and where the extracted metric was saved (`benchmarks/current/metrics.json` or equivalent).}

## Benchmark impact
{Which benchmark ID(s): PERF-001, PERF-IMG-001, A11Y-001, SEO-001, BUILD-001, TEST-001, AI-CTX-001, AI-FPS-001.}

## Stop/ask conditions
Dependencies can't install; build fails; local/live server unreachable; the benchmark tool's runtime dependency (e.g. Chromium) isn't available in the current environment — report `not_run` with the exact command a human could run manually, never fake a result.
