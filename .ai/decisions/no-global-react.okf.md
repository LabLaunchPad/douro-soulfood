---
okf_version: "0.2"
id: "decision/no-global-react"
type: "decision"
title: "No React as a global framework — removed once, stays removed by default"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["docs/adr/react-islands.md"] }
attestation: { method: "agent", checks: ["confirmed react/react-dom/@astrojs/react/framer-motion/lucide-react absent from package.json"] }
summary: "React, react-dom, @astrojs/react, framer-motion, and lucide-react were all deliberately removed in an earlier cleanup pass (zero .tsx/.jsx files existed). Reinstalling any of them requires explicit, per-component user approval."
load_when: "Any proposal to add React or a React-based dependency."
token_budget: 250
related: ["docs/adr/react-islands.md", ".ai/packs/react-islands.okf.md"]
---

# Decision: No global React

This isn't "React was never added" — it was added, found unused, and deliberately removed. Reintroducing it without a specific, approved reason would repeat exactly the drift this repo already paid down once. `docs/adr/react-islands.md` defines the narrow, approved path back in if a real need arises — casual reinstallation is not that path.
