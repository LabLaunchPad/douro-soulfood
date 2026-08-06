# Truth Gates

Checks an agent should run before stating something as fact, to prevent invention.

## Gate 1 — "Does this file/route/component actually exist?"
Before referencing a file path, route, or component name, verify it with a real read/grep — not from memory of a similar-sounding repo, not from what "should" exist given the stack. This repo has caught real drift before (a doc claiming a component existed that had been deleted months earlier) — verify, don't assume.

## Gate 2 — "Is this a current fact or a historical one?"
`okf/audit/current-state.okf.md` is the canonical current-state snapshot. If a doc (including `.ai/packs/outcome-operator.okf.md`, which is intentionally historical) says something different, the audit wins unless the audit itself is stale — check its `updated`/`freshness` frontmatter field.

## Gate 3 — "Can I verify this by running something?"
Prefer `pnpm build`, a grep, or a direct file read over asserting a claim. If a claim can't be verified in the current environment (e.g. Lighthouse/Playwright needing a Chromium binary that doesn't launch in some sandboxes), say so explicitly — mark it `not_run` or `unverified`, don't imply it passed.

## Gate 4 — "Am I inventing a number?"
Never state a specific metric (a Lighthouse score, a byte count, a percentage) unless it came from an actual command's output in this session. "Pending" or "unverified" is always safer than a plausible-sounding invented number — this exact judgment call was made explicitly once already in this repo's history (declining to insert an unverified VAT/registration number into a legal document, choosing an honest placeholder instead).

## Gate 5 — "Does this contradict a documented decision?"
Check `.ai/decisions/*.okf.md` before proposing something that might already have been decided against (e.g. "let's just add React for this" — see `.ai/decisions/no-global-react.okf.md`). If a decision seems wrong given new information, propose revisiting it explicitly — don't silently override it.

## What to do when a gate fails
Mark the claim `needs-review` (per the OKF `freshness` field convention) rather than guessing. State plainly what would resolve the uncertainty (a command to run, a file to check, a question to ask the user).
