# Workflow Hooks

13 workflow hooks — checkpoints an agent should apply during a task, not necessarily runtime code hooks (though some map to real scripts/CI checks, noted per hook). These formalize the execution loop already described in `.ai/packs/outcome-operator.okf.md`'s `<execution_loop>` and `AGENTS.md`'s "Task execution loop."

| Hook | Fires when |
|---|---|
| [session-start](./session-start.hook.md) | A new agent session begins |
| [task-intake](./task-intake.hook.md) | A new task is proposed |
| [context-selection](./context-selection.hook.md) | Before loading any file beyond `AGENTS.md`/`.ai/INDEX.md` |
| [truth-verification](./truth-verification.hook.md) | Before stating any factual claim |
| [spec-gate](./spec-gate.hook.md) | Before implementation starts |
| [pattern-reuse](./pattern-reuse.hook.md) | Before building something new |
| [safety-gate](./safety-gate.hook.md) | Before any dependency/schema/token change |
| [code-change](./code-change.hook.md) | Any time code is written |
| [verification](./verification.hook.md) | Before a task is called done |
| [benchmark](./benchmark.hook.md) | A change might affect performance |
| [docs-sync](./docs-sync.hook.md) | Code changes in a way a doc describes |
| [memory-capture](./memory-capture.hook.md) | A genuine new lesson surfaces |
| [final-report](./final-report.hook.md) | A task/session concludes |

Some hooks map to real automation: `truth-verification` → `.ai/scripts/validate-okf.mjs`/`validate-agent-docs.mjs`; `verification` → `pnpm build`/`test:e2e`/CI; `safety-gate` → the `no-global-react`/`keystatic-sync`/`design-tokens` decision docs. Where no script exists, the hook is purely a discipline an agent applies manually.
