# Command Registry

Agent-agnostic, plain-language commands — no slash-command support required. Any of these work as a natural-language instruction to any AI coding agent in this repo.

| Command | File | Purpose |
|---|---|---|
| AGENT BOOTSTRAP | [agent-bootstrap.md](./agent-bootstrap.md) | Load minimum context for a new session |
| AGENT STATUS | [agent-status.md](./agent-status.md) | Report current repo/task/benchmark state |
| CONTEXT PACK | [context-pack.md](./context-pack.md) | Get recommended context for a task type |
| START TASK | [start-task.md](./start-task.md) | Begin work on a task, active or new |
| PLAN TASK | [plan-task.md](./plan-task.md) | Produce a spec + role sequence before implementing |
| IMPLEMENT TASK | [implement-task.md](./implement-task.md) | Write the code change |
| VERIFY TASK | [verify-task.md](./verify-task.md) | Check evidence against acceptance criteria |
| BENCH RUN | [bench-run.md](./bench-run.md) | Collect real performance metrics |
| BENCH COMPARE | [bench-compare.md](./bench-compare.md) | Diff current metrics against baseline |
| EVAL AGENT | [eval-agent.md](./eval-agent.md) | Run the repo quiz / adversarial checks against an agent |
| DOC SYNC | [doc-sync.md](./doc-sync.md) | Find and fix doc/code drift |
| LEARN | [learn.md](./learn.md) | Record a new lesson to `.ai/memory/` |
| FIX ISSUE | [fix-issue.md](./fix-issue.md) | Diagnose and fix a specific bug |
| BORROW COMPONENT | [borrow-component.md](./borrow-component.md) | Adapt an external component per the prebuilt-components protocol |
| RELEASE CHECK | [release-check.md](./release-check.md) | Assess CI status and merge safety |

## Usage
Say the command name plainly, e.g. *"Run AGENT STATUS"*, *"Create a context pack for TASK-001"*, *"Start task TASK-001"*. No special syntax required — any agent following `AGENTS.md` should recognize these by name and follow the matching spec file.
