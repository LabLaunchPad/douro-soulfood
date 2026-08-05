---
okf_version: "0.2"
id: "decision/astro-first"
type: "decision"
title: "Astro-first: static components + vanilla script, not a JS framework"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["docs/adr/react-islands.md"] }
attestation: { method: "agent", checks: ["verified zero React deps; verified 3 real interactive components use vanilla <script> successfully"] }
summary: "Every page, layout, section, card, badge is a static .astro component by default. Interactivity is vanilla <script>, not a client framework, until proven genuinely insufficient."
load_when: "Deciding how to implement any interactive behavior."
token_budget: 250
related: [".ai/decisions/no-global-react.okf.md", "docs/adr/react-islands.md"]
---

# Decision: Astro-first

Proven in this repo already: the mobile nav drawer's focus trap, the Maps two-click consent gate, and the client-side today's-hours widget all work correctly as vanilla `<script>` inside `.astro` components — no framework needed. This is the reference bar any "we need React for this" claim must clear before being taken seriously.
