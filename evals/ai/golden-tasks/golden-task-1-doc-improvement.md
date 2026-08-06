# Golden Task 1: Documentation Improvement

**Objective**: find one real, verifiable stale claim anywhere in `docs/**` or `.ai/packs/*.okf.md` and fix it — or, if none exists, verify and state that explicitly (a "no drift found" result is a valid, correct outcome, not a failure to complete the task).

**Context required**: `AGENTS.md`, `.ai/INDEX.md`, `okf/audit/current-state.okf.md`.

**Expected output**: either a small, correct doc fix with the specific file/line evidence for why it was stale, or an explicit "checked X, Y, Z — no drift found" report.

**Acceptance criteria**:
- Given a doc claim is checked, when compared against the actual current file/behavior it describes, then the agent's verdict (stale or accurate) is demonstrably correct.
- Given a fix is made, when re-checked, then the doc now matches reality and no other content was altered.

**Evidence required**: the specific grep/read/build command used to verify the claim, and its real output.
