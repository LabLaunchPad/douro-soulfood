# RULES — operating rules for the visual team

1. Rendered output beats source. A claim without a screenshot/geometry artifact is a guess.
2. Fix at the lowest correct layer: component → section → viewport → page → system.
3. One finding = one row: ID/route/viewport/severity/confidence/category/element/observed/expected/measurement/design-rule/source-location/proposed-fix.
4. Severity: high = overflow, serious axe, broken render. Medium = rhythm/alignment/aspect/alt drift beyond tolerance.
5. Tolerances: gaps ±12px, edges ±4px, aspect ±0.05, pixel diff tolerance 16/channel.
6. Never treat every changed pixel as a defect: separate intentional change, AA noise, dynamic content, real regression (see diff `box` + `changedPct`).
7. Baselines need `BASELINE_UPDATED_REASON`. Never silently overwrite.
8. VISION_DEGRADED is honest: geometry + axe only. Never claim vision analysis without a model.
9. Stop gates: FUNCTIONAL, VISUAL, RESPONSIVE, ACCESSIBILITY, DESIGN_SYSTEM, REGRESSION — all PASS or externally blocked.
10. Memory: findings, measurements, decisions, files, verifications, baselines, open issues. No chain-of-thought.
