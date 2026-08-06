# Hook: benchmark

**Trigger**: a change might affect performance — new JS, new images, a new route, a React island proposal.

**Condition**: the change touches anything `.ai/packs/performance.okf.md` or `docs/performance-budget.md` cares about.

**Action**: run BENCH RUN (or at minimum reason about the change against the known TBT/LCP budgets) before merging. Compare against `benchmarks/baseline/` via BENCH COMPARE if a real before/after matters.

**Output**: either a real Lighthouse run confirming no regression, or an explicit statement that benchmarking wasn't run and why (with a `.ai/tasks/backlog/README.md` follow-up if warranted).

**Failure behavior**: a real regression found (like the documented `/menu` LCP issue) gets logged as a backlog task, never silently ignored or force-fixed by lowering a threshold.
