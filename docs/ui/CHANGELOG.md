# Changelog — docs/ui/

## 2026-08-07 — Initial creation

- Created `docs/ui/` per the Ship-Ready Enterprise UI Standard (v1.1.0), by explicit user choice to keep it as a separate tree alongside `docs/design-system/` rather than merging the two.
- All 17 files populated with real project data (grep counts, measured pixel sizes, real token names) — not the standard's placeholder scaffolding.
- New finding from applying this standard specifically (not previously caught by `docs/design-system/`'s audit): three interactive elements met WCAG 2.2's 24×24px minimum target size but fell short of this standard's stricter 44×44px preferred target. Two were real, live production gaps and were fixed:
  - `NavBar`'s hamburger toggle and `MobileNavDrawer`'s close button: `w-8 h-8` (32px) → `w-11 h-11` (44px)
  - Footer's two social-icon links: `p-1.5` (6px padding, 32px total) → `p-3` (10px padding, 44px total)
  - `Button`'s `sm` variant (36px) was left as-is — confirmed via grep it's only used in the `src/pages/dev/ui.astro` component showcase, not shipped in any production UI.
- Verified via before/after screenshots — no visual regression from the target-size fix.
- Two honest, non-blocking gaps documented (not silently dropped): the menu category quick-nav has no "currently viewing" indicator, and `MapEmbed` has no branded iframe-failure state.
