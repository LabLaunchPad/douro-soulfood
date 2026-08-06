---
okf_version: "0.2"
id: "task/{stable-id}"
type: "task"
title: "Fix: {short description}"
status: "draft"
created: "{ISO date or unknown}"
updated: "{ISO date or unknown}"
freshness: "current"
lifecycle: "experimental"
trust: "draft"
provenance: { source: "{repo|human|ai|mixed}", references: [] }
attestation: { method: "{manual|script|ci|agent}", checks: [] }
summary: "{1-3 sentence summary of the bug and its fix}"
load_when: "{when an agent should read this}"
token_budget: 500
related: []
---

# Fix: {short description}

## Task ID
`{stable-id}`

## Outcome
{The specific bug no longer occurs — state the failure scenario precisely, not just "it's fixed".}

## Type
fix

## Priority
{P0|P1|P2}

## Root cause
{What actually caused it — verified, not guessed. If not yet known, mark this "needs-review" and investigate before implementing.}

## Required context
{Files/packs needed.}

## Constraints
{What must NOT change while fixing this — e.g. "preserve existing visual layout", "no new dependencies".}

## Acceptance criteria
- Given {the failing scenario}, when {the fix is applied}, then {the correct behavior occurs}.

## Evidence required
{Before/after comparison — a failing test that now passes, a grep showing the bad pattern is gone, a build that now succeeds.}

## Benchmark impact
{Usually none for a scoped fix — state explicitly if it does affect a tracked benchmark.}

## Stop/ask conditions
{Task-specific, in addition to `AGENTS.md`'s standing ones — e.g. "if the root cause turns out to be architectural, stop and ask before a larger refactor."}
