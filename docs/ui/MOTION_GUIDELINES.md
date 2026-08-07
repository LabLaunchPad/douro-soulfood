# Motion Guidelines

## Tokens

```
--ease-spring:    cubic-bezier(0.22, 1, 0.36, 1)   — default for interactive transitions
--ease-smooth:    cubic-bezier(0.4, 0, 0.2, 1)      — background animations
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)     — page entrance animations
--ease-out-quint: cubic-bezier(0.16, 1, 0.3, 1)     — scroll reveals

--duration-fast:     200ms  — hover, focus states
--duration-normal:   350ms  — standard transitions
--duration-slow:     500ms  — complex animations
--duration-entrance: 700ms  — page-load reveals
```

## Rules verified against this standard's §4.5/§9

- **Motion is subtle and purposeful, not decorative**: every animation this session's audit found communicates a state change (hover feedback, drawer open/close, scroll-triggered reveals) — none found to be ornamental-only.
- **`prefers-reduced-motion` respected globally** for CSS transitions/animations (`tokens.css`'s `@layer base`).
- **One exception requiring its own mechanism, documented so it isn't missed again**: the hero background `<video autoplay loop>` is not covered by the global CSS reduced-motion rule (CSS media queries don't gate native video autoplay). Handled by a dedicated JS check in `HeroSection.astro`'s loader script that skips loading/playing the video entirely under `prefers-reduced-motion: reduce` — satisfies WCAG 2.2.2 (Pause, Stop, Hide) for this specific case. Any future autoplaying video/audio must repeat this JS-level check.
- **iOS/macOS Low Power Mode**: unconditionally blocks all `<video autoplay>`, undetectable by design (Apple deliberately doesn't expose it). Mitigated with a `poster` image + `.play().catch()` so autoplay rejection fails silently.

## Elevation as a motion-adjacent signal

Shadow tokens (`--shadow-xs`–`-xl`) increase on hover for interactive cards (`MenuItemCard`, `FeatureCard`) — elevation change paired with a `--duration-fast` transition communicates "this is interactive," not decoration. Consistent across every card-style component, verified via the component registry.
