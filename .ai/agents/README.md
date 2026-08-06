# Agent Role Matrix

14 role cards defining tailored behavior for different kinds of work in this repo. These are **behavioral lenses for a single agent to adopt per-task**, not separate bots — any AI coding agent working in this repo picks the role(s) that fit the current task and follows that card's context/constraints/quality bar.

| Role | Activates for |
|---|---|
| [Orchestrator](./orchestrator.md) | Multi-step tasks needing sequencing across other roles |
| [Context Librarian](./context-librarian.md) | Deciding what to load before starting any task |
| [Spec Writer](./spec-writer.md) | A task lacks a governing doc or acceptance criteria |
| [Implementer](./implementer.md) | Writing the actual code change |
| [Design System Guardian](./design-system-guardian.md) | Any styling/token-touching change |
| [CMS/Content Guardian](./cms-content-guardian.md) | Keystatic schema or content-collection changes |
| [Accessibility Guardian](./accessibility-guardian.md) | Any UI change |
| [Performance Engineer](./performance-engineer.md) | JS/image/page-weight changes, React island proposals |
| [QA Verifier](./qa-verifier.md) | Verifying a change before it's called done |
| [Benchmark Analyst](./benchmark-analyst.md) | Collecting or interpreting performance/quality metrics |
| [Docs Guardian](./docs-guardian.md) | Keeping docs in sync with code |
| [Memory Curator](./memory-curator.md) | Deciding what's worth recording as a lesson learned |
| [Security Guardian](./security-guardian.md) | Third-party scripts, CSP, consent, secrets |
| [Release Guardian](./release-guardian.md) | CI failures, deployment, merge decisions |

A single task usually invokes 2–4 roles (e.g. a new component: Context Librarian → Implementer → Design System Guardian → Accessibility Guardian → QA Verifier → Docs Guardian). Use `.ai/routing.md` to map a task type to its typical role sequence.
