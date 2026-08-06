---
okf_version: "0.2"
id: "benchmark/{stable-id}"
type: "benchmark"
title: "{Benchmark title}"
status: "draft"
created: "{ISO date or unknown}"
updated: "{ISO date or unknown}"
freshness: "current"
lifecycle: "active"
trust: "{draft|reviewed|verified}"
provenance:
  source: "repo"
  references:
    - "benchmarks/current/metrics.json"
attestation:
  method: "{manual|script|ci|agent}"
  checks: []
summary: "{1-3 sentence summary of what was measured and the headline result}"
load_when: "{when an agent needs this performance evidence}"
token_budget: 1000
related:
  - "docs/performance-budget.md"
  - "benchmarks/current/metrics.json"
---

# {Benchmark Title}

## Benchmark ID
`{ID from benchmarks/README.md's table}`

## Date
{ISO date, or "unknown" if not tracked}

## Commit / source
{git commit hash this benchmark was run against}

## Pages tested
{List of routes, or "skipped: {route}" for any that don't exist}

## Commands used
```
{exact commands run, verbatim}
```

## Metrics table
| Page | Metric | Value | Threshold | Pass/Fail |
|---|---|---|---|---|
| | | | | |

## Image findings
{Raw <img> count, Astro <Image> usage, lazy-loading coverage, largest image byte size — only if actually measured.}

## Baseline comparison
{"No baseline exists" if `benchmarks/baseline/` is empty — do not claim improvement without one. Otherwise, deltas per metric.}

## Pass/fail against thresholds
{Per `docs/performance-budget.md`'s error-level assertions.}

## Regressions found
{List, or "none found".}

## Recommendations
{Concrete next steps, only if grounded in what was actually measured.}

## Evidence file paths
{Where the raw output lives — e.g. `benchmarks/current/metrics.json`, `evals/lighthouse/{page}.json`.}
