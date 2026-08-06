# Hook: pattern-reuse

**Trigger**: before building something new (a component, a content collection, an interactive behavior).

**Condition**: the thing being built resembles something this repo already has a convention for.

**Action**: check `.ai/patterns/*.okf.md` first. Follow the existing pattern (`astro-component`, `section-component`, `content-collection`, `visual-preview`) unless there's a clear, stated reason to deviate.

**Output**: new work that looks and behaves consistently with existing equivalents, not a bespoke one-off shape.

**Failure behavior**: if no existing pattern fits and this is genuinely novel, that's fine — but note it, since it may become a new pattern worth documenting via the Docs Guardian role afterward.
