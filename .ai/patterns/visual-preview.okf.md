---
okf_version: "0.2"
id: "pattern/visual-preview"
type: "spec"
title: "Pattern: adding a component to /dev/ui"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["src/pages/dev/ui.astro"] }
attestation: { method: "agent", checks: ["route actually loaded and inspected live this session"] }
summary: "How to add a new/changed component to the /dev/ui preview route: real prop shapes, all applicable states as separate instances, a manual-check note for anything that can't be shown statically."
load_when: "Any new or changed UI component, before considering it done."
token_budget: 250
related: [".ai/packs/visual-outcomes.okf.md", "src/pages/dev/ui.astro"]
---

# Pattern: adding to /dev/ui

Reference: `src/pages/dev/ui.astro`'s `MenuItemCard` section — three instances, each demonstrating a distinct real state (featured/full-photo, no-photo/empty, unavailable), not one instance with a comment claiming "other states also work."

```astro
<section>
  <h2 class="text-lg font-semibold mb-3 font-display">{ComponentName}</h2>
  <div class="flex flex-wrap gap-3">
    <{ComponentName} {...realPropsForState1} />
    <{ComponentName} {...realPropsForState2} />
  </div>
  <p class="text-xs text-text-tertiary mt-2">Manual check: {what can't be verified statically, e.g. focus-visible outline, hover animation}.</p>
</section>
```

Rules: use real prop shapes from the actual component's `Props` interface, not placeholder objects. One instance per meaningfully-different state, not one generic instance. Add a manual-check note for anything requiring interaction (focus, hover, reduced-motion) that a static render can't demonstrate.
