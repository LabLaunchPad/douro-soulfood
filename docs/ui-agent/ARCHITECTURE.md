# ARCHITECTURE — repo-native visual UI engineering team (douro-soulfood)

## Reality it was generated from (auto-detected, see `.ui-agent/config.json`)

Astro 7 (static, Cloudflare adapter) + Tailwind v4 + Keystatic. pnpm. Playwright +
axe-playwright installed, Chromium available. Tokens in `src/styles/tokens.css`.
7 HTML routes. No Ollama → **VISION_DEGRADED**: deterministic geometry/a11y QA only.

## Rendered output is the source of visual truth

```
.ui-agent/
  config.json        detected reality (regenerate with bin/detect.mjs)
  rules/             visual-rules.json — repo-specific, from tokens + conventions
  agents/            8 role briefs (orchestrator + 7 specialists, read-only except implementer)
  workflows/         audit-loop.md — the 18-step automatic workflow
  bin/               detect | capture | analyze (node, zero new dependencies)
  visual/            png.mjs — dependency-free PNG codec + diff + downscale
  vision/            adapter.mjs — ollama → openai-compatible → degraded (never hallucinates)
  geometry/          (analysis lives in bin/analyze.mjs; this dir holds rule notes)
  orchestrator/      run.mjs — audit | prove | baseline; ONLY role declaring completion
  evidence/          per-run captures (gitignored — reproducible, not precious)
  baselines/         committed: 720px shots + geometry + baseline.json (reason required)
  reports/ screenshots/ diffs/ state/   working dirs (gitignored except state)
  cli.mjs            audit | capture | inspect | fix | verify | baseline | report
```

## Loop

`BOOT(detect) → AUDIT(build→capture→analyze) → REPORT → [FIND→EDIT→RENDER→COMPARE→VERIFY] → gates`

EDIT authority: UI Implementer only, serialized by the Orchestrator. `prove` diffs
before/after pixels + re-analyzed findings; REGRESSION_PASS requires zero new highs.

## Safety

No invented branding/copy/facts. No new dependencies (node built-ins + repo's own
Playwright/axe). No framework/design-system replacement. Tokens first. a11y and
perf budgets are gates, never tuned to pass. Blocked items reported, never skipped.
