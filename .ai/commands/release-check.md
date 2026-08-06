# Command: RELEASE CHECK

**Aliases**: "Release check", "Is this safe to merge"

**Purpose**: assess CI status and merge safety for a PR — the Release Guardian role's job.

**Inputs required**: a PR number, or "the current branch."

**Context to load**: `docs/release.md`, `.ai/memory/recurring-failures.md`.

**Actions to perform**:
1. Check the PR's CI check runs.
2. Classify each failure: matches the known `Deploy Preview`/`CLOUDFLARE_API_TOKEN` gap (verify by checking the actual failing job, don't assume), or a real, new failure.
3. For real failures on a PR the agent owns: fix or explain why not, per the PR-stewardship posture.
4. State the merge recommendation.

**Outputs produced**: a checklist of what passed/failed/is-the-known-gap, and a merge go/no-go.

**Stop/ask conditions**: a real, unresolved CI failure on a PR being merged; any request to force-push or bypass a check.

**Example usage**: "Release check PR #33 before we merge it."
