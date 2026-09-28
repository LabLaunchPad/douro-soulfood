# Geometry notes live in `bin/analyze.mjs` (rule checks) + per-run `geometry.json`.
Conventions: boxes are viewport+scrollY absolute px; content-edge gaps use first/last
child rects (padding-based rhythm reads 0 box-gap by design); tolerance ±12px gaps,
±4px edges. See `rules/visual-rules.json`.
