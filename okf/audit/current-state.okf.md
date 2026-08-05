---
okf_version: "0.2"
id: "audit/current-state"
type: "audit"
title: "Repo Truth Audit — D'ouro Soulfood Bistro"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references:
    - "package.json"
    - "astro.config.mjs"
    - "keystatic.config.ts"
    - "src/content.config.ts"
    - "CLAUDE.md"
    - "docs/audit/current-state.md"
attestation:
  method: "agent"
  checks:
    - "read package.json dependencies"
    - "read astro.config.mjs integrations"
    - "read keystatic.config.ts schema"
    - "grepped src/ for React/img usage"
summary: "Verified current-state audit of the repo's stack, docs, tests, CI, and known constraints, per the Agent-Native Repo OS setup's Phase 0."
load_when: "Any agent starting a new session in this repo, before trusting any other doc's claims."
token_budget: 900
related:
  - "docs/audit/current-state.md"
  - "docs/architecture.md"
  - "docs/prd.md"
---

# Repo Truth Audit

> This OKF file is the canonical audit artifact per the Agent-Native Repo OS setup. It supersedes-by-reference (not by duplication) the earlier `docs/audit/current-state.md`, which remains in place as the human-readable original — both describe the same verified state.

## 1. Repo purpose
Restaurant marketing website for D'ouro Soulfood Bistro (Salzburg, Austria) — Brazilian/Latin/African fusion. Goal: drive online orders (via Lieferando hand-off), showcase the menu, build local brand presence. No e-commerce, no accounts, no contact form (verified: zero `<form>` elements anywhere in `src/`).

## 2. Stack detected
- Astro 6.4.8, `output: 'server'`, `@astrojs/cloudflare` adapter, `imageService: 'compile'`.
- Keystatic 5.2.0/0.5.50, `storage.kind: 'local'` — Git-backed CMS.
- Tailwind CSS v4 (`@tailwindcss/vite`), design tokens in `src/styles/tokens.css`.
- Cloudflare Pages/Workers hosting.
- Testing: Playwright + `@axe-core/playwright`. No unit-test runner.
- `packageManager: pnpm@9.15.9`, `engines.node: >=22.12.0`.
- **No React** in `package.json` — confirmed absent from both `dependencies` and `devDependencies`; `astro.config.mjs`'s `integrations` array has no `react()`.

## 3. Existing docs detected
`docs/prd.md`, `docs/architecture.md`, `docs/design-system.md`, `docs/components.md`, `docs/agent.md`, `docs/personas.md`, `docs/user-flows.md`, `docs/test-plan.md`, `docs/security.md`, `docs/release.md`, `docs/analytics.md`, `docs/performance-budget.md`, `docs/prebuilt-components.md`, `docs/adr/react-islands.md`, `docs/audit/current-state.md`, `docs/audit/image-audit.md`. All present and current as of this audit.

## 4. Existing tests detected
`tests/home.spec.ts`, `tests/menu.spec.ts` — Playwright, 76 tests total across desktop/mobile projects. No tests for `/about`, `/catering`, `/contact` (documented gap in `docs/test-plan.md`).

## 5. Existing CI detected
`.github/workflows/deploy.yml` — 5-job pipeline (Build → Deploy Preview → E2E → Lighthouse → Deploy Production). **Known, pre-existing gap**: `Deploy Preview` fails on every PR due to a missing `CLOUDFLARE_API_TOKEN` repo secret (documented in `docs/release.md`) — `Build` job status is the reliable per-PR signal.

## 6. Known constraints detected
- Astro-first, zero client-JS framework by default.
- CSS custom properties from `src/styles/tokens.css` only — no hardcoded hex.
- `class:list` for conditional classes — no `cn()` helper.
- Keystatic schema (`keystatic.config.ts`) and Astro content schema (`src/content.config.ts`) must stay hand-synced.
- React-as-island allowed only under `docs/adr/react-islands.md`'s narrow conditions, requiring explicit approval before any dependency install.

## 7. Missing systems detected (before this setup)
No agent-agnostic entrypoint (`AGENTS.md`), no token-budget system, no OKF-formatted knowledge artifacts, no benchmark/eval structure, no `.ai/` directory. This setup (this commit) creates all of them.

## 8. Risks and unknowns
- **unverified**: whether Lighthouse/Playwright can execute in this specific sandbox environment against a live URL — `wrangler pages dev`'s local runtime is confirmed broken here (workerd module error), and Playwright's own browser binary is confirmed missing; Lighthouse's Chromium dependency is likely to hit the same limitation but hasn't been separately confirmed as of this audit.
- `Base.astro`'s inline JSON-LD script is likely dropped by CSP `script-src 'self'` without a nonce/hash — documented, unfixed (real infrastructure work, not attempted here).
- PR #20 (Impressum/Datenschutz) remains unmerged, blocked on business-owner legal facts — unrelated to this setup.

## 9. Recommendations
- Keep `AGENTS.md` as the single strict entrypoint; route deeper context through `.ai/INDEX.md` rather than duplicating content across multiple tool-specific rule files.
- Prefer `.ai/packs/*.okf.md` as thin pointers to existing `docs/*.md` files rather than duplicating their content — this repo's docs are already accurate and hand-verified; re-deriving them would risk drift between two sources of truth.
- Treat `benchmarks/`'s initial state as "structure created, values pending" — no historical Lighthouse/performance data exists in this repo to seed a real baseline from.
