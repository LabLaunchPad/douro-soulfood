# Command: START TASK

**Aliases**: "Start task {id}", "Begin {task}"

**Purpose**: move a task from backlog (or a fresh request) into active work, with proper context loaded.

**Inputs required**: a task ID (from `.ai/tasks/backlog/`) or a plain description of new work.

**Context to load**: the task's own file if it exists in `.ai/tasks/backlog/`; otherwise the relevant `.ai/tasks/templates/*.okf.md`.

**Actions to perform**:
1. If the task exists in backlog, move it to `.ai/tasks/active/`.
2. If it's new, create it in `.ai/tasks/active/` using the matching template (outcome/fix/feature/doc/benchmark/component).
3. Run CONTEXT PACK for the task's type.
4. Hand off to PLAN TASK.

**Outputs produced**: a task file in `.ai/tasks/active/` with outcome, priority, type, required context, constraints, acceptance criteria, evidence required, benchmark impact, and stop/ask conditions filled in.

**Stop/ask conditions**: the task's outcome is genuinely ambiguous and can't be stated concretely without more input from the user.

**Example usage**: "Start task TASK-001-agent-performance-bootstrap."
