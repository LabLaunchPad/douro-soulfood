# Component Registry

Real inventory, verified against `src/components/` on 2026-08-07. Full contracts (per `COMPONENT_GUIDELINES.md`'s template) for the three most-reused/highest-risk components below; a summary table for the rest with known gaps flagged.

---

### Button (`src/components/ui/Button.astro`)

**Category**: atom
**Purpose**: the single reusable action-trigger for every CTA and secondary action site-wide — renders as `<a>` when `href` is given, `<button>` otherwise.

**Props**: `href?: string` · `variant?: 'primary'|'secondary'|'ghost' = 'primary'` · `size?: 'sm'|'md'|'lg' = 'md'` · `arrow?: boolean = false` · `class?: string`

**Variants**
- `primary` — filled gold (`bg-brand-gold`), espresso text. The site's one CTA color; use for the single most important action in any given context.
- `secondary` — outlined, `border-default`, secondary text color. For de-emphasized actions alongside a primary (e.g. "Route planen" next to the phone/order CTAs on Contact).
- `ghost` — no border/fill until hover. For tertiary/low-commitment actions.

**States**: default, hover (`*-light` token or elevated surface + border-emphasis), active/pressed (`*-dark` token or `surface-primary`), focus-visible (2px gold outline, offset 2px — same across all variants).

**Behaviour**: `arrow` prop appends a chevron SVG that translates 2px right and fades in on hover — a consistent micro-interaction across every arrow-bearing CTA site-wide, not a one-off per instance.

**Accessibility**
- Touch target: `sm` = 36px min-height, `md` = 44px, `lg` = 48px — all clear WCAG 2.2 SC 2.5.8's 24px floor with margin.
- Focus-visible outline present on all three variants (verified — a prior audit found and fixed a missing-outline bug elsewhere in the codebase; `Button` was never affected).
- Renders semantically correct element (`<a>` vs `<button>`) based on whether it navigates or acts — never a `<div onclick>`.

**Token mapping**: `--radius-sm`, `--duration-fast`, `--ease-spring`, `--color-brand-gold(-light/-dark)`, `--color-border-default/emphasis`, `--color-surface-elevated/primary`, `--color-text-secondary/primary`

**Usage**: any clickable action. **Anti-usage**: do not use `primary` for more than one action in the same view — it breaks the "one focal action" principle. Do not recreate button styling inline elsewhere; every button-like element site-wide should route through this component (verified: no competing ad hoc button markup found in the 2026-08-07 audit).

---

### MenuItemCard (`src/components/sections/MenuItemCard.astro`)

**Category**: section
**Purpose**: renders one menu dish — two structurally different layouts depending on whether a photo exists, sharing the same props/data shape.

**Anatomy**: Photo variant — full-bleed square image, gradient overlay, name/price/badges pinned to bottom. Text-only variant — plain card, same info, no image area. **This dual-layout pattern is deliberate**, not two components that should be merged — it exists specifically so menu items without a photo don't render an empty placeholder box (a real anti-pattern this component was built to avoid).

**Props**: `name`, `description`, `priceInCents`, `dietary?`, `allergens?`, `prepTime?`, `addOns?`, `priceVariants?`, `available? = true`, `featured? = false`, `imageSrc?`, `imageAlt?`, `imageWidth/Height?`, `class?`

**States**: `available = false` renders a "Nicht verfügbar" overlay banner rather than hiding the item — deliberate, so out-of-stock items stay discoverable/informative rather than disappearing. `featured = true` adds a gold "Empfehlung" badge.

**Accessibility**: entire card is a single clickable link (`<a>` covering the card via `absolute inset-0`) to the ordering platform, with a descriptive `aria-label` (`Jetzt {name} bestellen`) rather than a bare "click here." Text-color choices differ by variant — the photo variant uses white text over a dark image gradient (verified sufficient contrast against the gradient's darkest stop); the text-only variant uses `text-text-primary`/`-brand-gold-ink` against the light card surface (fixed 2026-08-07, was `text-brand-gold` at ~2:1 before).

**Token mapping**: `--radius-2xl`/`-lg`, `--color-surface-card/elevated`, `--color-brand-gold(-ink)`, `--color-text-primary/secondary/tertiary`, `--duration-fast`, `--ease-spring`

**Usage**: any menu-item listing. **Anti-usage**: do not add a third layout variant inline in a page for a "special" menu item — extend this component's props instead (composition over duplication).

---

### NavBar (`src/components/layout/NavBar.astro`)

**Category**: layout shell
**Purpose**: the site's persistent top navigation — fixed position, desktop pill-capsule nav + mobile hamburger trigger for `MobileNavDrawer`.

**Behaviour**: `fixed top-0 inset-x-0 z-50`. Desktop shows a dark espresso capsule (`bg-brand-espresso/90`) with inline links + CTA; mobile shows the logo + a `w-8 h-8` (32px) hamburger button that opens `MobileNavDrawer`.

**Accessibility**: hamburger button has `aria-label="Navigationsmenü öffnen"` + `aria-expanded` state. Sits at `z-50`, below the skip-link's `z-[100]` — verified via a real 40-element keyboard-tab test (2026-08-07) that the skip link is never obscured by the fixed nav (WCAG 2.2 SC 2.4.11), and that anchor-linked sections elsewhere in the site (Datenschutz's table of contents) use `scroll-mt-28` to compensate for the fixed header's height on jump-navigation.

**Token mapping**: `--color-brand-espresso`, `--duration-normal`, z-index (raw `z-50`, predates the named z-index scale — see `DESIGN_TOKENS.md`)

**Usage**: one instance, in `Base.astro`, slotted per-page. **Anti-usage**: do not instantiate a second `NavBar` or duplicate its markup for a "simplified" variant on any page — all 7 pages use the identical shell.

---

## Summary registry (remaining components)

| Component | Category | Purpose | Known gap |
|---|---|---|---|
| AllergenBadge | atom | Single-letter allergen code chip (A/B/E/F/G-M/R) | Font-size fixed to 11px floor 2026-08-07 (was 10px) |
| DietaryBadge | atom | Vegan/vegetarian/gluten-free/spicy/halal/dairy-free tag | Gluten-free variant's text color fixed 2026-08-07 (was `--color-brand-gold` at ~2:1, now `-ink`) |
| ReviewBadge | atom | Star rating + numeric score, used in hero area and review cards | Numeric-rating text color fixed 2026-08-07 (same gold-contrast issue) |
| CategoryIcon | atom | Menu-category icon lookup by name | None found |
| FlagIcon / FlagSprites | atom | DE/UK flag icons via shared `<symbol>` sprite | None found — this is the correct pattern other icon-heavy components should follow |
| MapEmbed | atom | Two-click consent-gated Google Maps embed | None found — correctly implements the GDPR two-click pattern |
| AllergenHeaderLegend | atom | Menu-page allergen key + disclaimer text | Disclaimer text/line-height fixed 2026-08-07 (was 11px + 1.25 leading, now 12px + 1.375) |
| HeroSection | section | Homepage hero, dual mobile/desktop video | Fixed 2026-08-07: was double-loading both mobile+desktop video files regardless of viewport (real, previously-undiscovered bug, ~doubled bandwidth on every homepage visit) |
| FeatureCard | section | Generic image+text+CTA card (Firmenevents, Private Feiern) | None found |
| OurStorySection | section | Founder-story block | Founder-title text-size fixed 2026-08-07 |
| UserReviews | section | Testimonial marquee | Glass-card opacity raised 2026-08-07 for legibility |
| PhotoGrid | section | Gallery grid | None found |
| FaqAccordion | section | Native `<details>`-based FAQ | None found |
| MenuBistroCard | section | Menu item card for the bistro-themed category banners (Entradas, Bebidas sub-categories) | Undersized text (10-11px) and un-tokenized `stone-*`/`amber-*` colors — see `COLOR_SYSTEM.md` |
| MobileNavDrawer | layout | Full-screen mobile nav overlay | None found |
| MobileBottomBar | layout | Fixed bottom call/order bar, mobile only | None found (note: appears to duplicate mid-page in `fullPage` screenshots — a Puppeteer stitching artifact, not a real rendering bug, see `GRID_SYSTEM.md`) |
| Footer | layout | Site footer | Nav-link/legal-link hover colors fixed 2026-08-07; still has un-tokenized `stone-*`/`zinc-*`/`neutral-*` for muted text — see `COLOR_SYSTEM.md` |
