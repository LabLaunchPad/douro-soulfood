# Token Efficiency

Target budgets, warning thresholds, and reduction rules — extends `.ai/context-budget.md`'s per-file budgets with session-level guidance.

## Target token budgets (per file type, from `.ai/context-budget.md`)
- `AGENTS.md`: 1,500 max.
- Domain pack: 300–500.
- Agent role card: 800 max.
- Command/hook spec: 300–400.
- Task packet: 600.
- Status/next-action snapshot: 400 each.

## Warning thresholds
- Any single file exceeding its stated budget by >20% — a signal to split content into a pack/pointer, not a hard failure (per `.ai/scripts/token-report.mjs`'s own framing).
- A single task loading more than ~6 files before implementation starts — likely over-loading; re-check `.ai/routing.md`.

## Hard stop thresholds
- `AGENTS.md` alone exceeding ~2,000 tokens — this is the one file every session pays for regardless of task; keep it disciplined. (`.ai/scripts/token-report.mjs` exits non-zero past its 1,500 budget as an earlier warning.)

## Context loading rules
See `.ai/context-budget.md`'s "File loading rules" — this file doesn't duplicate them, only adds the threshold framing above.

## How to reduce token usage
1. Load packs before full docs, always.
2. Don't re-read a file already read this session.
3. Route by task type (`.ai/routing.md`) instead of browsing.
4. Summarize instead of quoting large file contents back to the user.
5. When a pattern repeats (e.g. 9 similar image conversions), describe it once, don't re-explain per instance.
6. Prefer `node .ai/scripts/context-pack.mjs <type>`'s deterministic output over re-deriving what to load from scratch each time.
