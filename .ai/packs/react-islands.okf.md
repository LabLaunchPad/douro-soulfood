---
okf_version: "0.2"
id: "pack/react-islands"
type: "decision"
title: "React Islands"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/adr/react-islands.md"]
attestation:
  method: "agent"
  checks: ["verified zero React deps in package.json this session"]
summary: "No React installed. Astro + vanilla <script> is the default for all interactivity. React-as-island requires explicit user approval per component, plus the adapter file-split pattern."
load_when: "Any interactive-component decision."
token_budget: 350
related: ["docs/adr/react-islands.md", ".ai/decisions/no-global-react.okf.md"]
---

# React Islands

**No React dependency exists in this repo** — confirmed absent from `package.json`, removed deliberately in an earlier cleanup pass. Astro + vanilla `<script>` handles every current interaction (mobile nav drawer's focus trap, Maps consent gate, today's-hours widget).

React-as-island is allowed only when all of: meaningful client-side state, vanilla JS would be genuinely brittle, a prebuilt accessible component saves real time, and the TBT performance budget is protected — and only after explicit user approval naming the specific component. Never as a global framework, never replacing a working static component.

If ever approved: `src/components/islands/{Name}.tsx` + `src/components/adapters/{Name}Adapter.astro` — pages import the adapter only, never the island directly. Prefer `client:visible` over `client:load`.

**Full policy**: `docs/adr/react-islands.md`.
