# Next Best Action

## The action
No urgent, currently-known repo issue remains open. Pick a fresh task, or check `.ai/tasks/backlog/README.md` for lower-priority items.

## Why it matters
Every concretely-actionable item from `.ai/tasks/backlog/README.md` has been resolved across this repo's session history: the `/menu` performance regression, the CSP bug that silently broke the mobile menu and Maps consent-gate, missing E2E coverage, legal-page gaps (Impressum/Datenschutz merged), Google Fonts self-hosting, Maps consent-gating, a stale EU ODR legal reference, WCAG AA contrast failures, and the design-system typography/color-token drift found by a full Impeccable audit. The former `public/images/` → `src/assets/` migration is done (fresh approval 2026-09-27 — see `.ai/memory/human-approvals.md`). The one remaining deliberate item is the 73-instance spacing half-step "deviation" (investigated and judged defensible, not drift — see `docs/design-system/SPACING_SYSTEM.md`).

## Exact command to run
`node .ai/scripts/agent-status.mjs` to get a fresh live read before picking a new task, rather than trusting this file if time has passed since it was written.

## Files likely needed
`.ai/tasks/backlog/README.md`, `.ai/memory/human-approvals.md`.
