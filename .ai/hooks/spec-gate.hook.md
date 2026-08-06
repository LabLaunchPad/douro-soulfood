# Hook: spec-gate

**Trigger**: before implementation starts on a non-trivial task.

**Condition**: the task's governing doc is missing, stale, or acceptance criteria aren't concrete yet.

**Action**: run the Spec Writer role / PLAN TASK command first — create/update the doc, state acceptance criteria as testable Given/when/then statements.

**Output**: a spec that implementation can be checked against afterward.

**Failure behavior**: implementing without a spec gate for a non-trivial task is itself an anti-pattern worth recording in `.ai/memory/anti-patterns.md` if it causes rework.
