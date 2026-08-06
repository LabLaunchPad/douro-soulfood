# CLAUDE.md

Read `AGENTS.md` first, then `.ai/INDEX.md`.

`AGENTS.md` is the universal, agent-agnostic entrypoint for this repository (identity, prime directives, non-negotiable constraints, task loop, stop conditions). `.ai/INDEX.md` maps every deeper doc, its token budget, and when to load it — load only what your specific task needs from there.

Also load, as needed: `.ai/status.md` (or `node .ai/scripts/agent-status.mjs` for live data) for current repo state, `.ai/agents/README.md` for the agent role matrix, `.ai/commands/README.md` for the command registry, `.ai/hooks/README.md` for expected behavior at each stage.

The prior, full "Outcome-Driven AI SDLC Operator" policy that used to live in this file (component architecture policy, prebuilt-component protocol, visual outcome protocol, autonomous outcome backlog, execution loop, JSON report format) has been relocated to `.ai/packs/outcome-operator.okf.md` — nothing was deleted, only moved so this file can stay a short pointer per the Agent-Native Repo OS convention. See `.ai/decisions/agent-entrypoint-reconciliation.okf.md` for why.
