---
okf_version: "0.2"
id: "pattern/astro-component"
type: "spec"
title: "Pattern: standard Astro component"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["src/components/ui/Button.astro"] }
attestation: { method: "agent", checks: ["pattern matches Button.astro and every other current .astro component"] }
summary: "How every non-island component in this repo is structured: typed Props interface, destructured with defaults, class:list for conditional classes, tokens for all colors/spacing."
load_when: "Creating any new .astro component."
token_budget: 250
related: [".ai/packs/components.okf.md", "src/components/ui/Button.astro"]
---

# Pattern: Astro component

Reference example: `src/components/ui/Button.astro`.

```astro
---
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost';
  class?: string;
}
const { variant = 'primary', class: className = '' } = Astro.props;
---
<div class:list={['base-classes', variant === 'primary' && 'primary-classes', className]}>
  <slot />
</div>
```

Rules: `interface Props` always typed. Destructure with sensible defaults, never require every prop. `class:list={[...]}` for any conditional/merged class, never string concatenation. All colors/radii/shadows/easing via `var(--token-name)` or Tailwind's `bg-brand-gold` (backed by the same tokens) — never a raw hex.
