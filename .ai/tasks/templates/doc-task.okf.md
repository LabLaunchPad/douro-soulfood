---
okf_version: "0.2"
id: "task/{stable-id}"
type: "task"
title: "Doc: {short description}"
status: "draft"
created: "{ISO date or unknown}"
updated: "{ISO date or unknown}"
freshness: "current"
lifecycle: "experimental"
trust: "draft"
provenance: { source: "{repo|human|ai|mixed}", references: [] }
attestation: { method: "{manual|script|ci|agent}", checks: [] }
summary: "{1-3 sentence summary}"
load_when: "{when an agent should read this}"
token_budget: 400
related: []
---

# Doc: {short description}

## Task ID
`{stable-id}`

## Outcome
{Which doc(s) become accurate/complete, and what specifically was wrong or missing before.}

## Type
docs

## Priority
{P0|P1|P2}

## Required context
{The doc being changed, plus whatever real file/code state must be verified against it — never write a doc claim without checking the actual current state first.}

## Constraints
{Preserve existing accurate content; don't pad with generic filler; use the OKF frontmatter template if creating a new knowledge artifact (see `.ai/INDEX.md`).}

## Acceptance criteria
- Given {the doc's stated claim}, when {checked against the actual repo}, then {they match}.

## Evidence required
{The specific grep/read/build command that verifies each factual claim added or changed.}

## Benchmark impact
none (docs-only)

## Stop/ask conditions
{Usually none for pure docs work — flag if the doc change reveals a real code bug that needs separate handling.}
