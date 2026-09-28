# Audit loop (the coordinator's workflow — automatic, no manual handoffs)

1. Inspect repo (`.ui-agent/bin/detect.mjs` → `config.json`).
2. Build (`pnpm build`).
3. Serve (`scripts/serve-dist.mjs`, spawned by capture, killed after).
4. Discover routes (config) + breakpoints (6 fixed viewports).
5. Capture viewport + fullPage + a11y + geometry per route × viewport.
6. Analyze against `.ui-agent/rules/visual-rules.json` → structured findings.
7. Aggregate + deduplicate (same route/category/element signature).
8. Rank by severity × confidence.
9. Select safe batch (single-file, token-respecting, no copy changes).
10. Implement (UI Implementer only, records finding IDs + reason).
11. Rebuild + recapture affected route × viewport.
12. Diff (`visual/png.mjs`) + re-analyze.
13. Re-run geometry/a11y checks.
14. Repeat until gates pass or externally blocked.

## Finding schema (every finding, no vague comments)

`ID, route, viewport, severity(high/medium), confidence(0-1), category, element,
observed, expected, measurement, design-rule, source-location, proposed-fix`

## Stop gates (ALL must pass)

`FUNCTIONAL_PASS, VISUAL_PASS, RESPONSIVE_PASS, ACCESSIBILITY_PASS, DESIGN_SYSTEM_PASS, REGRESSION_PASS`

Never stop merely because build/typecheck/tests pass.

## Memory

Store only: findings, measurements, decisions, changed files, verification results,
baseline metadata, unresolved issues. No chain-of-thought. See `evidence/`, `state/`.
