# Content Model

> Reflects `keystatic.config.ts` and `src/content.config.ts` as they
> actually exist. See `CLAUDE.md` for the broader note that these two
> schemas are independent and must be kept in sync by hand.

## Singletons vs. collections

Already applied correctly in this repo:

- **Singletons** (`keystatic.config.ts` → `singletons`) — one-of-a-kind,
  site-wide data: `settings` (contact info, hours, social links, order
  URL), `home` (homepage copy — see the orphaned-content note below).
- **Collections** (`keystatic.config.ts` → `collections`) — repeated
  content: `menu_items`, `faq`.

When adding new content, follow this split: if there's exactly one of it
site-wide, it's a singleton; if there can be many, it's a collection.

## How each is actually consumed

| Content | Keystatic definition | How pages read it |
|---|---|---|
| `menu_items` | `collection`, JSON files under `src/content/menu-items/` | `getCollection('menu_items')` in `menu.astro` and `index.astro`, validated against the zod schema in `src/content.config.ts`. |
| `faq` | `collection`, JSON files under `src/content/faq/` | `getCollection('faq')` in `index.astro`. |
| `settings` | `singleton`, `src/content/settings/default.json` | **Not** read via Astro content collections — imported directly as JSON (`import siteSettings from '@/content/settings/default.json'`) in `MobileBottomBar.astro` and the menu card components, for `phone` and `lieferando_url`. Most other fields (address, hours, social links, logo, og_image) are defined in the schema but not currently read by any component — the actual address/phone/hours are hardcoded separately in `Footer.astro`, `NavBar.astro`, `contact.astro`, and `Base.astro`'s JSON-LD block instead. |
| `home` | `singleton`, `src/content/pages/home.json` | **Nothing reads this.** No `getEntry`/import anywhere in `src/`. `index.astro` hardcodes its own hero headline, gallery images, catering copy, and story text directly in the `.astro` file instead. |

## Known drift: the `home` singleton is orphaned

`src/content/pages/home.json` has real content (hero headline, gallery
images, catering/story copy) and a matching Keystatic schema — editing it
via `/keystatic` would appear to work, but has **zero effect** on the
rendered homepage, since `index.astro` never reads it. Its own content is
also stale: `hero_images`, `gallery_images`, `catering_image`, and
`story_image` all point at files like `/images/hero-1.jpg` and
`/images/angela.jpg` that don't exist in `public/images/` — the current
homepage's real gallery/hero images live under `public/images/gallery/`
and `public/images/menu/` and are hardcoded in `index.astro` instead.

This wasn't fixed in this pass — wiring `index.astro` up to actually
consume the `home` singleton (and replacing its stale image references
with real ones) is a genuine content decision, not a mechanical bug fix,
and touches most of the homepage's hardcoded copy. Options for whoever
picks this up:

1. Wire `index.astro` to read `home.json` via Keystatic's singleton
   reader, replacing the hardcoded strings/images — makes the homepage
   actually editable without a code change, at the cost of touching most
   of `index.astro`.
2. Delete the unused `home` singleton (schema + JSON file) and accept
   that homepage copy changes require editing `index.astro` directly —
   consistent with how `about.astro`, `catering.astro`, and `contact.astro`
   already work today (no Keystatic content backing them at all).

Either is defensible; leaving it as-is (schema exists, nothing reads it)
is the one option that's actively misleading to a content editor.

## Similarly out of Keystatic's reach

`about.astro`, `catering.astro`, and `contact.astro` have no Keystatic
schema at all — their copy is hardcoded directly in the page files. This
is consistent (none of them pretend to be editable when they aren't) and
not itself a bug, just worth knowing before assuming "everything text-y is
in Keystatic."

## Editing content safely

- `menu_items` / `faq`: safe to add/edit/remove via `/keystatic` — both
  collections round-trip cleanly to the pages that render them.
- `settings`: edit the fields actually consumed (`phone`, `lieferando_url`)
  with confidence; editing anything else (address, hours, social links) via
  Keystatic will **not** update the site — those are hardcoded elsewhere
  (see table above) until someone wires the settings singleton through
  those components too.
- `home`: do not rely on this for actual homepage changes — see above.
