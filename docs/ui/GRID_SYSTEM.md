# Grid System

## Approach

No formal N-column grid framework — layout is composed from Tailwind flex/grid utilities per-component. Appropriate for this site's scope (7-page marketing/menu site, not a data-dense app); a formal 12-column system would add abstraction without a matching need.

## Breakpoints

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

## Containers and gutters

- Content max-width: `max-w-7xl` (1280px)
- Page gutters: `px-4 md:px-16` (16px mobile → 64px desktop), consistent across all 7 pages — verified via grep, no page deviates from this pattern
- Prose measure: `max-w-[52ch]`/`[48ch]`/`[45ch]` (tuned for DM Sans's actual rendered character width, not the naive character count — see `docs/design-system/TYPOGRAPHY.md`)

## Verified: no horizontal scrolling, no unstable compositions

Confirmed via real Puppeteer screenshots at 390px and 1440px across all 7 routes (2026-08-07) — zero horizontal overflow, zero clipped content, zero broken layouts. One real alignment defect was found and fixed this session (Contact page's opening-hours list not forming a scannable column) — see `docs/design-system/GRID_SYSTEM.md` for detail and the fix.

## Responsive density

Category filter chips (menu page) wrap via `flex-wrap` rather than a fixed grid — density adapts naturally to available width without a breakpoint-specific column-count rule. Gallery grid: explicit `grid-cols-2` mobile → `lg:grid-cols-3` desktop, since photo content benefits from a predictable grid rather than organic wrapping.
