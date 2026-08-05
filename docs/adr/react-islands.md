# ADR: React Islands Policy

## Machine Contract
doc_id: ADR-REACT-ISLANDS-01
status: approved
outputs:
  - `src/components/islands/*.tsx` (when/if ever created)
  - `src/components/adapters/*.astro` (when/if ever created)
  - `astro.config.mjs`'s `integrations` array (only if an island is actually approved and implemented)

## 1. Context
This site currently ships **zero client-side JavaScript framework** — confirmed via `docs/audit/current-state.md`: no `react`/`react-dom`/`@astrojs/react` in `package.json`, no `react()` in `astro.config.mjs`'s integrations. That's a deliberate, hard-won state — `react`, `react-dom`, `@astrojs/react`, `framer-motion`, and `lucide-react` were all explicitly **removed** in an earlier cleanup pass this session because zero `.tsx`/`.jsx` files existed anywhere and Keystatic bundles its own React independently (the admin doesn't need the site integration to function). This ADR exists so that if React is reintroduced in the future, it's reintroduced deliberately, scoped tightly, and never as a repeat of that same drift.

**This ADR does not install React.** It defines the policy for when and how it would be added, per `CLAUDE.md`'s `directive id="6"`: "No silent architecture changes. React, new dependencies, or major structural changes require an ADR" — and per the explicit instruction accompanying this backlog: prepare the policy, do not install dependencies without separate approval.

## 2. Inputs
- The current zero-JS-framework baseline (`docs/architecture.md`'s Rendering Strategy: "Client Islands: none").
- `docs/performance-budget.md`'s Total Blocking Time budget (< 200ms, `error`-level, blocks CI) — the primary constraint any island must respect.
- `docs/user-flows.md`'s 5 documented flows — none of them currently require client-side state that vanilla `<script>` (already used for the mobile nav drawer's focus trap, the Maps consent gate, and the today's-hours widget) can't handle.

## 3. Required Outputs — the policy itself

### Default: Astro-first
Pages, layouts, static sections, cards, badges, menu displays, SEO-critical content, and simple presentational UI are Astro components, always. This is not negotiable per-component — it's the default that requires a documented exception to break.

### When React-as-island is allowed
Only when **all** of these hold:
- The component has meaningful interactive client-side state (not just a CSS `:hover`/`:focus` or a single click-toggle — those are already solved with plain `<script>`, see `MobileNavDrawer.astro`/`MapEmbed.astro`).
- Plain HTML/CSS/vanilla JS would be genuinely brittle or unmaintainable for the interaction (not just "React would be more familiar").
- A prebuilt, accessible component (per `docs/prebuilt-components.md`) would save meaningful implementation time over hand-rolling the interaction correctly (focus management, ARIA state, keyboard operability).
- The Total Blocking Time budget (`docs/performance-budget.md`) is not put at risk — checked before merging, not after.

**Plausible future candidates** (none exist today, none are pre-approved by this ADR — each still needs its own explicit approval before implementation): live menu filtering with complex multi-facet state, a multi-step catering/contact form with client-side validation, a gallery/lightbox, a modal-driven booking flow, or a widget with non-trivial validation state.

### When React is never allowed
As a global app framework, as a replacement for any currently-working static Astro component, or as the default choice for simple UI — a static card, a badge, a text section, the hero, a simple image grid, footer content, or a simple menu-item display must never become React components regardless of implementer preference.

### Adapter pattern (mandatory if an island is ever added)
```
src/components/islands/{Name}.tsx      — the actual React component
src/components/adapters/{Name}Adapter.astro  — the Astro wrapper
```
Pages import and use the `.astro` adapter, **never** the `.tsx` island directly. This keeps every page's import graph Astro-only at a glance, and keeps hydration directives (`client:*`) declared in exactly one place per component.

### Hydration rules
- Prefer `client:visible` over `client:load` — never hydrate an island the visitor might not scroll to.
- Never hydrate an above-the-fold island unless the interaction is genuinely critical to first-viewport usefulness (a hero CTA button is not a valid reason — it's a static link today, and should stay one).
- Every island's `client:*` directive choice must be justified in its adapter file's comment: what triggers hydration, and why that's the right trade-off for its actual usage pattern.

## 4. Constraints
- No React dependency (`react`, `react-dom`, `@astrojs/react`, or any React-based headless UI library) may be added to `package.json` without a specific, user-approved implementation task naming the exact component — this ADR alone does not authorize installation.
- Any approved island must be added to the `/dev/ui` preview route (`docs/prebuilt-components.md` §visual verification) before being considered done.
- Any approved island must be measured against `docs/performance-budget.md`'s Total Blocking Time threshold on all 5 Lighthouse-audited pages, not just the page it appears on (React runtime overhead, even for one island, affects every page that loads it).

## 5. Acceptance Criteria
- Given a request to add interactive behavior, when evaluated, then Astro + vanilla `<script>` must be ruled out first (per the pattern already proven in `MobileNavDrawer.astro`, `MapEmbed.astro`, and `index.astro`'s today's-hours widget) before React is even considered.
- Given React is genuinely justified, when proposed, then the proposal must name the specific component, cite which of the 4 "allowed" conditions in §3 it satisfies, and get explicit user approval before `react`/`react-dom`/`@astrojs/react` are installed.
- Given an island is implemented, when it ships, then it must follow the adapter pattern exactly (island file + adapter file, page imports the adapter only) and appear in `/dev/ui`.

## 6. Agent Execution Rules
- MUST: default to Astro + vanilla `<script>` for all new interactive behavior.
- MUST: stop and ask the user before installing any React dependency (per `CLAUDE.md`'s `<stop_and_ask_conditions>` item 1) — this ADR's existence does not constitute that approval.
- MUST: follow the island/adapter file-split pattern exactly if an island is ever approved and built.
- MUST NOT: convert an existing, working static Astro component to React "for consistency" or "to modernize" — that's exactly the drift this ADR exists to prevent (the site already paid down that exact debt once this session).
- MUST NOT: use `client:load` as a default — justify every hydration directive explicitly.
