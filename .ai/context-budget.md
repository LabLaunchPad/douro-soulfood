# Context Budget Rules

## Budgets
- `AGENTS.md`: ~1,500 tokens max. If it grows past this, move detail into a `.ai/packs/*.okf.md` and leave a pointer.
- Task packet (one `.ai/tasks/active/*.okf.md` file): ~600 tokens. A task that needs more context than that should link to a pack, not inline everything.
- Domain pack (`.ai/packs/*.okf.md`, except the outcome-operator pack): ~300–500 tokens each. They are pointers with a short summary, not duplicated copies of the full `docs/*.md` file.
- `docs/*.md` files: no hard cap (they're the detailed, human-maintained source of truth), but an agent should only open one after its corresponding pack's summary proves insufficient for the task at hand.
- Agent role card (`.ai/agents/*.md`): ~800 tokens max, per the AI Agent Performance and Efficiency OS setup's own spec.
- Command/hook spec (`.ai/commands/*.md`, `.ai/hooks/*.hook.md`): ~300–400 tokens each — short enough that AGENT BOOTSTRAP could load several without threatening the global budget.
- `.ai/status.md`/`.ai/next-action.md`: ~400 tokens each — a snapshot, not a running log; if either grows past this, it's accumulating history that belongs in `.ai/memory/` or `benchmarks/` instead.

## File loading rules
1. Read `AGENTS.md` in full, always, first.
2. Read `.ai/INDEX.md` in full, always, second.
3. Read `.ai/status.md` third, for current-state awareness (per the `session-start` hook) — it's short and answers "what's already known/blocked" before any file-hunting starts.
4. Use `.ai/routing.md` to pick which pack(s) the current task type needs — don't load packs unrelated to the task.
5. Open a full `docs/*.md` file only if its pack's summary doesn't resolve the question.
6. Do not open `keystatic.config.ts` and `src/content.config.ts` unless the task actually touches content schema — most tasks don't need either.
7. Do not re-read `package.json`, `astro.config.mjs`, or design tokens speculatively — they rarely change and their relevant facts are already captured in `okf/audit/current-state.okf.md`.
8. Load `.ai/agents/*.md` role cards only for the specific role(s) a task needs (per `.ai/agents/README.md`'s typical-sequence guidance) — not all 14.
9. Load a `.ai/commands/*.md`/`.ai/hooks/*.hook.md` spec only when actually executing that command/hook, not speculatively.

## Output brevity rules
1. Don't restate the full contents of a file back to the user unless asked — reference it by path and line range instead.
2. A task report states what changed, what was verified, and what wasn't — not a narrated replay of every intermediate step.
3. When multiple similar changes are made (e.g. converting 9 images), describe the pattern once and list the instances, don't repeat the full reasoning per instance.

## Rules to avoid reading unrelated files
- A CMS/content task never needs to open `src/styles/tokens.css`.
- A pure design-token task never needs to open `keystatic.config.ts`.
- A test-writing task needs the page/component under test and `docs/test-plan.md`'s pack — not the full architecture doc.
- A docs-only task doesn't need to run `pnpm build` unless the doc references specific file paths/line numbers that could have drifted — verify those, not the whole build.
