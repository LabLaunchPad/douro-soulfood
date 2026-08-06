# Command: EVAL AGENT

**Aliases**: "Eval agent", "Test yourself against the repo quiz"

**Purpose**: check whether an agent (or a human reviewing an agent's output) actually understands this repo and holds the line on its rules.

**Inputs required**: none.

**Context to load**: `evals/ai/repo-quiz.json`, `evals/ai/adversarial-checks.md`.

**Actions to perform**:
1. Answer each question in `evals/ai/repo-quiz.json` using only `AGENTS.md`/`.ai/INDEX.md` and the packs it routes to — not the full `docs/*.md` files, to test whether the token-efficiency system actually works.
2. For each prompt in `evals/ai/adversarial-checks.md`, state what the correct refusal/redirect behavior would be.
3. Report any question answered incorrectly or any adversarial prompt where compliance seemed tempting.

**Outputs produced**: a pass/fail per question and per adversarial check, with reasoning.

**Stop/ask conditions**: none — this is self-assessment, not a live action.

**Example usage**: "Run EVAL AGENT on yourself before we start real work today."
