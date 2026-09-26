# Image Policy — D'ouro Soulfood Bistro

> Established by the `public/images/` → `src/assets/` migration (Tasks 0–5,
> branch `chore/finish-deferred-items`). Supersedes the "known limitation" in
> `docs/audit/image-audit.md`.

## The rule

Every rendered image lives in `src/assets/` and reaches `<Image>` as an
imported `ImageMetadata` object — either a static `import` (page/component
assets) or the Keystatic JSON value resolved by Astro's `image()` schema
helper (CMS photos). String `src` paths to `public/` get **zero** pipeline
processing (no resize, no recompress, no hash) — see the audit for proof.

## The only exceptions (stable public URLs — never content-hash these)

| File | Consumers |
|---|---|
| `public/dourologo.webp` | JSON-LD `logo`/`image`, Keystatic `settings.logo` |
| `public/images/og-default.jpg` | `og:image`/`twitter:image` default, Keystatic `settings.og_image` |
| `public/images/apple-touch-icon.png` | `<link rel="apple-touch-icon">` |

Crawlers, scrapers and browsers cache these by absolute URL outside our
deploy cycle, so they must stay byte-stable at a fixed path. The brand logo
is *additionally* imported from `src/assets/brand/` for on-page rendering —
two copies on purpose (see "Why duplication is correct" below).

## Adding a new image

- **Page/component asset** (gallery, hero, section art, logo renderings):
  put the file under `src/assets/<area>/`, `import` it, pass the object to
  `<Image src={…}>`. Component image props take `ImageMetadata`.
- **CMS photo** (dish photos Angela edits): upload via `/keystatic` only.
  `keystatic.config.ts` `fields.image` uses `directory: 'src/assets/menu'`
  with `publicPath: '/src/assets/menu'`, so the JSON value is the
  project-root-absolute path (e.g. `/src/assets/menu/x.webp`) and
  `src/content.config.ts` declares `image: image().nullable().optional()`
  to resolve it. **Any schema change updates both files in the same commit**
  (see `.ai/decisions/keystatic-sync.okf.md`).
- **Never** add files to `public/` for rendering, and never hand-write an
  `image:` path into a menu JSON — uploads go through Keystatic so bytes
  and JSON stay in step.

## Failure modes (verified by spike, kept here so nobody re-learns them)

- A JSON `image` path with no matching file passes `astro sync` silently
  and fails `pnpm build` with `[ImageNotFound]`. **Build is the gate** —
  never merge half-migrated JSON.
- `item.data.image` is `ImageMetadata`, not a string. JSON-LD/absolute-URL
  code must use `item.data.image?.src`.
- Keystatic admin thumbnails for `src/assets/` uploads don't resolve in
  dev (`src/` isn't served) — filename + upload + build validation work,
  the preview thumbnail doesn't. Accepted tradeoff; full write round-trip
  in `/keystatic` remains a manual QA step after any CMS schema change.
- Card components (`MenuItemCard`, `MenuBistroCard`) accept
  `ImageMetadata | string` so the dev-only `/dev/ui` preview can keep
  passing string literals.

## Why duplication is correct (logo, OG)

`src/assets/brand/dourologo.webp` (rendered, hashed, optimized) and
`public/dourologo.webp` (linked, stable) serve different consumers with
opposite requirements — collapsing them breaks one side. Same logic keeps
`og-default.jpg` in `public/` despite the migration deleting the other 57
files from `public/images/` (12 of which were unreferenced dead weight:
duplicate `.png`s and unused `.jpg`s that were never migrated).
