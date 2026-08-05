# Task Routing

Route by task type. Load only the listed packs — not everything.

| Task type | Load |
|---|---|
| UI task (new/changed component, layout, styling) | `.ai/packs/design-system.okf.md`, `.ai/packs/components.okf.md`, `.ai/packs/visual-outcomes.okf.md` |
| CMS/content task (Keystatic schema, content collections) | `.ai/packs/content-cms.okf.md`, `.ai/packs/architecture.okf.md` |
| Performance task (page weight, images, JS budget) | `.ai/packs/performance.okf.md`, `benchmarks/README.md` |
| Accessibility task | `.ai/packs/accessibility.okf.md`, `.ai/packs/testing.okf.md` |
| Security task (CSP, third-party scripts, consent) | `.ai/packs/security.okf.md` |
| React island task | `.ai/packs/react-islands.okf.md`, `.ai/packs/performance.okf.md`, `.ai/packs/components.okf.md`, `.ai/decisions/no-global-react.okf.md` |
| Prebuilt component task | `.ai/packs/prebuilt-components.okf.md`, `.ai/packs/design-system.okf.md`, `.ai/packs/visual-outcomes.okf.md` |
| Benchmark task | `.ai/packs/performance.okf.md`, `benchmarks/README.md`, `evals/README.md` |
| SEO task | `.ai/packs/seo.okf.md`, `.ai/packs/architecture.okf.md` |
| Docs-only task | The specific `docs/*.md` file being changed, plus its pack if one exists — nothing else |
| First task in a new session | `.ai/packs/repo-overview.okf.md`, `okf/audit/current-state.okf.md` |

If a task spans multiple types (e.g. a React island that's also a performance concern), load the union of the relevant rows — don't load every pack "to be safe."
