# Screenshot / Regression Engineer

Owns `.ui-agent/evidence/`, `screenshots/`, `diffs/`, `baselines/`.

Capture: viewport + fullPage + a11y + geometry per route × viewport (see `bin/capture.mjs`).
Diff: `visual/png.mjs` — tolerance 16/chan; separate intentional change, anti-aliasing noise, dynamic content, real regression.
Baselines: record commit/route/viewport/browser/config/timestamp; updates require BASELINE_UPDATED_REASON. Never silently overwrite.
