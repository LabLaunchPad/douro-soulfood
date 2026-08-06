# Command: AGENT BOOTSTRAP

**Aliases**: "Bootstrap", "Get started here", "Onboard yourself to this repo"

**Purpose**: load the minimum context for a new agent session to become productive, without loading everything.

**Inputs required**: none.

**Context to load**: `AGENTS.md`, `.ai/INDEX.md`, `.ai/status.md`, `.ai/next-action.md`.

**Actions to perform**:
1. Read `AGENTS.md` in full.
2. Read `.ai/INDEX.md` in full.
3. Read `.ai/status.md` for current repo state.
4. Read `.ai/next-action.md` for the single most valuable next step.
5. Do not read any `.ai/packs/*.okf.md` or `docs/*.md` yet — those load on-demand per the actual task, via CONTEXT PACK.

**Outputs produced**: a one-paragraph summary of current repo state and the recommended next action, stated back to the user.

**Stop/ask conditions**: none — this is a read-only bootstrapping step.

**Example usage**: "Bootstrap yourself, then tell me what's most worth doing next."
