---
okf_version: "0.2"
id: "decision/agent-entrypoint-reconciliation"
type: "decision"
title: "CLAUDE.md becomes a pointer; the full Outcome-Driven Operator policy relocates to .ai/packs/"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "reviewed"
provenance:
  source: "mixed"
  references:
    - "AGENTS.md"
    - ".ai/packs/outcome-operator.okf.md"
attestation:
  method: "manual"
  checks:
    - "verified no content was deleted, only relocated"
    - "verified AGENTS.md covers the same non-negotiable constraints in short form"
summary: "Documents a real contradiction between two explicit user instructions and how it was resolved: CLAUDE.md was previously replaced (twice, by explicit request) with a large Outcome-Driven SDLC Operator prompt, but the Agent-Native Repo OS setup requires CLAUDE.md to be a short pointer to AGENTS.md. Resolved by relocating, not deleting, the operator content."
load_when: "An agent wonders why CLAUDE.md looks different from what a prior session set it to, or is deciding where to find the full outcome-loop policy."
token_budget: 400
related:
  - "AGENTS.md"
  - "CLAUDE.md"
  - ".ai/packs/outcome-operator.okf.md"
---

# Decision: reconciling CLAUDE.md's two roles

## The contradiction
Across two prior rounds in this same session, `CLAUDE.md` was explicitly, deliberately replaced with a large "Outcome-Driven AI SDLC Operator" system prompt (component architecture policy, prebuilt-component protocol, visual outcome protocol, full autonomous backlog, execution loop, JSON report format) — both times per direct, explicit user instruction to use that exact pasted content verbatim.

The Agent-Native Repo OS setup prompt (this round) explicitly requires: *"CLAUDE.md: must say: 'Read AGENTS.md first, then .ai/INDEX.md.'"* — i.e. CLAUDE.md should become a minimal pointer, not a policy document itself.

These two requirements cannot both be satisfied by the same file at the same time.

## Resolution
- The full Outcome-Driven Operator content was **relocated, not deleted**, to `.ai/packs/outcome-operator.okf.md` — an OKF-formatted knowledge pack, loadable on demand per `.ai/routing.md`.
- `CLAUDE.md` now contains the short pointer the setup prompt requires: "Read AGENTS.md first, then .ai/INDEX.md," plus a one-line note that the full outcome-loop policy lives in `.ai/packs/outcome-operator.okf.md` (so nothing is silently lost — an agent that needs the detailed policy can still find it in one hop).
- `AGENTS.md` independently covers the same non-negotiable constraints (Astro-first, tokens, `class:list`, Keystatic sync, `<Image>` usage) in short form, so routine tasks don't need to load the full operator pack at all — only outcome-loop-specific work does.

## Why relocate instead of just picking one instruction to ignore
Both instructions came from the same user in the same session. Discarding the operator content would silently violate the two prior, explicit "save this exact content as CLAUDE.md" requests. Discarding the new pointer requirement would violate this round's explicit, detailed spec. Relocating satisfies both: the pointer requirement is met literally, and the operator content remains fully intact and reachable — this is what the setup prompt's own "reconcile contradictions and document the final decision" hard rule calls for.
