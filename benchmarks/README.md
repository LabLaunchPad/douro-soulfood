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
| `PERF-001` | Lighthouse performance score, all 5 real routes | **collected, `/menu` partially fixed** — `/menu`'s image payload issue fixed (-80% bytes), but the score still doesn't reliably clear ≥0.90 (0.81-0.94 across runs) due to a newly-found, separate DOM-size factor. See `reports/MENU-IMAGE-FIX.okf.md`. |
| `PERF-IMG-001` | Image payload — bytes, request count, format mix | **collected** — `/menu`'s byte-size breakdown extracted and fixed: 4.18MB → 828KB. See `reports/MENU-IMAGE-FIX.okf.md`. |
| `A11Y-001` | Lighthouse + axe-core accessibility score | **collected** — all 5 routes pass ≥0.92 (0.95–0.96) |
| `SEO-001` | Lighthouse SEO score, structured-data validity | **collected** — all 5 routes score 1.00 |
| `BUILD-001` | `pnpm build` duration and output size | **collected** — ~21s, 36M `dist/` output |
| `TEST-001` | Playwright E2E pass rate | pending — 76 tests collect correctly (`--list`) but full execution not run this session |
| `AI-CTX-001` | Approximate token usage per agent task (see `.ai/scripts/token-report.mjs`) | pending — tooling exists, not yet applied to a real task |
| `AI-FPS-001` | First-pass success rate — did an agent's change pass verification without a fix-up round | pending |

**Method note**: `PERF-001`/`A11Y-001`/`SEO-001`/`BUILD-001` were collected against `astro preview` (local Node server), not the actual Cloudflare Workers runtime — see `reports/PERF-POST-MIGRATION.okf.md`'s "Commands used" section for exactly why (both `wrangler pages dev` and headless Chrome against the live preview URL failed in this sandbox, for two different, specific, diagnosed reasons).

## Why nothing is seeded with real numbers yet
`wrangler pages dev`'s local runtime and Lighthouse/Playwright's Chromium dependency are both confirmed to fail to start in at least one sandboxed agent environment used with this repo (documented in `.ai/packs/testing.okf.md`). A real baseline requires either a working local environment or a reachable live preview URL (a Cloudflare Workers preview deploy has worked for direct `curl`-based checks — see `okf/tasks/agent-native-repo-setup.okf.md` for what was and wasn't achievable in this setup's own Phase 10 attempt).
