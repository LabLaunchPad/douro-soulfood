---
okf_version: "0.2"
id: "task/{stable-id}"
type: "task"
title: "{task title}"
status: "draft"
created: "{ISO date or unknown}"
updated: "{ISO date or unknown}"
freshness: "current"
lifecycle: "experimental"
trust: "draft"
provenance:
  source: "{repo|human|ai|mixed}"
  references: []
attestation:
  method: "{manual|script|ci|agent}"
  checks: []
summary: "{1-3 sentence summary}"
load_when: "{when an agent should read this}"
token_budget: 600
related: []
---

# {Task Title}

## Task ID
`{stable-id}`

## Outcome
{What "done" looks like — a single, verifiable statement, not a vague goal.}

## Type
{docs-only | astro-code | react-island | prebuilt-adaptation | visual-preview | mixed}

## Priority
{P0|P1|P2}

## Required context
{Which `.ai/packs/*.okf.md` and `docs/*.md` files must be read before starting — use `.ai/routing.md` to determine this.}

## Constraints
{Hard rules this task must not violate — reference `.ai/decisions/*.okf.md` where relevant.}

## Acceptance criteria
- Given {context}, when {action}, then {result}.

## Evidence required
{Exact commands to run and what their output must show — e.g. "`pnpm build` exits 0", "`npx playwright test --list` shows N tests", "screenshot/description of `/dev/ui` state checked".}

## Benchmark impact
{Does this task affect anything tracked in `benchmarks/`? If yes, which benchmark ID(s) and expected direction of change.}

## Stop/ask conditions
{Task-specific stop conditions, in addition to `AGENTS.md`'s standing ones.}
