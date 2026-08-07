# Component Registry

Real inventory (verified against `src/components/`, 2026-08-07). Full per-component contracts with anatomy/props/token-mapping detail: `docs/design-system/COMPONENT_REGISTRY.md` — this file adds the state-completeness column this standard specifically requires (section 6/9), which the other registry didn't check for.

| Component | Category | States present | States N/A (with reason) |
|---|---|---|---|
| `Button` | atom | default, hover, active, focus-visible (3 variants × all states) | disabled (no disabled CTA anywhere), loading (no async action it triggers) |
| `MenuItemCard` | section | default, hover (image scale + title color), focus (via clickable-card link) | selected (no multi-select context), loading/error (static data) — has a real "unavailable" state (explicit banner, not hidden) |
| `NavBar` | layout | default, scroll-triggered capsule transition, focus-visible, `aria-expanded` (mobile toggle) | disabled, loading — n/a |
| `MobileNavDrawer` | layout | open/closed (via `inert`/`aria-hidden`), focus-trapped while open, focus-visible on all links | n/a |
| `FaqAccordion` | section | closed/open (native `<details>`), hover, focus-visible | n/a — native element handles state semantics |
| `AllergenBadge` / `DietaryBadge` | atom | default only (static informational chips) | hover/active/focus (not interactive — correct, they're not buttons/links) |
| `ReviewBadge` | atom | default only (static display) | interactive states — correct, purely informational |
| `MapEmbed` | atom | collapsed (placeholder + button) → expanded (live iframe) — a real, meaningful two-state component | loading (iframe load is instant enough not to need one), error (Google Maps iframe failure has no custom handling — a real, minor gap, low priority since Google's own iframe shows its own error UI) |

## One real, honestly-flagged gap

`MapEmbed`'s iframe-load-failure case has no custom error UI — if Google Maps' iframe itself fails to load, the visitor sees whatever Google's iframe renders (typically its own generic error), not a branded fallback. Low priority (rare failure mode, external service's own UI still communicates *something*), but the honest answer to "does every component handle its error state" for this one component is "not with a branded treatment." Documented here rather than silently passed.

## Selected-state gap

Also flagged in `COMPONENT_STANDARDS.md`: the menu category quick-nav doesn't visually indicate the currently-scrolled-to category. A real, minor UX polish opportunity, not urgent.
