# Runbook

> Deploy and validation steps as they actually exist today. See
> `.github/workflows/deploy.yml`, `wrangler.toml`, and `package.json`
> for the source of truth this summarizes.

## Local development

```bash
pnpm install
pnpm dev          # wrangler pages dev --port 8788 — production-like Workers runtime
```

`pnpm dev:astro` runs the plain Astro dev server (port 4321) instead —
faster reloads, but doesn't emulate the Cloudflare Workers runtime
(`platformProxy`, KV bindings) the site actually deploys to. Use it for
quick UI iteration; use `pnpm dev` before trusting anything
Workers-runtime-specific (image service, sessions).

## Before opening a PR

```bash
pnpm build                              # astro build — must succeed cleanly
pnpm test:e2e                           # wrangler pages dev + Playwright (see below)
pnpm lhci                               # Lighthouse CI against the build
```

`pnpm lint` (`eslint src/`) is defined in `package.json` but **eslint is
not currently a project dependency** — there's no `eslint` package and no
config file, so this script fails immediately on a clean checkout. This is
a pre-existing gap, not something introduced by any single change; fixing
it means adding `eslint` (and a flat config) as a real dependency, which
wasn't done here to avoid an unrelated dependency bump. Don't rely on
`pnpm lint` passing as a signal until that's addressed.

## Running Playwright locally

`pnpm test:e2e` wraps `wrangler pages dev` + `playwright test`, but on
this Astro 6 + `@astrojs/cloudflare` (server output) setup, the build
output is Workers-shaped (`dist/server/entry.mjs` + `dist/server/wrangler.json`,
with static assets in `dist/client/`), not the Pages-Functions shape
`wrangler pages dev` expects. In practice:

```bash
pnpm build
npx wrangler dev --config dist/server/wrangler.json --port 8788
# in another terminal:
BASE_URL=http://localhost:8788 npx playwright test
```

This is a real mismatch between the `pnpm dev`/`pnpm test:e2e` scripts and
what the Cloudflare adapter actually emits — see the CI note below for the
production-deploy side of the same issue. Not fixed in this pass (it's a
tooling/adapter-version question, not a design-system one); flagged here
so it's not mistaken for a working script.

## CI (`.github/workflows/deploy.yml`)

1. **Build** — `pnpm build`, uploads `dist/` as an artifact.
2. **Deploy Preview** — `wrangler pages deploy dist/` to Cloudflare Pages,
   for every branch. **Currently fails on every run** (not just this
   branch) with `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID` missing —
   those repo secrets aren't configured. This blocks every downstream job
   (E2E, Lighthouse, production promotion), since they all `needs:
   deploy-preview`. A repo admin needs to add both secrets under Settings →
   Secrets and variables → Actions.
3. **Playwright E2E** — runs against the preview URL from step 2. Blocked
   by (2) until secrets exist.
4. **Lighthouse CI** — same, against the preview URL. Blocked by (2).
5. **Deploy to Production** — only on `main`, only after (3) and (4) pass.
   Blocked by (2).

Separately from the missing secrets: Cloudflare's own **Git integration**
(visible as `cloudflare-workers-and-pages[bot]` PR comments) deploys
independently of this GitHub Actions workflow and has been succeeding —
so the live site isn't blocked by the CI gap above, only this workflow's
own preview/E2E/Lighthouse/production-promotion steps are.

## Lighthouse budgets (`.lighthouserc.js`)

Performance ≥ 0.9, Accessibility ≥ 0.92, Best Practices ≥ 0.9 (warn), SEO
≥ 0.92, plus Core Web Vitals thresholds (LCP < 2.5s, CLS < 0.1, TBT <
200ms). These run against `http://localhost:8788` locally
(`staticDistDir: ./dist`) or the CI preview URL when `LHCI_URL` is set —
see the CI mismatch above for why the CI path is currently blocked.

## Keystatic content changes

Content edits (`menu_items`, `faq`, `settings`) made via `/keystatic` in
local dev write straight to the JSON files under `src/content/` — commit
and push those like any other file change. There's no separate publish
step; a merged content change deploys the same way as a code change.
