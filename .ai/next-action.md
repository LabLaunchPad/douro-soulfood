# Next Best Action

## The action
No urgent, currently-known repo issue remains open. Pick a fresh task, or check `.ai/tasks/backlog/README.md` for lower-priority items.

## Why it matters
Every concretely-actionable item from `.ai/tasks/backlog/README.md` was resolved this session: the `/menu` performance regression (image payload -80%, DOM size -28%), a real production bug where CSP was silently blocking the mobile menu and Maps consent-gate, and missing E2E coverage for 3 routes. The one remaining backlog item (`public/images/` → `src/assets/` pipeline migration) was explicitly deferred by the user because it requires a Keystatic CMS schema change — see `.ai/memory/human-approvals.md`.

## Exact command to run
`node .ai/scripts/agent-status.mjs` to get a fresh live read before picking a new task, rather than trusting this file if time has passed since it was written.

## Files likely needed
`.ai/tasks/backlog/README.md`, `.ai/memory/human-approvals.md`.
