# Hook: truth-verification

**Trigger**: before stating any factual claim about the repo (a file exists, a metric has a value, a behavior works a certain way).

**Condition**: always — this is the single most important hook in the system, per `.ai/truth-gates.md`.

**Action**: verify via a real read/grep/command run this session. Never state something as fact from memory of a similar-looking repo or a plausible guess. If unverifiable in the current environment, say so explicitly (`unverified`, `not_run`, `needs-review`).

**Output**: every factual claim in the final response traces to an actual check performed this session.

**Failure behavior**: an unverifiable claim gets marked as such, with what would resolve it — never silently presented as verified. Maps to `.ai/evals/rubrics/ai-hallucination.md`.
