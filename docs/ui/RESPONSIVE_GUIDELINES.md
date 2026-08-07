# Responsive Guidelines

Cross-reference: `docs/design-system/RESPONSIVE_GUIDELINES.md` covers the same verified findings. This file restates the checklist in this standard's exact §8 format.

## Mobile QA questions (this standard's §8), answered with evidence

- **Can the user understand the screen in one glance?** Yes — verified via real screenshots across all 7 routes; one focal point per section (Design Principle: "one hero per section," `docs/design-system/DESIGN_PRINCIPLES.md`).
- **Can the user reach primary actions with minimal effort?** Yes — `MobileBottomBar` pins Call + Order actions to the viewport bottom on every page, reachable one-thumb.
- **Does the UI feel calm, clear, and fast?** Verified via visual audit — no decorative overload found (the one intentional decorative element, the gold glow shadow, is a documented, minimal brand touch, not noise).
- **Are interactions obvious without explanation?** Yes — standard patterns throughout (buttons look like buttons, the map consent-gate has explicit "Karte anzeigen" call-to-action text, not an ambiguous icon-only trigger).
- **Does the experience hold up on small screens and large content loads?** Yes for small screens (390px verified, zero overflow/clipping). Large content load: `/menu` is the densest page (7 categories, dozens of items) and renders cleanly at both viewports.

## Mobile-must-verify checklist (this standard's §8)

| Check | Status |
|---|---|
| Readable typography | ✅ 11-12px floor enforced (fixed multiple instances this session) |
| Stable layout | ✅ no layout shift found in real testing |
| Comfortable touch targets | ✅ all ≥24×24px minimum; nav/footer icon-buttons now also meet the 44×44 preferred (see `ACCESSIBILITY_GUIDELINES.md`) |
| No clipping | ✅ verified |
| No overflow | ✅ verified, zero horizontal scroll on any route |
| No tiny action areas | ✅ (post-fix) |
| No crowded headers | ✅ NavBar collapses to hamburger + logo on mobile |
| No hidden primary actions | ✅ `MobileBottomBar` keeps Call/Order always visible |
| No awkward wrapping | ✅ stress-tested with German compound words |
| No dense blocks without breathing room | ✅ consistent section padding (72px mobile) |

## One real defect found and fixed this session

`contact.astro`'s opening-hours list didn't align into a scannable column (variable-width day names pushed times to different x-positions). Fixed with `min-w-[6.5rem]` on the day-name cell, verified via before/after screenshot.
