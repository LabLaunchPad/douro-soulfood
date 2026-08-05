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
pnpm lhci                               # Lighthouse CI — see caveat below, plain `pnpm lhci` 404s locally
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

## Lighthouse budgets (`.lighthouserc.cjs`)

Performance ≥ 0.9, Accessibility ≥ 0.92, Best Practices ≥ 0.9 (warn), SEO
≥ 0.92, plus Core Web Vitals thresholds (LCP < 2.5s, CLS < 0.1, TBT <
200ms). `pnpm lhci` requires `@lhci/cli` (a devDependency) and Chrome —
if no system Chrome is found, set `CHROME_PATH` to a Chromium binary.

The config's `staticDistDir: './dist'` fallback (used when `LHCI_URL` is
unset) does **not** work on this server-output build: `astro build`
writes the actual site to `dist/client/`, not `dist/`, so `lhci`'s static
server 404s on every URL. In CI, `LHCI_URL` is always set to the preview
URL from the Deploy Preview job, so this only bites local runs without
`LHCI_URL` — see the CI mismatch above for why the CI path itself is
currently blocked. To run it locally against a real server instead:

```bash
pnpm build
npx wrangler dev --config dist/server/wrangler.json --port 8788
# in another terminal:
LHCI_URL=http://localhost:8788 pnpm exec lhci autorun \
  --config=.lighthouserc.cjs \
  --collect.url=http://localhost:8788/ \
  --collect.url=http://localhost:8788/menu \
  --collect.url=http://localhost:8788/about \
  --collect.url=http://localhost:8788/contact
```

## Hero video Range-request fix (in progress)

The hero background videos (`public/douroherovideo.mp4`,
`public/douroheromobile.mp4`) are served by the Workers static-assets
(`ASSETS`) binding, which doesn't honor HTTP Range requests — confirmed
via curl against the live preview: a ranged request returns `200` with
no `Accept-Ranges`/`Content-Range`, not `206`. iOS Safari requires Range
support to autoplay `<video>` past a certain file size, so on-device this
can fall back to showing the poster image with no playback.

The fix (R2 + a thin SSR route per video, same public URL paths so
`HeroSection.astro` needs no changes) is written and locally verified
against `wrangler dev`'s local R2 emulation — correct `200/206/416`,
`Accept-Ranges`, and byte-exact `Content-Range` slices:

- `src/lib/media/rangeResponse.ts` — the Range-parsing/response helper
- `src/pages/douroherovideo.mp4.ts`, `src/pages/douroheromobile.mp4.ts` —
  routes that call it via `import { env } from 'cloudflare:workers'`
  (**not** `Astro.locals.runtime.env` — that's been removed in this
  Astro 6 + `@astrojs/cloudflare` version and throws at runtime)
- `worker-configuration.d.ts` — ambient types from `wrangler types`

The `[[r2_buckets]]` binding in `wrangler.toml` is currently **commented
out**: Cloudflare validates bindings against real resources at deploy
time, and R2 isn't enabled on this account yet (confirmed via API: `403
Please enable R2 through the Cloudflare Dashboard`) — leaving it
uncommented broke every Workers Build deploy. The two route files above
are dead code until this is finished; `public/*.mp4` still shadow them
via static-asset routing precedence either way.

To finish the cutover once R2 is enabled and real credentials exist:

```bash
wrangler r2 bucket create douro-media
wrangler r2 object put douro-media/douroherovideo.mp4 --file=public/douroherovideo.mp4
wrangler r2 object put douro-media/douroheromobile.mp4 --file=public/douroheromobile.mp4
```

then uncomment the `[[r2_buckets]]` block in `wrangler.toml`, rerun
`wrangler types`, remove the two files from `public/`, and verify on a
real deploy (curl for `206`, then an actual iOS Safari check) before
calling it done.

## Keystatic content changes

Content edits (`menu_items`, `faq`, `settings`) made via `/keystatic` in
local dev write straight to the JSON files under `src/content/` — commit
and push those like any other file change. There's no separate publish
step; a merged content change deploys the same way as a code change.
