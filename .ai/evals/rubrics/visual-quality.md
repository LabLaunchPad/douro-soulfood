# Rubric: Visual Quality

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Token compliance | Colors/spacing not from `src/styles/tokens.css` | Mostly tokens, one or two hardcoded values | 100% token-derived |
| State coverage | Only default state shown | Some states shown, missing hover/focus/disabled/empty as applicable | All applicable states (per component's real behavior — don't force irrelevant states) shown in `/dev/ui` |
| Mobile-first | Desktop-only layout, mobile not checked | Mobile checked but layout breaks | Verified correct at both mobile and desktop widths |
| Focus visibility | No visible focus-visible outline | Outline present but low-contrast/hard to see | Clear, on-brand focus-visible outline on every interactive element |
| Reduced motion | Animations run regardless of `prefers-reduced-motion` | Some animations respect it | All animations/transitions stop under `prefers-reduced-motion: reduce` |
| Real prop shapes in preview | Placeholder/lorem-ipsum props in `/dev/ui` | Partially realistic props | Real prop shapes matching actual usage elsewhere in the app |
