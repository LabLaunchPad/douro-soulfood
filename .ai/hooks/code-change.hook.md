# Hook: code-change

**Trigger**: any time code is written or modified.

**Condition**: always.

**Action**: follow the Implementer role's constraints — smallest correct change, Astro-first, `class:list`, typed props, design tokens. Apply the relevant guardian role(s) (Design System, CMS/Content, Accessibility, Performance, Security) based on what the change actually touches.

**Output**: a diff that would score well against `.ai/evals/rubrics/code-quality.md`.

**Failure behavior**: a change that violates a guardian role's constraint should be caught and fixed before the verification hook, not after.
