# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Restaurant marketing website for D'ouro Soulfood Bistro (Salzburg, Austria). Astro 6 + Tailwind CSS v4 + Keystatic CMS, deployed to Cloudflare Pages. Structural reference: talkintacos.net, with a unique Apple-iOS-inspired design system (warm gold/espresso palette).

**Read `docs/agent.md` first** — it's the canonical rules file for AI agents working in this repo (design tokens, component patterns, accessibility rules, Astro conventions). This CLAUDE.md summarizes commands and architecture; `docs/agent.md`, `docs/architecture.md`, `docs/design-system.md`, `docs/components.md`, and `docs/prd.md` have the details.

`README.md` and `docs/*.md` have been brought back in sync with the codebase (Keystatic, not TinaCMS; real component paths; real fonts/tokens) as of a repo-wide structure cleanup — if you find new drift, fix the doc rather than leaving a note that trust the code instead.

## Commands

Package manager is **pnpm** (`packageManager: pnpm@9.15.9` in package.json), though npm commands also work.

```bash
pnpm install                  # install deps

pnpm dev                      # wrangler pages dev on :8788 (Cloudflare Workers runtime, matches prod)
pnpm dev:astro                # plain `astro dev` (faster iteration, no CF runtime emulation)

pnpm build                    # astro build -> dist/
pnpm preview                  # astro preview

pnpm lint                     # eslint src/  (NOTE: no eslint config file exists in the repo currently — this will fail until one is added)
pnpm format                   # prettier --write .

pnpm test:e2e                 # npx playwright test
pnpm test:e2e:ui               # playwright test --ui
pnpm test:e2e:headed           # playwright test --headed
npx playwright test tests/home.spec.ts               # single file
npx playwright test -g "primary CTA"                  # single test by title

pnpm lhci                     # Lighthouse CI (uses .lighthouserc.js)
```

### Running E2E tests locally

Playwright's `baseURL` defaults to `http://localhost:8788` and there is **no `webServer` auto-start** in `playwright.config.ts` — you must have a server running on 8788 yourself before running tests (e.g. `pnpm dev`, or build + `wrangler pages dev dist --port 8788`). Tests run against the built/served site, not `astro dev`, because `wrangler pages dev` emulates the actual Cloudflare Workers runtime (adapter is `output: 'server'` with the Cloudflare adapter). `run-e2e.sh` is a CI-era helper script with a hardcoded path (`/home/z/my-project/douro-soulfood`) — it does not apply to this environment; prefer running `pnpm dev` + `npx playwright test` directly.

Playwright runs two projects — `desktop` (1440×900) and `mobile` (375×812, iPhone UA) — both on Chromium only (no WebKit/Firefox, to avoid extra browser installs). Tests use `@axe-core/playwright` for accessibility assertions and select elements via aria-label/id/semantic HTML, not `data-testid`.

### CI/CD (`.github/workflows/deploy.yml`)

Every push (any branch) builds, deploys a Cloudflare Pages **preview**, runs Playwright E2E against that preview URL, and runs Lighthouse CI against it. Pushes to `main` additionally promote to **production** after E2E + Lighthouse both pass. Wrangler deploy commands always pass `--project-name=douro-soulfood` — omitting it creates a stray CF Pages project.

## Architecture

### Rendering & content flow

- Astro 6, `output: 'server'` with the `@astrojs/cloudflare` adapter (`platformProxy` enabled, `imageService: 'compile'`) — pages are effectively prerendered/static for this site, but the adapter is SSR-capable.
- Content is Git-backed via **Keystatic** (`keystatic.config.ts`), edited at `/keystatic` locally. Editors save → commits land in `src/content/` → triggers a Cloudflare Pages build → live in ~30s.
- Astro content collections are declared separately in `src/content.config.ts` (Astro v6 requires this file, not `src/content/config.ts`) using `glob` loaders + zod schemas. **The Keystatic schema and the Astro content-collection schema are two independent definitions of the same shape and must be kept in sync by hand** when either changes.
- Two collections wired into `content.config.ts`: `menu_items` (loads `src/content/menu-items/*.json`) and `faq` (loads `src/content/faq/*.json`). `src/content/settings/` is a Keystatic singleton, read via a direct JSON import rather than `getCollection()` — check `keystatic.config.ts` before assuming a content shape.

### Component layout

Components are sorted into the target convention:

```
src/components/layout/     NavBar.astro, Footer.astro, MobileBottomBar.astro
src/components/sections/   HeroSection.astro, FeatureCard.astro, UserReviews.astro,
                            MenuItemCard.astro, MenuBistroCard.astro
src/components/ui/         Button.astro, AllergenBadge.astro, AllergenHeaderLegend.astro,
                            CategoryIcon.astro, DietaryBadge.astro, ReviewBadge.astro
```

- Astro components (`.astro`) only — ship zero JS. There is no React/client-JS framework integration.
- Use Astro's native `class:list={[...]}` directive for conditional/merged classes — there is no `cn()` helper (a previous `clsx`/`tailwind-merge`-based one was removed as dead code).
- Design tokens live in `src/styles/tokens.css` / `src/styles/global.css` as CSS custom properties (`--color-brand-gold`, `--radius-*`, `--ease-spring`, etc.) — components reference these via `var(--...)` rather than hardcoding colors/radii/easing (see `docs/agent.md` "Critical Rules" and the component patterns therein for exact usage).
- Light theme is the default (warm cream surfaces, high-contrast espresso text), not dark.
- `src/lib/menu.ts` holds the menu page's category config and filter/sort/group logic, extracted out of `menu.astro`'s frontmatter.

### Routes

Flat file-based routing in `src/pages/`: `index.astro`, `menu.astro`, `about.astro`, `catering.astro`, `contact.astro`, all wrapped by `src/layouts/Base.astro`.
