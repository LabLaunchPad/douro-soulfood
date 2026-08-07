# Responsive Guidelines

## Mobile-first verification target

Mobile (390×844, iPhone-class viewport) is the primary check for every screen before expanding upward — matches this project's actual traffic profile for a local restaurant site (majority mobile).

## Verified mobile quality bar (2026-08-07 audit, real device-width Puppeteer screenshots)

- ✅ Clear tap targets (32-48px, see `ACCESSIBILITY.md`)
- ✅ Readable text (11-12px floor enforced, fixed multiple instances this session)
- ✅ No overcrowded rows — category filter chips wrap cleanly via flex-wrap
- ✅ No clipped content found
- ✅ No awkward wrapping found in stress-tested long strings (German compound words like "Datenschutzerklärung," bilingual descriptions)
- ✅ No fixed-width layouts that break — all containers use relative/percentage/max-width patterns
- ✅ Primary actions reachable one-thumb: `MobileBottomBar` pins Call + Order actions to the bottom of every page
- ⚠️ One real defect found and fixed: opening-hours list alignment (see `GRID_SYSTEM.md`)

## Desktop-specific notes

- Nav collapses to a dark capsule pill at `md:` (768px) — below that, hamburger + drawer.
- Menu category filter chips: single-row flex-wrap on mobile, unconstrained row on desktop.
- Gallery grid: `grid-cols-2` mobile → `lg:grid-cols-3` desktop.

## Stress-test notes (per this design system's required loop)

- **Long labels**: German compound words (e.g. "Speisekarte," "Datenschutzerklärung," "Firmenveranstaltungen") tested — no overflow, wrapping is clean where it occurs.
- **Short labels**: single-word category names render fine in the same chip component as multi-word ones.
- **Empty states**: this is a static-content site with no user-generated/async data — there is no "empty search results" or "empty cart" state to test. The one conditional-render case (`MenuItemCard`'s `available = false`) shows an explicit "Nicht verfügbar" banner rather than hiding the item, which is the correct choice (informative, not silent).
- **Dense content**: the menu page (`/menu`) is the densest screen on the site (7 categories, dozens of items) — verified renders cleanly at both viewports, no layout breakage.
- **Extreme widths**: not separately tested this pass beyond the two standard viewports (390px, 1440px); recommend adding a narrow (320px, oldest-supported-iPhone class) and wide (1920px+) pass in a future audit round.
