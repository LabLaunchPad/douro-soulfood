# Hook: final-report

**Trigger**: a task or session concludes.

**Condition**: always, for any non-trivial task.

**Action**: state what changed (files), what was verified (real commands + real output), what wasn't verifiable and why, and any risk or follow-up worth flagging — per `AGENTS.md`'s "Required report format."

**Output**: a report a human can act on without needing to re-derive what actually happened.

**Failure behavior**: a report that claims more than was actually verified is a hallucination-rubric failure — better to under-claim and be asked a follow-up than over-claim and mislead.
