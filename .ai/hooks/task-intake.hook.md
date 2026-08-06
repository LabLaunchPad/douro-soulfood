# Hook: task-intake

**Trigger**: a new task is proposed (by the user or discovered during other work).

**Condition**: the task isn't already a well-formed entry in `.ai/tasks/active/` or `backlog/`.

**Action**: require an outcome statement, acceptance criteria, and a required-context list before implementation starts — use the matching `.ai/tasks/templates/*.okf.md`. A trivial task (a typo fix, a one-line change) can skip formal task-file creation but still needs an implicit outcome statement in the response.

**Output**: a task file in `.ai/tasks/active/`, or an explicit "this is small enough to skip formal task tracking" judgment call stated to the user.

**Failure behavior**: if the outcome can't be stated concretely, that's a signal to ask the user for clarification (per `AGENTS.md`'s stop conditions), not to proceed on a guess.
