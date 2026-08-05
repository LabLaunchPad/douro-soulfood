---
okf_version: "0.2"
id: "decision/image-policy"
type: "decision"
title: "Astro <Image> everywhere; public/ passthrough is a known, accepted limitation"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["docs/audit/image-audit.md"] }
attestation: { method: "agent", checks: ["confirmed zero raw <img> in index.astro/menu.astro this session"] }
summary: "Astro <Image> component required for all page-level image usage — achieved. Source files live in public/images/ (not src/assets/), so Astro passes them through unprocessed (no compression gain, only correct width/height/decoding)."
load_when: "Adding any new image to a page or component."
token_budget: 250
related: [".ai/packs/performance.okf.md", "docs/audit/image-audit.md"]
---

# Decision: Image policy

Use Astro `<Image>`, always, with real (not guessed) `width`/`height` from the actual source file. This is achieved across `index.astro` and `menu.astro` — verified via grep, zero raw `<img>` remain in either.

**Known, accepted limitation, not a bug to silently "fix" again**: because source files live in `public/images/` rather than `src/assets/`, Astro's image service passes them through unprocessed — no format conversion or recompression happens. The real gain from `<Image>` here is correct intrinsic size hints (preventing layout shift) and `decoding="async"`, not byte-size reduction. Real compression gains require relocating assets to `src/assets/`, a larger migration not yet undertaken (see `.ai/tasks/backlog/README.md`).
