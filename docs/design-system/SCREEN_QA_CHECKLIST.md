# Screen QA Checklist

Every screen (page) in this repo should pass this review before being considered done. Applied for real to all 7 routes on 2026-08-07 — see `UI_AUDIT_TEMPLATE.md` for how to log the next pass.

## Information Architecture
- Logical hierarchy: hero → key content → social proof → conversion → footer, consistent pattern across pages
- Clear navigation: persistent `NavBar`, consistent link set across all 7 pages
- Discoverability: category quick-nav on both home and menu pages
- Predictable structure: every page follows the same `NavBar` → content → `Footer` shell

## Visual Hierarchy
- Typography: scale exists but unenforced (see `TYPOGRAPHY.md`) — verify new work uses it even if old work doesn't yet
- Spacing: 4px grid, documented half-step exceptions (see `SPACING_SYSTEM.md`)
- Contrast: verified AA-compliant after 2026-08-07 fixes (see `ACCESSIBILITY.md`)
- Emphasis/grouping: one focal point per section, verified visually across all 7 routes

## Alignment
- Baseline/grid/rhythm: verified via real screenshots; one real defect found and fixed (Contact page opening-hours column alignment)

## Components
- Reused: yes — `Button`, `MenuItemCard`/`MenuBistroCard`, badge components all shared across pages, not duplicated per-page
- Consistent: card corner-radius, shadow, and padding patterns hold across `FeatureCard`, `MenuItemCard`, testimonial cards
- Token-driven: strong for color/radius, weak for typography (see `TYPOGRAPHY.md`)

## Interaction
- Feedback: hover/active states present and consistent via `Button`'s shared variant system
- Animation: respects `prefers-reduced-motion`, plus a dedicated JS check for the one case (hero video) the global CSS rule doesn't cover
- Touch/gestures: verified touch targets, verified no scroll-jacking

## Accessibility
See `ACCESSIBILITY.md` for the full, current, verified status per WCAG 2.2 success criterion.

## Responsive
Desktop (1440px) and mobile (390px) verified via real screenshots for all 7 routes, 2026-08-07. Tablet (768-1024px) and extreme widths (<375px, >1920px) not separately verified this pass — flagged as a gap in `RESPONSIVE_GUIDELINES.md`.

## Performance
Governed separately by `docs/performance-budget.md` (Lighthouse CI thresholds: performance ≥0.90, accessibility ≥0.92, SEO ≥0.92, all error-level in CI). Image optimization via Astro's `<Image>` component; layout stability and rendering are gated by that existing budget, not duplicated here.
