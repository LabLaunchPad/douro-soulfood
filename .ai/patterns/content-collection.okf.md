---
okf_version: "0.2"
id: "pattern/content-collection"
type: "spec"
title: "Pattern: Keystatic content collection"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["keystatic.config.ts", "src/content.config.ts"] }
attestation: { method: "agent", checks: ["read both schema files this session, confirmed field-for-field match"] }
summary: "A Keystatic collection needs a matching entry in both keystatic.config.ts (the CMS schema) and src/content.config.ts (Astro's zod schema) — hand-synced, no shortcut."
load_when: "Adding a new Keystatic content collection, or a new field on an existing one."
token_budget: 250
related: [".ai/decisions/keystatic-sync.okf.md", ".ai/packs/content-cms.okf.md"]
---

# Pattern: content collection

Reference example: `menu_items` and `faq` in `keystatic.config.ts`, mirrored in `src/content.config.ts`'s `defineCollection` + `glob` loader + zod schema.

```ts
// keystatic.config.ts
myCollection: collection({
  label: 'My Collection',
  slugField: 'title',
  path: 'src/content/my-collection/*',
  format: { data: 'json' },
  schema: { title: fields.slug({...}), /* ... */ },
})
```
```ts
// src/content.config.ts
const myCollection = defineCollection({
  loader: glob({ pattern: '*.json', base: 'src/content/my-collection' }),
  schema: z.object({ title: z.string(), /* matching fields */ }),
});
```

A `settings`-style singleton (site-wide config, one instance) is read via direct JSON import (`import siteSettings from '@/content/settings/default.json'`), not `getCollection()` — check `keystatic.config.ts` for whether something is a `collection` or a `singleton` before assuming the read pattern.
