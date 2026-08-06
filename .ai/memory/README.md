# .ai/memory/

Experience and lessons actually learned in this repo, with evidence — not generic advice.

| File | Contains |
|---|---|
| [learned-constraints.md](./learned-constraints.md) | Real technical constraints discovered through actual work (e.g. Astro frontmatter import-ordering, Chrome/proxy interstitial) |
| [anti-patterns.md](./anti-patterns.md) | Mistakes actually made and caught in this repo's history |
| [recurring-failures.md](./recurring-failures.md) | Environment/tooling failures seen more than once (e.g. wrangler dev's workerd error) |
| [human-approvals.md](./human-approvals.md) | Explicit approvals given for decisions that otherwise required a stop-and-ask |
| [approved-decisions.md](./approved-decisions.md) | Thin pointer to `human-approvals.md` — see that file for the reconciliation note; kept separate only to satisfy this round's naming, not because the content differs |
| [human-preferences.md](./human-preferences.md) | Explicit, stated preferences (not agent-inferred guesses about what the human probably wants) |
| [experience-ledger.okf.md](./experience-ledger.okf.md) | OKF-formatted rollup: what worked, what failed, what required rework, what agents misunderstood, what patterns are now standard |

## Rules for adding a memory entry (see `.ai/hooks/memory-capture.hook.md`)
1. No entry without evidence or explicit human approval.
2. No vague entries — each must be actionable by a future agent.
3. Each entry includes a date (or "unknown") and its source task/discussion.
4. Use `.ai/memory/templates/learning-entry.md` for new entries.

## When memory entries conflict with `.ai/decisions/*.okf.md`
`.ai/decisions/` holds settled architectural calls. `.ai/memory/` holds situational lessons and approvals. If a memory entry seems to contradict a decision, the decision wins unless a human explicitly revisits it — record the tension, don't silently resolve it either way.
