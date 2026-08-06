# evals/

Evaluation artifacts for this repo — both automated tool output and AI-agent behavioral checks.

- **`lighthouse/`** — Lighthouse JSON/HTML reports. Seeded empty; populated by `benchmarks/`-related runs (see `benchmarks/README.md`).
- **`accessibility/`** — axe-core output beyond what CI already captures inline, if a deeper accessibility audit is run.
- **`playwright/`** — Playwright HTML reports / traces from ad-hoc runs (CI's own artifacts live in GitHub Actions, not here).
- **`bundle/`** — JS/CSS bundle size analysis output, if/when a bundle analyzer is run.
- **`image/`** — Image-specific audit output (payload size, format, lazy-loading coverage).
- **`seo/`** — SEO crawl/structured-data validation output.
- **`ai/`** — AI-agent behavior evals: `repo-quiz.json` (does an agent understand this repo?) and `adversarial-checks.md` (does an agent refuse to violate stated rules when pressured to?).

Code evals = does the code meet the code-quality rubric (`.ai/evals/rubrics/code-quality.md`). Visual evals = does the UI meet the visual-quality rubric. Accessibility evals = axe-core + the accessibility-quality rubric. Performance evals = Lighthouse against `docs/performance-budget.md`'s thresholds. AI behavior evals = the repo quiz + adversarial checks below.

Most subdirectories are seeded empty in this setup — real data populates them when the corresponding tool actually runs (see `benchmarks/README.md` for why no historical data exists yet).
