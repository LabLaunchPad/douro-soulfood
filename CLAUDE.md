# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Restaurant website for D'ouro Soulfood Bistro (Salzburg, Austria). Astro 6 + Tailwind CSS v4 + Cloudflare Pages/Workers, content managed via Keystatic CMS. Structural reference is talkintacos.net with a unique visual identity ("Apple iOS-inspired dark theme with Brazilian gold warmth" — see `docs/design-system.md`).

**`docs/` mixes two eras.** `prd.md`, `architecture.md`, `components.md`, `agent.md` describe an earlier/aspirational version of the stack and have drifted from the actual code — see "Docs vs. reality" below before trusting them. `seo.md`, `analytics.md`, `content-model.md`, `runbook.md` are current and reflect the real implementation (`src/lib/seo/`, `src/lib/analytics/`, `keystatic.config.ts`, CI) — trust those.

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
- **Components:** most components (`NavBar.astro`, `HeroSection.astro`, `MenuItemCard.astro`, `MenuBistroCard.astro`, `Footer.astro`, `UserReviews.astro`, badges, etc.) live flat in `src/components/`. There is exactly **one** canonical nav (`NavBar.astro`), footer (`Footer.astro`), and mobile bar (`layout/MobileBottomBar.astro`) — the earlier duplicate stack (`layout/GlassNav.astro`, `layout/Footer.astro`, unused `OurStory.astro`) was removed; don't reintroduce a second nav/footer implementation. `ui/Button.astro` and `sections/FeatureCard.astro` are the only other subfolder components. `src/components/menu/` holds `CategoryBanner.astro`/`CategoryShowcase.astro`, extracted from `menu.astro` to keep its per-category branching down. `src/components/analytics/` holds `GoogleTagManager.astro` and `ClickTracking.astro` (see `docs/analytics.md`).
- **Pages:** `src/pages/*.astro` — `index`, `menu`, `about`, `catering`, `contact`, `impressum`, `datenschutz`. Layout wraps them via `src/layouts/Base.astro`. There is no `/gift-cards` page or content backing it — don't link to it.
- **Styling:** Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 is CSS-first). Design tokens live in `src/styles/tokens.css`, global styles/utilities in `src/styles/global.css`. Use CSS custom properties rather than hardcoded values. `--color-brand-gold` (and its `-light`/`-dark` variants, plus the `--color-douro-gold` legacy alias) is deliberately kept **light** — it backs button fills, borders, and icon accents that sit against dark espresso text/backgrounds. For gold used as *text color on a light surface*, use `text-brand-gold-ink` (`--color-brand-gold-ink`) instead, which is darkened specifically to pass WCAG contrast there — using the wrong one is an easy mistake (see the /menu page paper-menu tokens `--color-menu-*` for a separate, unrelated sub-palette). See `docs/design-system.md` for the full token palette (OKLCH colors, radius/shadow/motion scales) — trust `tokens.css` itself over that doc's prose where they differ.
- **SEO:** `src/lib/seo/meta.ts` (`buildPageMeta()`) is the single source of truth for title/description/canonical/OG resolution, consumed by `Base.astro`. See `docs/seo.md`.
- **Analytics:** `src/lib/analytics/events.ts` (typed event contract + `trackEvent()`), `src/lib/analytics/consent.ts` (Consent Mode v2 update helpers), `src/components/analytics/GoogleTagManager.astro` (loads GTM only if `PUBLIC_GTM_ID` is set — no tracking ships by default), `src/components/analytics/ClickTracking.astro` (one delegated click/toggle listener — add `data-analytics-event="..."` to an element rather than writing a new `dataLayer.push()`). See `docs/analytics.md` — there is no consent-banner UI yet, so don't set `PUBLIC_GTM_ID` in a real environment without one.
- **Content model:** Keystatic `collections` (`menu_items`, `faq`) are consumed via `getCollection()` and round-trip correctly. The `settings` and `home` **singletons** are a mixed bag — `settings.phone`/`settings.lieferando_url` are actually read (imported as JSON directly, not via Astro content collections); most other `settings` fields and the entire `home` singleton are defined in Keystatic but nothing reads them, and `home.json`'s image references don't even exist on disk. See `docs/content-model.md` before assuming a Keystatic field change will affect the rendered site.
- **Class merging:** use `cn()` from `src/lib/utils.ts` (`clsx` + `tailwind-merge`) instead of concatenating class strings.
- **Path aliases** (`tsconfig.json`): `@/*` → `src/*`, `@components/*`, `@layouts/*`, `@styles/*`, `@assets/*`.
- **React islands:** only for interactive pieces (carousel, lightbox, filters) — none currently exist; all current interactivity (nav scroll state, mobile drawer, marquee, click tracking) is plain `<script>` in `.astro` files despite React/Framer Motion being installed dependencies. Prefer `client:visible`/`client:idle` over `client:load` if you do add one.
- **Deploy:** Cloudflare Pages/Workers, auto-deploy on push to `main` via `.github/workflows/deploy.yml` — but see `docs/runbook.md`: the CI's `Deploy Preview` job currently fails on every run (missing `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` repo secrets), blocking E2E/Lighthouse/production-promotion downstream. Cloudflare's own Git integration deploys independently and isn't affected. `wrangler.toml` sets `compatibility_flags = ["nodejs_compat"]`. Locally, `pnpm dev`/`pnpm test:e2e`'s use of `wrangler pages dev` doesn't match this adapter's Workers-shaped build output — see `docs/runbook.md` for the working local command (`wrangler dev --config dist/server/wrangler.json`).
- **Lint:** `pnpm lint` (`eslint src/`) fails on a clean checkout — `eslint` isn't a project dependency and there's no config. Pre-existing gap, not fixed here (would mean adding a new dependency).

## Conventions

- Commit prefixes: `feat:`, `fix:`, `style:`, `docs:`, `refactor:`.
- Mobile-first Tailwind (base styles for mobile, then `md:`/`lg:`).
- Light theme is the default surface treatment (warm cream + espresso text), not the dark theme implied by some older doc language — check `src/styles/tokens.css` for current values before trusting prose descriptions in `docs/design-system.md`.
