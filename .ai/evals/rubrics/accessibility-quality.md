# Rubric: Accessibility Quality

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Semantic HTML | Div-soup for interactive/structural elements | Mostly semantic, some divs where a real element exists | Correct element for the job (`button`, `nav`, `address`, `details`, etc.) throughout |
| ARIA correctness | Missing/incorrect ARIA on custom widgets | Present but incomplete (e.g. `aria-expanded` without matching `aria-hidden`) | Full, correct ARIA state matching actual behavior |
| Focus management | Modal/overlay doesn't trap or restore focus | Partial (traps but doesn't restore, or vice versa) | Full focus trap + restore, matching `MobileNavDrawer.astro`'s pattern |
| Keyboard operability | Mouse-only interaction | Keyboard works but awkwardly (no Escape, no logical tab order) | Fully keyboard-operable, including Escape where applicable |
| axe-core pass | New violations introduced | No new violations but pre-existing ones untouched when in scope | Zero violations, verified via actual `@axe-core/playwright` run or explicit `not_run` with reason |
| Reduced motion | Not respected | Partially respected | Fully respected per `prefers-reduced-motion` |
