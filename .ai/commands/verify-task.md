# Command: VERIFY TASK

**Aliases**: "Verify task {id}", "Check {task} is actually done"

**Purpose**: check a completed implementation against its stated acceptance criteria and evidence requirements — the QA Verifier role's job.

**Inputs required**: an implemented active task.

**Context to load**: the task's `## Acceptance criteria` and `## Evidence required` sections, `.ai/packs/testing.okf.md`.

**Actions to perform**:
1. Run `pnpm build` at minimum.
2. Run `npx playwright test --list` (or a full run if the environment supports it) if the task touches tested behavior.
3. Check each acceptance criterion against real, produced evidence — not assumed.
4. Move the task file to `.ai/tasks/completed/` if it passes, filling in the actual verification results.

**Outputs produced**: pass/fail/`not_run` per check, with real command output for each; the task file moved and updated.

**Stop/ask conditions**: a check fails and the root cause is architectural rather than a simple fix — stop and ask rather than force a workaround.

**Example usage**: "Verify task TASK-001 before we call it done."
