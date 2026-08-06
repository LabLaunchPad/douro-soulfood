# Command: LEARN

**Aliases**: "Learn", "Remember this"

**Purpose**: record a genuine, evidence-backed lesson to `.ai/memory/` — the Memory Curator role's job.

**Inputs required**: the lesson itself, its evidence (a task, a discussion, a real failure encountered).

**Context to load**: `.ai/memory/README.md`, `.ai/memory/templates/learning-entry.md`.

**Actions to perform**:
1. Determine which memory file it belongs in: `learned-constraints.md` (a technical fact discovered), `anti-patterns.md` (a mistake made and caught), `recurring-failures.md` (an environment/tooling issue seen more than once), `human-preferences.md` (an explicit stated preference), `human-approvals.md`/`approved-decisions.md` (an explicit approval given).
2. Fill in `.ai/memory/templates/learning-entry.md`'s fields: date, source, type, insight, evidence, recommended behavior, status.
3. Append to the correct file.

**Outputs produced**: a new entry in the appropriate `.ai/memory/*.md` file.

**Stop/ask conditions**: the "lesson" is actually a guess about what the human wants, not something explicitly stated or directly observed — don't record speculation as memory.

**Example usage**: "Learn from this: the sitemap kept including /dev/ui until we added an explicit filter."
