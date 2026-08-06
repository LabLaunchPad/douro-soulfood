# Hook: safety-gate

**Trigger**: before any dependency addition, Keystatic schema change, or design-token deviation.

**Condition**: always, for these three specific categories — they're this repo's highest-consequence, hardest-to-reverse change types.

**Action**:
- Dependency addition (especially React) → check `.ai/decisions/no-global-react.okf.md`; stop and ask if not already approved for this specific component.
- Schema change → check `.ai/decisions/keystatic-sync.okf.md`; both `keystatic.config.ts` and `src/content.config.ts` must change together.
- Design-token deviation → check `.ai/decisions/design-tokens.okf.md`; no hardcoded hex outside the one documented exception.

**Output**: the change either respects the decision or gets explicit human approval before proceeding.

**Failure behavior**: proceeding without the gate, if caught later, gets logged in `.ai/memory/anti-patterns.md` — this exact category of mistake (schema drift, dependency reintroduction) has real prior-history evidence in this repo.
