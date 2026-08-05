# Prebuilt Component Protocol

## Machine Contract
doc_id: PREBUILT-01
status: approved
outputs:
  - future borrowed/adapted components under `src/components/`
  - per-component source attribution (embedded in the component file, see §component_source_doc below)

## 1. Context
No component in this codebase has been borrowed from an external source yet — every current component (`Button`, `MapEmbed`, `PhotoGrid`, `FaqAccordion`, `MobileNavDrawer`, etc.) was hand-authored directly against `src/styles/tokens.css`. This document exists for the point where a future component is genuinely hard to get right from scratch (a11y-sensitive interactions like a combobox, a date picker, a modal with correct focus-trapping) — so the choice is "borrow and adapt a vetted, accessible pattern" instead of "hand-roll something that gets ARIA/focus/keyboard behavior subtly wrong."

## 2. Inputs
- `docs/agent.md`'s accessibility rules (semantic HTML, ARIA, `focus-visible`, reduced-motion respect) — every borrowed component must meet the same bar as hand-authored ones, no exceptions for "it came from a library."
- `src/styles/tokens.css` — the single source of design tokens every adapted component must be re-skinned against.
- `docs/adr/react-islands.md` — if the component being borrowed requires client-side interactivity beyond what vanilla `<script>` handles well, it may become a React island, but only under that ADR's rules; a borrowed component does not bypass the island-approval process.

## 3. Required Outputs — the protocol itself

### Approved sources
Radix UI, Headless UI, React Aria, shadcn/ui patterns, Park UI patterns, Tailwind component patterns, HyperUI patterns. All are headless-behavior-first or copy-paste-pattern sources — chosen specifically because they don't impose their own visual design system on top of this site's tokens.

### Borrow rules
1. Check license compatibility before copying anything — MIT/Apache-2.0-style permissive licenses are the expectation for all sources above; if a specific pattern carries different terms, verify before copying, don't assume.
2. Prefer accessible **headless primitives** (Radix, Headless UI, React Aria) for *behavior* — focus management, keyboard nav, ARIA wiring — over pre-styled component kits.
3. Prefer **copy-paste patterns** (shadcn/ui, Park UI, HyperUI style) over installing a heavy global component library as a dependency — this keeps the dependency footprint minimal and every line of the resulting component auditable and owned by this repo, not a black-box `node_modules` import.
4. Never install a full design system (Chakra, Mantine, MUI, etc.) that would bring its own theming and override `src/styles/tokens.css` — this site has one design-token source of truth, and it stays that way.
5. Every borrowed component must be fully adapted (see checklist below) before it's considered usable — an unstyled or partially-styled borrowed component is not "done," it's "half-imported."

### Adaptation checklist (all items required before merging)
- [ ] Replace every default color with a token from `src/styles/tokens.css` (`var(--color-brand-gold)`, etc.) — zero hardcoded hex values survive adaptation.
- [ ] Replace default border-radius with this project's radius tokens.
- [ ] Replace default shadows with this project's shadow tokens.
- [ ] Replace default transition easing with this project's motion tokens (`--ease-spring`, `--ease-out-quart`, etc.).
- [ ] `focus-visible` styles exist and are visible (not `outline: none` with nothing replacing it — a mistake already caught and fixed once this session in `MobileNavDrawer.astro`'s close button).
- [ ] `prefers-reduced-motion` is respected (matches `Base.astro`'s existing global reduced-motion `<style>` block, or the component's own equivalent if it needs finer control).
- [ ] Mobile-first layout — matches this site's `sm:`/`md:`/`lg:` Tailwind breakpoint convention, not the source's own breakpoint assumptions.
- [ ] Props are typed (TypeScript `interface Props` in the `.astro`/`.tsx` frontmatter, matching every existing component's convention).
- [ ] DE/EN content support where the component renders user-facing text (matches `menu_items.descriptionEn`'s established bilingual pattern) — not required for purely structural/behavioral components.
- [ ] All required visual states exist and are checked in `/dev/ui` (see `<visual_outcome_protocol>` in `CLAUDE.md`): default, hover, focus-visible, active, disabled, loading, empty, error, mobile, desktop — as applicable to the component's actual behavior (a static badge has no "loading" state, for instance; don't force irrelevant states).

### Component source documentation (required, embedded in the component file)
Every borrowed component's `.astro`/`.tsx` file must open with a comment block stating:
```
/**
 * {ComponentName} — adapted from {source name}
 * Source: {URL}
 * License: {license identifier}
 * Copied: {what was taken from the source}
 * Changed: {what was adapted — tokens, markup, behavior}
 * Used in: {which page(s)/component(s) import this}
 */
```
This is the same spirit as `MobileNavDrawer.astro`'s existing header comment explaining *why* it's split from `NavBar.astro` — attribution and rationale live with the code, not only in a separate doc that can drift.

## 4. Constraints
- A borrowed component that can't be fully adapted (tokens, a11y, mobile-first) within a reasonable diff is the wrong choice — pick a simpler source pattern or hand-author instead of shipping a half-adapted component.
- License-uncertain patterns must not be copied — per `CLAUDE.md`'s `<stop_and_ask_conditions>` item 2, stop and ask the user if a license is unclear.
- This protocol does not pre-approve installing any of the "approved sources" as npm dependencies — copy-paste patterns need no dependency; headless-primitive libraries (Radix, React Aria) that are React-based still require `docs/adr/react-islands.md`'s separate approval process if the component becomes a React island.

## 5. Acceptance Criteria
- Given a component is hard to build correctly from scratch (a11y-sensitive interaction), when evaluated, then check the approved-sources list before hand-rolling a custom solution that risks getting ARIA/focus wrong.
- Given a component is borrowed, when adapted, then every item in the adaptation checklist must be checked off and the component must appear in `/dev/ui` with its documented states before it's considered done.
- Given a borrowed component's source license is anything other than a clearly permissive license, when discovered, then implementation stops and the user is asked, per `CLAUDE.md`'s stop conditions.

## 6. Agent Execution Rules
- MUST: check license compatibility before copying any external pattern.
- MUST: complete the full adaptation checklist — no partially-adapted borrowed component ships.
- MUST: embed the source-attribution comment block in the component file itself.
- MUST NOT: install a full third-party design system/component kit that brings its own theming.
- MUST NOT: treat "it's from a respected library" as a substitute for actually re-skinning against this project's tokens — the whole point of borrowing is the *behavior*, not the *look*.
