---
okf_version: "0.2"
id: "pattern/react-island"
type: "spec"
title: "Pattern: React island (not yet used — reference only)"
status: "draft"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "experimental"
trust: "draft"
provenance: { source: "human", references: ["docs/adr/react-islands.md"] }
attestation: { method: "manual", checks: [] }
summary: "No React island exists in this repo yet. This pattern documents the required shape if/when one is ever approved, per docs/adr/react-islands.md."
load_when: "A React island has been explicitly approved and is being implemented for the first time."
token_budget: 250
related: [".ai/packs/react-islands.okf.md", "docs/adr/react-islands.md", ".ai/patterns/adapter-component.okf.md"]
---

# Pattern: React island (untested — no live example exists)

**Status note**: unlike every other pattern in `.ai/patterns/`, this one has no real example in the codebase to point to — it's derived from `docs/adr/react-islands.md`'s policy, not from working code. Treat it as draft until a first real island validates it.

```tsx
// src/components/islands/{Name}.tsx
import { useState } from 'react';
export default function {Name}({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  // ...
}
```

```astro
---
// src/components/adapters/{Name}Adapter.astro
import {Name} from '@/components/islands/{Name}';
interface Props { initialValue: string }
const { initialValue } = Astro.props;
---
<{Name} initialValue={initialValue} client:visible />
```

Pages import the adapter only. `client:visible` unless there's a specific, justified reason for `client:load`.
