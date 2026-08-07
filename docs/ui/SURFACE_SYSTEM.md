# Surface System

New category introduced by this standard (not previously documented as a distinct system in `docs/design-system/`, which covered surfaces as part of the general color-token list). Real inventory, verified against `src/` on 2026-08-07.

## Surface roles in actual use

| Role | Real token / treatment | Where used |
|---|---|---|
| **Canvas** (`surface.canvas`) | `--color-surface-primary` (warm cream, `body` background in `Base.astro`) | Every page's base background |
| **Elevated** (`surface.section`) | `--color-surface-elevated` | Subtle-separation containers (pre-scroll nav state, hover backgrounds) |
| **Card** (`surface.card` / `.cardRaised`) | `--color-surface-card` + `--shadow-sm`–`-lg` for elevation | Menu items, feature cards |
| **Glass** (`surface.overlay`, translucent variant) | `--color-surface-glass` (`oklch(1.0 0.002 80 / 0.9)`) + `backdrop-blur-sm` | Testimonial cards |
| **Inverse / dark capsule** (`surface.inverse`) | `bg-brand-espresso/90-95` + `backdrop-blur-md` | Floating nav capsule (desktop), mobile nav drawer full-screen overlay |
| **Hero scrim** (`surface.overlay`, dark variant) | `bg-gradient-to-b from-black/50 via-black/40 to-black/60` (raw, not yet a named token) | Hero video/image overlay, ensures white hero text stays legible over unpredictable video content |
| **Bistro paper** (a themed sub-system, not a generic role) | `--color-bistro-paper` / `-paper-alt` / `-banner` | Menu page category banners and allergen legend — deliberately distinct visual world, see `COLOR_SYSTEM.md` |
| **Metallic capsule** (a one-off, deliberate exception) | `bg-zinc-300/90` + `backdrop-blur-md` | Footer's main content card — an intentional "silver" surface distinct from the cream canvas, per its own source comment |

## Roles the standard requests that don't apply here

This is a static marketing/menu site, not an app — these roles are honestly N/A, not silently unimplemented:
- `BG_AUTH` — no authentication surface exists
- `BG_DASHBOARD` — no dashboard/admin UI in the customer-facing site (Keystatic's own admin UI at `/keystatic` is a third-party tool with its own design system, out of this document's scope)
- `BG_SIDEBAR` (as a persistent app sidebar) — the closest analog is Datenschutz's sticky table-of-contents nav, which inherits the canvas background with no distinct surface treatment (correct choice — it's a navigation aid within a document, not an app shell region)
- `BG_EMPTY` — no empty-data states exist (no search, no cart, no user-generated content)

## Rules verified

- **Backgrounds support content, don't compete with it**: the hero scrim exists specifically to guarantee text legibility over an unpredictable video background — a content-serving decoration, not ornamental.
- **Every surface has a documented role**: confirmed above; no undocumented one-off background treatment found in a full `grep` pass.
- **Gradients/blur are limited and tokenized where repeated**: the hero scrim gradient is currently the one un-tokenized repeated pattern (raw Tailwind classes, not a named token) — low risk since it's used in exactly one place (`HeroSection.astro`), but if a second hero-style surface is ever added, extract it to `--gradient-hero-scrim` at that point (per this standard's own governance rule: tokenize on the second real use, not speculatively on the first).
- **Contrast preserved**: no light-mode/dark-mode split exists (this brand is deliberately light-only, see `docs/design-system/DESIGN_PRINCIPLES.md`), so no cross-mode contrast risk to verify.
