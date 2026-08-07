# Motion System

## Easing curves

```
--ease-spring:    cubic-bezier(0.22, 1, 0.36, 1)   — default for most interactive transitions
--ease-smooth:    cubic-bezier(0.4, 0, 0.2, 1)      — background animations
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)     — page entrance animations
--ease-out-quint: cubic-bezier(0.16, 1, 0.3, 1)     — scroll reveals
```

## Durations

```
--duration-fast:     200ms  — hover, focus states
--duration-normal:   350ms  — standard transitions
--duration-slow:     500ms  — complex animations
--duration-entrance: 700ms  — page-load reveals
```

## Rules

- Motion communicates state change; it is never purely decorative (Design Principle 2: "Motion is meaning").
- All motion respects `prefers-reduced-motion: reduce` — enforced globally in `tokens.css`'s `@layer base` for CSS animations/transitions.
- **Exception requiring its own mechanism**: the hero background video is `<video autoplay loop>`, which the global CSS reduced-motion rule does *not* cover (CSS `prefers-reduced-motion` media queries only gate CSS animations/transitions, not native video autoplay). This is handled by a dedicated JS check in `HeroSection.astro`'s loader script — it skips loading/playing the video entirely when `prefers-reduced-motion: reduce` is set, satisfying WCAG 2.2.2 (Pause, Stop, Hide) for this specific case. Any future autoplaying video/audio/animation must repeat this JS-level check; the global CSS rule alone will not catch it.
- iOS/macOS Safari Low Power Mode unconditionally blocks all `<video autoplay>` regardless of these settings, with no way for a page to detect it (Apple deliberately doesn't expose this to avoid fingerprinting). The only real mitigation: always set a `poster` image and call `.play()` via JS with `.catch()` error handling so autoplay rejection fails silently and the poster stays visible. Implemented in `HeroSection.astro`.
