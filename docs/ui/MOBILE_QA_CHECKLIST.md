# Mobile QA Checklist

Real results from a Puppeteer-driven audit at 390×844 (iPhone-class viewport) across all 7 routes, 2026-08-07 — not a hypothetical checklist.

## Per-route verification

| Route | Overflow/clipping | Touch targets | Typography readable | Layout stable |
|---|---|---|---|---|
| `/` (home) | ✅ none found | ✅ | ✅ | ✅ |
| `/menu` | ✅ none found (densest page, stress test passed) | ✅ | ✅ | ✅ |
| `/about` | ✅ none found | ✅ | ✅ | ✅ |
| `/catering` | ✅ none found | ✅ | ✅ | ✅ |
| `/contact` | ✅ none found | ✅ | ✅ (post opening-hours-alignment fix) | ✅ |
| `/impressum` | ✅ none found | ✅ | ✅ | ✅ |
| `/datenschutz` | ✅ none found | ✅ | ✅ | ✅ |

## Checklist (this standard's §8)

- [x] No clipping
- [x] No overflow
- [x] No tiny action areas (nav/footer icon-buttons fixed to 44×44px this session)
- [x] No crowded headers
- [x] No hidden primary actions (`MobileBottomBar`)
- [x] No awkward wrapping (stress-tested with long German compound words)
- [x] No dense blocks without breathing room

## Two screenshot-tooling artifacts investigated and ruled out (documented so a future audit doesn't re-flag them)

1. **Lazy-loaded images appearing blank** in a `fullPage` screenshot — Puppeteer doesn't scroll-trigger `loading="lazy"` images without an explicit scroll pass. Confirmed by re-capturing with a scroll-through step: images loaded correctly. Not a real defect.
2. **`position: fixed` elements (mobile bottom bar) appearing to duplicate mid-page** in a stitched full-page screenshot — an artifact of how Puppeteer composites tall pages. A real scrolling user never sees this; a `fixed` element is always pinned to the actual viewport. Not a real defect.

Full detail on both: `docs/design-system/GRID_SYSTEM.md`.
