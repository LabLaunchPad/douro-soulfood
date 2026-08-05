# Learned Constraints

Real constraints discovered through actual work in this repo, not assumed.

- `wrangler pages dev`'s local runtime fails to start in at least one sandboxed agent environment used with this repo (`Uncaught Error: No such module "wrangler:modules-watch"`) — a pre-existing environment issue, unrelated to any code change. Fall back to `pnpm dev:astro` (plain Astro dev, no Cloudflare runtime emulation) for live verification when this happens.
- Playwright's browser binary is also confirmed missing in that same environment — `npx playwright test --list` (no browser required) is the available static-verification fallback.
- Astro's frontmatter compiler requires `import` statements to appear before any top-level `if`/`return` guard clause in a page's frontmatter — putting a `return new Response(...)` guard before imports produces a confusing "Unterminated string literal" esbuild error that has nothing obviously to do with import order. Always put imports first.
- Astro's `<Image>` component, when given a `public/`-relative string `src` (not an `src/assets/` import), passes the file through unprocessed — no format conversion/recompression, but does still add correct `width`/`height`/`decoding="async"`. This is the established, accepted behavior across every `<Image>` usage in this codebase, not a bug specific to any one component.
- `@astrojs/sitemap` doesn't know about a page's own runtime guards (e.g. a `import.meta.env.DEV` check) — it walks `src/pages/` directly. A dev-only route still needs an explicit `filter` in the sitemap integration config to actually stay out of `sitemap.xml`.
- `.jfif` files are valid JPEG content but not an extension Astro's image pipeline recognizes automatically — pass `format="jpeg"` explicitly.
