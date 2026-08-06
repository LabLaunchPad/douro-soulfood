# Agent Efficiency Metrics

Measurable proxies for `.ai/performance/agent-performance-model.md`'s six dimensions. No values are invented — see `.ai/dashboards/agent-scorecard.okf.md` for current (mostly `pending`) status.

| # | Metric | Definition | Dimension | How to measure |
|---|---|---|---|---|
| 1 | Context tokens per task | Approximate tokens loaded before implementation starts | Speed | `.ai/scripts/token-report.mjs` against the files actually read |
| 2 | Files read per task | Count of distinct files opened | Speed | Manual count or session log |
| 3 | % relevant context loaded | Of files read, how many were actually used in the change | Speed | Compare files read vs. files changed/cited |
| 4 | First-pass success rate | Did the change pass VERIFY TASK without a fix-up round | Efficiency | Task history — pass/fail on first VERIFY TASK run |
| 5 | Rework rate | % of tasks needing a second implementation pass | Efficiency | Task history |
| 6 | Human intervention rate | % of tasks needing human clarification beyond a stated stop condition | Efficiency | Task history |
| 7 | Hallucination/incident rate | Claims later found false, per `.ai/evals/rubrics/ai-hallucination.md` | Accuracy | Manual review against the rubric |
| 8 | Build pass rate | % of tasks where `pnpm build` passed on first run | Outcome quality | CI/session logs |
| 9 | Test pass rate | % of tasks where relevant tests passed | Outcome quality | CI/session logs |
| 10 | Benchmark regression rate | % of changes that regressed a tracked benchmark | Outcome quality | `benchmarks/deltas/` |
| 11 | Doc drift rate | % of changes that left a doc stale (caught by a later audit) | Outcome quality | `okf/audit/current-state.okf.md`-style audits over time |
| 12 | Command success rate | % of `.ai/commands/*.md` invocations that completed without hitting an unhandled stop condition | Efficiency | Task/session history |

## Collecting this data
None of this is collected automatically yet — no script instruments a live agent session. `.ai/scripts/agent-scorecard.mjs` prints the current (mostly `pending`) status from `.ai/dashboards/agent-scorecard.okf.md`; populating real values requires either manual tracking across sessions or a future instrumentation effort (out of scope for this setup — flagged in `okf/evaluations/agent-performance-system.okf.md`'s next actions).
