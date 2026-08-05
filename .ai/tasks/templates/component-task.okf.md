---
okf_version: "0.2"
id: "task/{stable-id}"
type: "task"
title: "Component: {component name}"
status: "draft"
created: "{ISO date or unknown}"
updated: "{ISO date or unknown}"
freshness: "current"
lifecycle: "experimental"
trust: "draft"
provenance: { source: "{repo|human|ai|mixed}", references: [] }
attestation: { method: "{manual|script|ci|agent}", checks: [] }
summary: "{1-3 sentence summary of the component and its purpose}"
load_when: "{when an agent should read this}"
token_budget: 550
related: ["docs/components.md"]
---

# Component: {component name}

## Task ID
`{stable-id}`

## Outcome
{The component exists, is documented, and is previewable at `/dev/ui` with its real states.}

## Type
{astro-component | react-island | prebuilt-adaptation}

## Priority
{P0|P1|P2}

## Decision gate (answer before implementing)
- Astro-first default: is this genuinely not achievable well with a static Astro component + vanilla `<script>`? If it is, stop here — build it as Astro, don't reach for React.
- If React-as-island: has the user explicitly approved this specific component? See `.ai/decisions/no-global-react.okf.md` and `docs/adr/react-islands.md`.
- If prebuilt-adaptation: which approved source (`.ai/packs/prebuilt-components.okf.md`), and is its license confirmed compatible?

## Required context
`.ai/packs/components.okf.md`, `.ai/packs/design-system.okf.md`, `.ai/packs/visual-outcomes.okf.md`, plus the React-islands or prebuilt-components pack if applicable.

## Constraints
Design tokens only, `class:list` for conditionals, typed props, `focus-visible` + reduced-motion support, mobile-first.

## Acceptance criteria
- Given the component's real prop shape, when rendered in `/dev/ui`, then all applicable states (default/hover/focus-visible/active/disabled/loading/empty/error/mobile/desktop) are visible and correct.

## Evidence required
`pnpm build` passes; component added to `/dev/ui` with real props (not placeholder lorem ipsum where real content patterns exist); `docs/components.md` updated with its prop-level API.

## Benchmark impact
{If a React island: check TBT budget per `.ai/packs/performance.okf.md`. If Astro-only: none.}

## Stop/ask conditions
Adding a React dependency without prior approval; unclear prebuilt-component license; visual change risks brand-identity drift.
