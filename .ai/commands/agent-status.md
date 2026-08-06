# Command: AGENT STATUS

**Aliases**: "Status", "What's the current state", "AGENT STATUS"

**Purpose**: report the repo's current state — active task, blockers, latest benchmark, known risks — without re-deriving it from scratch.

**Inputs required**: none.

**Context to load**: `.ai/status.md`, `.ai/tasks/active/` contents, `benchmarks/reports/PERF-POST-MIGRATION.okf.md` (or the latest report in `benchmarks/reports/`).

**Actions to perform**:
1. Read `.ai/status.md`.
2. List any files in `.ai/tasks/active/` (besides `README.md`).
3. Note the latest benchmark report's headline result.
4. If `node .ai/scripts/agent-status.mjs` exists and can run, prefer its live output over the static file (it's always current; the static file can go stale).

**Outputs produced**: a status summary — active task (or "none"), last known blockers, latest verified benchmark state, last-updated timestamp.

**Stop/ask conditions**: none.

**Example usage**: "Run AGENT STATUS before we start."
