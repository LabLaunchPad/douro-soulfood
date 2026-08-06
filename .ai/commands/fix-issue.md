# Command: FIX ISSUE

**Aliases**: "Fix issue {description}", "This is broken: {description}"

**Purpose**: diagnose and fix a specific, described bug.

**Inputs required**: a description of the failure scenario (what's wrong, how to reproduce it if known).

**Context to load**: `.ai/tasks/templates/fix-task.okf.md`, whatever component/page the bug is in, `.ai/memory/anti-patterns.md`/`recurring-failures.md` (the bug may already be a known one).

**Actions to perform**:
1. Check `.ai/memory/anti-patterns.md` and `recurring-failures.md` first — this might already be diagnosed.
2. If not, investigate the actual root cause before writing a fix (don't patch a symptom).
3. Create a fix-task in `.ai/tasks/active/` using the fix-task template.
4. Implement the smallest correct fix.
5. Verify the specific failure scenario no longer occurs.

**Outputs produced**: the fix, plus a before/after verification (a failing check that now passes, or a grep showing the bad pattern is gone).

**Stop/ask conditions**: the root cause turns out to be architectural — stop and ask before a larger refactor than the bug report implied.

**Example usage**: "Fix issue: the mobile drawer doesn't close on Escape."
