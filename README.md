# D'ouro Soulfood Bistro — Website

> Astro 6 + Keystatic CMS + Cloudflare Pages
> Apple iOS-inspired design system with Brazilian soul warmth

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (Cloudflare Workers runtime, matches prod)
pnpm dev

# Open browser
# Site: http://localhost:8788
# CMS:  http://localhost:8788/keystatic
```

## Stack

| Layer | Tech |
|-------|------|
| Framework | Astro 6 (Node 22.12+) |
| CMS | Keystatic (Git-backed) |
| Styling | Tailwind CSS v4 |
| Hosting | Cloudflare Pages / Workers |
| Design | Apple iOS-inspired motion, warm gold/espresso palette |

## Project Structure

```
docs/           → AI agent docs (prd, design-system, architecture, agent, components)
src/
  components/
    ui/         → Atoms: Button, AllergenBadge, DietaryBadge, CategoryIcon, ReviewBadge, AllergenHeaderLegend
    sections/   → Page composites: HeroSection, FeatureCard, UserReviews, MenuItemCard, MenuBistroCard
    layout/     → NavBar, Footer, MobileBottomBar
  content/      → Keystatic-managed content (menu-items, faq, settings)
  lib/          → Shared logic (menu.ts)
  layouts/      → Base layout
  pages/        → Routes
  styles/       → Design tokens & global CSS
public/         → Static assets
```

## For AI Agents

**Read `CLAUDE.md` first**, then `docs/agent.md`. Together they contain the working rules for this repo.

Key docs for context:
- `docs/prd.md` — What we're building
- `docs/design-system.md` — Visual language (colors, typography, motion)
- `docs/architecture.md` — Technical decisions
- `docs/components.md` — Component API reference

## Deploy

Auto-deploys via Cloudflare Pages on push to `main` (see `.github/workflows/deploy.yml`).

```bash
pnpm build    # astro build -> dist/
```

## Design Reference

Structural reference: talkintacos.net (layout/spacing conventions only), rebuilt with D'ouro's own brand palette, fonts, and content.

## License

Private — D'ouro Soulfood Bistro
