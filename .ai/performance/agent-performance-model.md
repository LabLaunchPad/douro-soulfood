# Agent Performance Model

What "high-performance AI agent behavior" means in this repository. Used by `.ai/dashboards/agent-scorecard.okf.md` and `.ai/metrics/agent-efficiency.md` to define what's actually being measured.

## 1. Speed
- Minimal context loading: route via `.ai/routing.md`, never load every pack "to be safe."
- Minimal file reads: don't re-read a file already read this session unless it may have changed.
- Concise output: state what changed and what was verified, not a narrated replay of every step (`.ai/context-budget.md`'s output-brevity rules).
- Small, correct diffs: the smallest change that achieves the stated outcome, per `AGENTS.md`'s prime directives.

## 2. Accuracy
- Every factual claim grounded in an actual file read/grep this session, not inferred from a similar-looking repo (`.ai/truth-gates.md`, Gate 1).
- No invented repo facts, metrics, or file references.
- Correct file targeting — the change lands in the file that actually needs it, not a plausible-looking nearby one.
- Correct command usage — `pnpm build`, not a guessed equivalent.

## 3. Safety
- No destructive actions without explicit approval (`AGENTS.md`'s stop/ask conditions).
- No dependency sprawl — especially no React installation without per-component approval (`.ai/decisions/no-global-react.okf.md`).
- No Keystatic/Astro schema drift — both files updated together (`.ai/decisions/keystatic-sync.okf.md`).
- No design-token violations — zero hardcoded hex outside the one documented exception.

## 4. Outcome quality
- Tests pass, or a failure is honestly reported with root cause, never silently skipped.
- Docs updated in the same change as the code they describe.
- Benchmarks preserved or improved — a regression like the real `/menu` LCP finding (`benchmarks/reports/PERF-POST-MIGRATION.okf.md`) gets logged, not ignored.
- Acceptance criteria (from the task's own spec) actually met, checked explicitly before calling a task done.

## 5. Efficiency
- Low token usage relative to task complexity — a docs-only task shouldn't load the full architecture pack.
- High first-pass success — the change works without a human needing to point out an obvious miss.
- Low rework — verify before claiming done, not after a human catches the gap.
- Low unnecessary human intervention — ask only when a real stop condition applies, not by default.

## 6. Experience
- Reuses prior decisions (`.ai/decisions/*.okf.md`) instead of re-litigating settled questions.
- Follows established patterns (`.ai/patterns/*.okf.md`) instead of reinventing a shape this repo already has a convention for.
- Avoids known anti-patterns (`.ai/memory/anti-patterns.md`) — doesn't repeat a mistake already made and documented.
- Records new learnings when something genuinely new is discovered, with evidence, not vaguely.

## How this model is used
`.ai/metrics/agent-efficiency.md` defines measurable proxies for these six dimensions. `.ai/dashboards/agent-scorecard.okf.md` tracks their status (mostly `pending` until real task data accumulates — no values are invented). `.ai/evals/rubrics/*.md` score individual changes against related criteria.
