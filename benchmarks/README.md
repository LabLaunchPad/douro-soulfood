# benchmarks/

Performance and quality benchmark tracking for this repo.

- **`baseline/`** — historical reference metrics. **Empty as of this setup** — no prior benchmark data exists in this repo to seed a baseline from. The first real Lighthouse/performance run against a live, reachable URL becomes the baseline candidate.
- **`current/`** — latest collected metrics (`metrics.json`, `image-audit.json`, `notes.md` once a real run happens).
- **`deltas/`** — comparisons between `current/` and `baseline/`, once both exist.
- **`reports/`** — OKF-formatted benchmark reports, one per collection run. See `reports/BENCHMARK-TEMPLATE.okf.md`.

## Initial benchmark IDs

Defined here with structure only — **no values are invented**. Each is `pending` until a real tool run produces a number.

| ID | Measures | Status |
|---|---|---|
| `PERF-001` | Lighthouse performance score, all 5 real routes | pending |
| `PERF-IMG-001` | Image payload — bytes, request count, format mix | pending |
| `A11Y-001` | Lighthouse + axe-core accessibility score | pending |
| `SEO-001` | Lighthouse SEO score, structured-data validity | pending |
| `BUILD-001` | `pnpm build` duration and output size | pending |
| `TEST-001` | Playwright E2E pass rate | pending |
| `AI-CTX-001` | Approximate token usage per agent task (see `.ai/scripts/token-report.mjs`) | pending |
| `AI-FPS-001` | First-pass success rate — did an agent's change pass verification without a fix-up round | pending |

## Why nothing is seeded with real numbers yet
`wrangler pages dev`'s local runtime and Lighthouse/Playwright's Chromium dependency are both confirmed to fail to start in at least one sandboxed agent environment used with this repo (documented in `.ai/packs/testing.okf.md`). A real baseline requires either a working local environment or a reachable live preview URL (a Cloudflare Workers preview deploy has worked for direct `curl`-based checks — see `okf/tasks/agent-native-repo-setup.okf.md` for what was and wasn't achievable in this setup's own Phase 10 attempt).
