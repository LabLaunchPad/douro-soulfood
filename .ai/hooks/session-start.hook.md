# Hook: session-start

**Trigger**: a new agent session begins in this repo.

**Condition**: always.

**Action**: read `AGENTS.md`, then `.ai/INDEX.md`, then `.ai/status.md`. Do not read anything else until a task is known (see `context-selection` hook).

**Output**: agent is oriented — knows the repo's identity, prime directives, non-negotiable constraints, and current state.

**Failure behavior**: if `AGENTS.md`/`.ai/INDEX.md`/`.ai/status.md` are missing, that's itself a finding — report it rather than proceeding as if the repo has no entrypoint system (equivalent to `node .ai/scripts/validate-agent-docs.mjs` failing).
