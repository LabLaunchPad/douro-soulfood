# Command: PLAN TASK

**Aliases**: "Plan task {id}"

**Purpose**: produce the implementation plan and role sequence for an active task before writing code.

**Inputs required**: an active task in `.ai/tasks/active/`.

**Context to load**: the task file itself, `.ai/agents/README.md`, relevant `.ai/patterns/*.okf.md` and `.ai/decisions/*.okf.md`.

**Actions to perform**:
1. Identify which agent roles the task needs (Orchestrator's job, per `.ai/agents/orchestrator.md`).
2. List exact files to change.
3. Identify risks and any decision-gates (e.g. does this need React-island approval per `.ai/decisions/no-global-react.okf.md`).
4. Confirm acceptance criteria are concrete and testable.

**Outputs produced**: a short plan — files to touch, role sequence, risks, any pending approval needed before implementation starts.

**Stop/ask conditions**: the plan surfaces a `AGENTS.md` stop condition (new dependency, unclear license, brand-identity risk, schema risk, deployment secrets) — stop and ask before IMPLEMENT TASK.

**Example usage**: "Plan task TASK-001 before you touch any code."
