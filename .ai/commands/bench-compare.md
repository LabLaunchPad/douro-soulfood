# Command: BENCH COMPARE

**Aliases**: "Bench compare", "Did this regress performance"

**Purpose**: diff `benchmarks/current/` against `benchmarks/baseline/` to detect regressions.

**Inputs required**: an existing `benchmarks/current/metrics.json` (run BENCH RUN first if missing).

**Context to load**: `benchmarks/current/metrics.json`, `benchmarks/baseline/metrics.json`, `docs/performance-budget.md`'s thresholds.

**Actions to perform**:
1. If `benchmarks/baseline/` is empty, state clearly that no comparison is possible — the current run becomes the baseline candidate instead.
2. Otherwise, diff each metric per route.
3. Flag any metric that crossed an error-level threshold in `docs/performance-budget.md` (regardless of whether it improved or worsened relative to baseline — a threshold breach matters even if it's "better than last time").

**Outputs produced**: `benchmarks/deltas/latest-delta.json`/`.md` with per-route, per-metric deltas and pass/fail against thresholds.

**Stop/ask conditions**: none — this is read-only analysis; a real regression found should be logged to `.ai/tasks/backlog/README.md`, not silently noted and dropped.

**Example usage**: "Bench compare after this change."
