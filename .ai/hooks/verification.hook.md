# Hook: verification

**Trigger**: before a task is called done.

**Condition**: always — this is non-negotiable per `AGENTS.md`.

**Action**: run `pnpm build` at minimum. Run `pnpm test:e2e`/`pnpm lhci` where practical. Record real evidence for each check. If a check can't run (environment limitation), mark it `not_run` with the specific reason, per `.ai/memory/recurring-failures.md`'s documented cases.

**Output**: pass/fail/`not_run` per check, with real command output.

**Failure behavior**: claiming a check passed without running it is the single most severe violation in `.ai/evals/rubrics/ai-hallucination.md` — never do this, even under time pressure.
