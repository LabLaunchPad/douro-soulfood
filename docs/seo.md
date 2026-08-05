# SEO Rules

> Reflects the actual implementation in `src/lib/seo/meta.ts` and `src/layouts/Base.astro`.
> If this doc and the code ever disagree, the code wins — update this file to match.

## How page metadata works

Every page renders through `Base.astro`, which takes `title`, `description`,
`image`, `canonical`, and `type` props and passes them to
`buildPageMeta()` (`src/lib/seo/meta.ts`). That function is the single
place title formatting, description/image fallbacks, and canonical
resolution happen — don't hand-format `<title>` or duplicate the
Open Graph/Twitter tag block anywhere else.

- **Title**: pages pass a short `title` (e.g. `"Speisekarte"`); `buildPageMeta`
  formats it as `"D'ouro Soulfood Bistro | Speisekarte"`. Pass the site name
  itself (`SITE_NAME` export) to render just the bare site name (used on
  the homepage).
- **Description**: falls back to a site-wide default if a page doesn't pass
  one. Prefer a page-specific description whenever the page has distinct
  content (see `index.astro`'s and `menu.astro`'s custom descriptions).
- **Canonical**: defaults to `Astro.url.href` (the current request URL) —
  correct for every route since none of the current pages have query-string
  variants that should canonicalize elsewhere.
- **Image**: defaults to `/dourologo.png`, resolved against `Astro.site`.
  There is no real Open Graph photo asset in the repo yet
  (`public/images/og-default.jpg` referenced by the old code didn't exist —
  fixed to point at the logo). Pass a page-specific `image` for pages that
  should share a dish photo instead.

## Required per page

- Unique `title` and `description` — every current route (`/`, `/menu`,
  `/about`, `/catering`, `/contact`) passes its own.
- Canonical URL — automatic via `buildPageMeta`, no action needed per page.
- Open Graph + Twitter Card tags — automatic via `Base.astro`, no action
  needed per page.
- Structured data — JSON-LD only. Currently a single `Restaurant` schema
  block in `Base.astro`, rendered on every page (not just the homepage).
  If a future page needs its own schema (e.g. a `FAQPage` block for
  `/menu`'s or the homepage's FAQ accordion), add a second
  `<script type="application/ld+json">` — don't replace the `Restaurant`
  block, which should stay site-wide.

## Sitemap & robots

- `@astrojs/sitemap` (configured in `astro.config.mjs`) generates
  `sitemap-index.xml`/`sitemap-0.xml` at build time from the actual route
  tree — no manual sitemap maintenance.
- `public/robots.txt` should reference the sitemap and not block any of the
  five real routes. `/keystatic` (the CMS admin) should stay disallowed —
  it's not public content.

## Navigation & crawlability

- Every real route must be reachable from `NavBar.astro` and/or
  `Footer.astro` — those are the two canonical navigation components (see
  `docs/content-model.md` and `CLAUDE.md` for why there's only one of each).
- Do not link to a route that doesn't have a page behind it. If a
  product need arises for a new route (gift cards, legal pages, etc.),
  add the `src/pages/*.astro` file and its content *before* linking to it,
  not after.
- `noindex` is not currently used anywhere and should stay that way unless
  a page is genuinely not meant for search (e.g. a future preview/staging
  route) — don't reach for it by default.
