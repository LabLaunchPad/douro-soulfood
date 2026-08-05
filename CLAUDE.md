# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Restaurant website for D'ouro Soulfood Bistro (Salzburg, Austria). Astro 6 + Tailwind CSS v4 + Cloudflare Pages/Workers, content managed via Keystatic CMS. Structural reference is talkintacos.net with a unique visual identity ("Apple iOS-inspired dark theme with Brazilian gold warmth" — see `docs/design-system.md`).

**`docs/` contains detailed docs (`prd.md`, `design-system.md`, `architecture.md`, `components.md`, `agent.md`) but they describe an earlier/aspirational version of the stack and have drifted from the actual code — see "Docs vs. reality" below before trusting them.**

## Commands

```bash
pnpm dev            # wrangler pages dev --port 8788 — Cloudflare Workers runtime, production-like
pnpm dev:astro      # astro dev — plain Astro dev server (no Workers emulation)
pnpm build          # astro build
pnpm preview        # astro preview
pnpm lint           # eslint src/
pnpm format         # prettier --write .
pnpm test:e2e       # npx playwright test (targets http://localhost:8788 — wrangler dev, NOT astro dev)
pnpm test:e2e:ui    # playwright test --ui
pnpm test:e2e:headed
pnpm lhci           # Lighthouse CI (see .lighthouserc.js)
```

Run a single Playwright test: `npx playwright test tests/menu.spec.ts -g "test name"`.

Playwright does **not** auto-start a server (see `playwright.config.ts`) — start `wrangler pages dev --port 8788` (build first) separately, or use `pnpm test:e2e`. In CI, `BASE_URL`/`PLAYWRIGHT_BASE_URL` point at a Cloudflare Pages preview deployment instead.

Package manager is pnpm (`packageManager: pnpm@9.15.9`), even though the README shows `npm` commands.

## Architecture

- **Rendering:** `astro.config.mjs` sets `output: 'server'` with the `@astrojs/cloudflare` adapter (`platformProxy` enabled, `imageService: 'compile'`) — this is server-rendered on Cloudflare Workers, not the fully static/prerendered site described in `docs/architecture.md`.
- **CMS:** Keystatic (`@keystatic/astro`, config in `keystatic.config.ts`), admin UI at `/keystatic`. Content lives as JSON/MDX under `src/content/` and is git-backed. `docs/architecture.md` and `docs/agent.md` still reference TinaCMS and an `/admin` route — that's stale; ignore it.
- **Content collections:** `src/content.config.ts` defines Astro content collections (`menu_items`, `faq`) using `astro/loaders` `glob()` over `src/content/menu-items/*.json` and `src/content/faq/*.json`, validated with zod. **The Keystatic schema in `keystatic.config.ts` and the zod schema in `src/content.config.ts` must be kept in sync manually** — there's no shared source of truth between them.
  - `menu_items`: price is stored in **EUR cents** (integer) in Keystatic, but as a decimal `z.number()` in the zod schema — check the actual JSON files in `src/content/menu-items/` when in doubt, don't assume one convention.
  - There's also a separate, mostly-parallel `src/content/menu/<slug>/{index.mdoc,body.mdx}` tree (Markdoc + MDX) that isn't wired into `content.config.ts`'s exported `collections` — check whether it's live before assuming it's rendered anywhere.
- **Components:** despite `docs/agent.md`/`docs/components.md` describing a strict `src/components/{ui,sections,layout}` split, most current components (`NavBar.astro`, `HeroSection.astro`, `MenuGrid.astro`, `MenuItemCard.astro`, `Footer.astro`, `OurStory.astro`, `UserReviews.astro`, badges, etc.) live flat in `src/components/`. The `ui/`, `sections/`, and `layout/` subfolders still exist but only hold a handful of files (`ui/Button.astro`, `layout/GlassNav.astro`, `layout/Footer.astro`, `layout/MobileBottomBar.astro`, `sections/FeatureCard.astro`) — there are duplicate-looking `Footer.astro` files in both `src/components/` and `src/components/layout/`, so check which one a page actually imports.
- **Pages:** `src/pages/*.astro` — `index`, `menu`, `about`, `catering`, `contact`. Layout wraps them via `src/layouts/Base.astro`.
- **Styling:** Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 is CSS-first). Design tokens live in `src/styles/tokens.css`, global styles/utilities in `src/styles/global.css`. Use CSS custom properties (`var(--color-douro-gold)`, `var(--radius-md)`, etc.) rather than hardcoded values — see `docs/design-system.md` for the full token palette (OKLCH colors, radius/shadow/motion scales) and `docs/agent.md` for usage patterns.
- **Class merging:** use `cn()` from `src/lib/utils.ts` (`clsx` + `tailwind-merge`) instead of concatenating class strings.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@components/*`, `@layouts/*`, `@styles/*`, `@assets/*`.
- **React islands:** only for interactive pieces (carousel, lightbox, filters). Prefer `client:visible`/`client:idle` over `client:load` per `docs/agent.md`.
- **Deploy:** Cloudflare Pages/Workers, auto-deploy on push to `main` via `.github/workflows/deploy.yml`. `wrangler.toml` sets `compatibility_flags = ["nodejs_compat"]`.

## Conventions

- Commit prefixes: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`.
- Mobile-first Tailwind (base styles for mobile, then `md:`/`lg:`).
- Light theme is the default surface treatment (warm cream + espresso text), not the dark theme implied by some older doc language — check `src/styles/tokens.css` for current values before trusting prose descriptions in `docs/design-system.md`.
