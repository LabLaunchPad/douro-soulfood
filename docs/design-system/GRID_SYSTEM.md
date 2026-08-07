# Grid & Layout System

## Approach

No explicit N-column grid framework — layout is composed from Tailwind flex/grid utilities per-component (e.g. `grid grid-cols-2 lg:grid-cols-3` for the photo gallery, `grid grid-cols-6` for the mobile category-icon row). This is appropriate for a marketing/menu site of this size; introducing a formal 12-column system would add abstraction without a matching need — reserve that for if/when the site grows a data-dense app-like surface (per Design Principle: Simplicity Over Complexity).

## Breakpoints (Tailwind v4 defaults, explicitly declared in `tokens.css` for documentation)

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

## Containers

- Content max-width: `max-w-7xl` (1280px), aliased `--container-content`
- Horizontal page padding: `px-4 md:px-16` (16px mobile → 64px desktop) — consistent across all 7 pages
- Prose measure containers: `max-w-[52ch]`/`[48ch]`/`[45ch]` (tuned per DM Sans's actual rendered character width — see `TYPOGRAPHY.md`)

## Verified responsive behavior (2026-08-07 visual audit)

Real Puppeteer screenshots at 1440×900 (desktop) and 390×844 (mobile) across all 7 routes. Findings:
- Touch targets: hamburger/close buttons 32×32px, footer social icons 32×32px (24px icon + 6px padding) — both clear WCAG 2.2 SC 2.5.8's 24×24px CSS-pixel floor.
- No horizontal overflow, no clipped content found on any route at either viewport.
- One real alignment defect found and fixed: `contact.astro`'s opening-hours list used `flex gap-4` between a variable-width day name and its time, so times didn't align into a scannable column (e.g. "Montag" vs "Donnerstag" push the time by different amounts). Fixed with `min-w-[6.5rem]` on the day-name cell.
- Two apparent defects in raw screenshots were investigated and ruled out as **screenshot-tooling artifacts, not real bugs**: (1) `loading="lazy"` images appearing blank in a `fullPage` screenshot because Puppeteer doesn't scroll-trigger them without an explicit scroll pass — confirmed by re-capturing with a scroll-through step, images loaded correctly; (2) `position: fixed` elements (the mobile bottom bar) appearing to duplicate/overlap mid-page in a stitched full-page screenshot — an artifact of how Puppeteer composites tall pages, not something a real scrolling user ever sees (a `fixed` element is always pinned to the actual viewport, never frozen at a page-relative Y coordinate). Both are documented here so a future audit doesn't re-discover and mis-diagnose the same artifacts as real defects.
