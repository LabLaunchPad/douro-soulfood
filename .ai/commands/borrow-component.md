# Command: BORROW COMPONENT

**Aliases**: "Borrow component {name}", "Adapt {source} for {component}"

**Purpose**: use the prebuilt-component protocol to borrow and adapt an external pattern, rather than hand-rolling something accessibility-sensitive from scratch.

**Inputs required**: the component's purpose, ideally a candidate source (Radix UI, Headless UI, React Aria, shadcn/ui, Park UI, Tailwind patterns, HyperUI).

**Context to load**: `.ai/packs/prebuilt-components.okf.md`, `docs/prebuilt-components.md`, `.ai/packs/design-system.okf.md`, `.ai/packs/visual-outcomes.okf.md`.

**Actions to perform**:
1. Recommend 2–3 suitable sources if none was specified, based on accessibility, license, and visual fit.
2. Check license compatibility before copying anything.
3. Adapt fully: tokens, radius, shadows, easing, focus-visible, reduced-motion, mobile-first, typed props, DE/EN support where relevant.
4. Add the component to `/dev/ui` with real prop shapes and applicable states.
5. Document source/license/changes in the component file's header comment, per `docs/prebuilt-components.md`'s attribution format.

**Outputs produced**: the new component, its `/dev/ui` entry, and `docs/components.md` updated with its prop API.

**Stop/ask conditions**: license is unclear — stop and ask before copying (`AGENTS.md` stop condition #2). If the component needs real client-side state beyond what Astro + vanilla `<script>` can handle, this may also require React-island approval — check `.ai/decisions/no-global-react.okf.md` first.

**Example usage**: "Borrow component: a gallery lightbox."
