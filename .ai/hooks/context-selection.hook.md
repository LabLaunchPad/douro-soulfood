# Hook: context-selection

**Trigger**: before loading any file beyond `AGENTS.md`/`.ai/INDEX.md`/`.ai/status.md`.

**Condition**: a task's type is known (or knowable via `.ai/routing.md`).

**Action**: route via `.ai/routing.md` (or `node .ai/scripts/context-pack.mjs <type>`) to the specific packs needed. Don't load `.ai/packs/outcome-operator.okf.md` for routine work. Don't open a full `docs/*.md` before checking its pack summary first.

**Output**: a short, justified list of files loaded, matching what `.ai/context-budget.md` allows for the task's scope.

**Failure behavior**: if a task genuinely doesn't map to any `.ai/routing.md` row, that's worth flagging (possible new task-type gap) rather than silently loading everything.
