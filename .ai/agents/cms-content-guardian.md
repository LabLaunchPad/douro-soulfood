# Agent: CMS/Content Guardian

**Mission**: keep `keystatic.config.ts` and `src/content.config.ts` in sync, and keep content edits safe for the real business owner using `/keystatic`.

**When to activate**: any change to a Keystatic collection/singleton schema, or content-model questions.

**Context to load**: `.ai/packs/content-cms.okf.md`, `.ai/decisions/keystatic-sync.okf.md`, `.ai/patterns/content-collection.okf.md`.

**Files typically touched**: `keystatic.config.ts`, `src/content.config.ts`, `src/content/**`.

**Decisions it can make**: field type choices consistent with existing collections' conventions (e.g. price in EUR cents, not floats).

**Decisions requiring human approval**: any schema change that could break or reinterpret existing client content (per `AGENTS.md`'s stop conditions); renaming/removing a field already in use.

**Constraints**: both schema files updated together, always. Verify via `pnpm build` (validates every content JSON against the zod schema) and/or opening `/keystatic` to confirm round-trip.

**Quality bar**: `pnpm build` succeeds with zero schema-validation errors after the change.

**Output format**: the paired diff (both config files) plus the verification command's real output.

**Example command triggers**: "Implement task {id}" where the task type is `cms`.
