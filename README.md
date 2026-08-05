# D'ouro Soulfood Bistro — Website

> Astro 6 + Keystatic CMS + Cloudflare Pages/Workers
> Apple iOS-inspired design system with Brazilian soul warmth

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server (Cloudflare Workers runtime via wrangler — production-like)
pnpm dev

# Open browser
# Site:       http://localhost:8788
# Keystatic:  http://localhost:8788/keystatic
```

`pnpm dev` runs `wrangler pages dev --port 8788`, which emulates the Cloudflare
Workers runtime the site actually deploys to. For a plain Astro dev server
without Workers emulation, use `pnpm dev:astro` instead (port 4321).

## Stack

| Layer | Tech |
|-------|------|
| Framework | Astro 6 (Node ≥20, server output on Cloudflare Workers) |
| CMS | Keystatic (Git-backed, admin UI at `/keystatic`) |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`) |
| Hosting | Cloudflare Pages / Workers (`@astrojs/cloudflare` adapter) |
| Testing | Playwright + `@axe-core/playwright`, Lighthouse CI |

`react`, `react-dom`, and `framer-motion` are installed dependencies but are
not currently used by any component — all interactivity (nav scroll state,
mobile drawer, marquee) is plain `<script>` in `.astro` files. If you add a
React island, remember to hydrate it with `client:visible` or `client:idle`
rather than `client:load`.

## Project Structure

```
docs/           → Design/architecture reference docs (see note below — partly stale)
src/
  components/     → Most components live flat here (NavBar, Footer, HeroSection,
                    MenuGrid, MenuBistroCard, badges, etc.)
    menu/         → Menu-page-specific building blocks (CategoryBanner, CategoryShowcase)
    ui/           → A few shared atoms (Button)
    layout/       → MobileBottomBar (sticky mobile call/order bar)
    sections/     → FeatureCard
  content/
    menu-items/   → Keystatic-managed menu items (JSON, price in EUR cents)
    faq/          → Keystatic-managed FAQ entries (JSON)
    pages/        → Home page content (JSON)
    settings/     → Site-wide settings: phone, address, hours, social links
  layouts/        → Base.astro (root layout: <head>, fonts, global CSS)
  pages/          → Routes: index, menu, about, catering, contact
  styles/         → Design tokens (tokens.css) & global CSS
public/           → Static assets (logo, hero video, menu/gallery photos)
```

## Content Management

Content is managed via [Keystatic](https://keystatic.com/), a Git-backed CMS.
Run `pnpm dev`, open `/keystatic`, and edit menu items or FAQ entries there —
changes are written straight to JSON files under `src/content/` and committed
like any other file. There is no separate database or hosted CMS backend.

The Keystatic schema (`keystatic.config.ts`) and the Astro content-collection
schema (`src/content.config.ts`) are two independent definitions of the same
shape and must be kept in sync manually — see `CLAUDE.md` for the specifics
(e.g. menu item price is stored as integer EUR cents).

## Testing

```bash
pnpm build          # build first — Playwright targets the built site
pnpm test:e2e        # runs wrangler pages dev + Playwright together
pnpm test:e2e:ui      # Playwright UI mode
pnpm lhci            # Lighthouse CI against the built site
```

`pnpm test:e2e` expects `wrangler pages dev --port 8788` to be serving a
production build — it does not build automatically.

## Deploy

Auto-deploys via Cloudflare Pages/Workers on push to `main` (see
`.github/workflows/deploy.yml`).

```bash
pnpm build    # astro build
```

## Design Reference

Structural clone of [talkintacos.net](https://talkintacos.net/) with a
unique D'ouro visual identity — see `docs/design-system.md` and
`src/styles/tokens.css` for the token palette.

**Note on `docs/`:** `docs/prd.md`, `docs/architecture.md`, `docs/agent.md`,
and `docs/components.md` describe an earlier, partly aspirational version of
this project (TinaCMS instead of Keystatic, a strict `ui/`/`sections/`/`layout/`
component split, a fully static build). They're still useful for design intent,
but for anything about the current stack, routing, or component locations,
trust the code and `CLAUDE.md` over those docs.

## License

Private — D'ouro Soulfood Bistro
