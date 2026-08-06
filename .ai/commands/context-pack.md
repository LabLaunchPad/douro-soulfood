# Command: CONTEXT PACK

**Aliases**: "Context pack for {task}", "What should I load for {task-type}"

**Purpose**: return the recommended context files for a given task or task type, per `.ai/routing.md`.

**Inputs required**: a task ID or task type (`ui`, `cms`, `performance`, `accessibility`, `security`, `react-island`, `prebuilt`, `benchmark`, `seo`, `docs`, `first-task`).

**Context to load**: `.ai/routing.md`.

**Actions to perform**:
1. Run `node .ai/scripts/context-pack.mjs <task-type>` if the environment allows Node execution.
2. If it can't run, manually look up the task type's row in `.ai/routing.md`.
3. Return the file list.

**Outputs produced**: a list of files to load, in priority order.

**Stop/ask conditions**: if the task type doesn't map cleanly to any row, ask the user to clarify the task's actual concern rather than loading everything "to be safe."

**Example usage**: "Create a context pack for a React island task."
