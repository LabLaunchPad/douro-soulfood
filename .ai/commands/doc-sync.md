# Command: DOC SYNC

**Aliases**: "Doc sync", "Find doc drift"

**Purpose**: find and fix places where a doc no longer matches the actual repo state — the Docs Guardian role's job.

**Inputs required**: optionally a specific doc/area; defaults to a general sweep.

**Context to load**: the doc(s) in question, the actual files they describe.

**Actions to perform**:
1. Cross-check each factual claim in the doc against a real file read/grep.
2. Fix any stale claim in place, preserving accurate surrounding content.
3. If the doc references a component/route/file that no longer exists, remove or correct the reference — don't leave it.
4. Update `.ai/manifest.yaml`/`.ai/packs/*.okf.md` if a doc's scope changed enough to affect its summary.

**Outputs produced**: the corrected doc(s), with a summary of what was stale and what it now says.

**Stop/ask conditions**: the drift reveals a real, undecided product question (not just a stale fact) — flag it rather than resolving it unilaterally.

**Example usage**: "Doc sync on docs/architecture.md — I think it's stale after the last refactor."
