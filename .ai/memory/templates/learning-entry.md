# Learning Entry Template

Copy this block into the appropriate `.ai/memory/*.md` file when recording a new lesson (see `.ai/hooks/memory-capture.hook.md` and `.ai/commands/learn.md`).

```markdown
- **Date**: {ISO date, or "unknown"}
- **Source**: {task ID, PR number, or discussion this came from}
- **Type**: {constraint | anti-pattern | recurring-failure | preference | approval}
- **Insight**: {the actual lesson, stated concretely}
- **Evidence**: {what actually happened — a command's real output, a specific file/line, an explicit quote}
- **Recommended behavior**: {what a future agent should do differently because of this}
- **Status**: {active | superseded | resolved}
```

## Example (already applied — see `.ai/memory/learned-constraints.md`)
```markdown
- **Date**: unknown
- **Source**: /dev/ui preview route implementation task
- **Type**: constraint
- **Insight**: Astro's frontmatter compiler requires `import` statements before any top-level `if`/`return` guard clause.
- **Evidence**: putting `if (!import.meta.env.DEV) { return new Response(...) }` before the `import` lines produced "Unterminated string literal" — an esbuild error with no obvious connection to import order.
- **Recommended behavior**: always put imports first in Astro frontmatter, guards after.
- **Status**: active
```
