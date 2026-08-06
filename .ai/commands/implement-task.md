# Command: IMPLEMENT TASK

**Aliases**: "Implement task {id}", "Build {task}"

**Purpose**: write the actual code/doc change for a planned task.

**Inputs required**: a planned active task (PLAN TASK already run).

**Context to load**: whatever PLAN TASK identified — no more.

**Actions to perform**:
1. Make the smallest correct change achieving the task's stated outcome (Implementer role).
2. Follow the relevant guardian roles' constraints (Design System, CMS/Content, Accessibility, Performance, Security as applicable).
3. Do not skip straight past a stop/ask condition surfaced during planning.

**Outputs produced**: the actual diff.

**Stop/ask conditions**: same as `AGENTS.md`'s standing list — a new dependency, unclear license, brand-identity risk, schema risk, deployment secrets, or a test failure suggesting a deeper architectural issue.

**Example usage**: "Implement task TASK-001."
