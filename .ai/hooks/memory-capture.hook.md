# Hook: memory-capture

**Trigger**: a genuine new lesson surfaces — a real constraint discovered, a mistake caught, a recurring environment failure, an explicit human preference/approval.

**Condition**: there's real evidence (not a guess) and it's actionable for a future agent.

**Action**: run LEARN — append to the correct `.ai/memory/*.md` file using `.ai/memory/templates/learning-entry.md`'s fields.

**Output**: a new, evidence-backed, actionable memory entry.

**Failure behavior**: recording a vague or speculative "lesson" pollutes memory and makes it less trustworthy over time — when in doubt, don't record it rather than record something weak.
