---
okf_version: "0.2"
id: "pack/testing"
type: "knowledge"
title: "Testing"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "repo"
  references: ["docs/test-plan.md", "tests/home.spec.ts", "tests/menu.spec.ts"]
attestation:
  method: "agent"
  checks: ["npx playwright test --list confirmed 76 tests collect correctly this session"]
summary: "Playwright + axe-core, 76 tests across home.spec.ts/menu.spec.ts, desktop+mobile projects. Zero tests for /about, /catering, /contact. No unit-test runner exists."
load_when: "Writing or updating tests."
token_budget: 350
related: ["docs/test-plan.md"]
---

# Testing

`tests/home.spec.ts` + `tests/menu.spec.ts`, Playwright + `@axe-core/playwright`, desktop (1440×900) and mobile (375×812) projects, Chromium only. Selectors use `aria-label`/`id`/semantic HTML — never `data-testid`.

`playwright.config.ts` has no `webServer` auto-start — a server must already be running on `:8788` before tests run.

**Known gap**: zero tests exist for `/about`, `/catering`, `/contact`. No unit-test runner exists anywhere (no Vitest/Jest) — `src/lib/menu.ts`'s logic is only exercised indirectly through `menu.astro`'s rendered output.

**Environment note**: `wrangler pages dev`'s local runtime and Playwright's browser binary both fail to start in some sandboxed agent environments (confirmed this session) — this is a pre-existing environment limitation, not a code issue. `npx playwright test --list` (no browser needed) is the available verification when a full run isn't possible.

**Full detail**: `docs/test-plan.md`.
