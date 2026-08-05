# Components Reference

> API docs for all components in the D'ouro Soulfood design system. All components are `.astro` — no client-side JS framework is used anywhere in this codebase.

---

## UI Atoms (`src/components/ui/`)

### Button
**File:** `src/components/ui/Button.astro`
**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| href | string | — | Link destination |
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Visual style |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Size variant |
| arrow | boolean | false | Show animated arrow icon |
| class | string | '' | Additional classes |

---

### AllergenBadge
**File:** `src/components/ui/AllergenBadge.astro`
Renders a single allergen code badge (e.g. "G/M"), used inside `MenuItemCard`.

### DietaryBadge
**File:** `src/components/ui/DietaryBadge.astro`
Renders a single dietary tag badge (vegan, vegetarian, gluten-free, spicy, halal, dairy-free), used inside `MenuItemCard`.

### CategoryIcon
**File:** `src/components/ui/CategoryIcon.astro`
Renders the vector icon for a menu category (appetizers, tacos, bowls, etc.) — used on both the home page's category grid and the menu page's category navigation.

### ReviewBadge
**File:** `src/components/ui/ReviewBadge.astro`
**Props:**
| Prop | Type | Description |
|------|------|-------------|
| rating | number | Star rating (e.g. 4.8) |

Renders the star-rating badge shown on the home page below the hero.

### AllergenHeaderLegend
**File:** `src/components/ui/AllergenHeaderLegend.astro`
Renders the allergen code legend and bilingual (DE/EN) disclaimer shown at the top of the menu page.

### MapEmbed
**File:** `src/components/ui/MapEmbed.astro`
Consent-gated Google Maps embed ("two-click" pattern): renders a static placeholder card (address text + a "Karte anzeigen" button) by default, and only injects the real `<iframe>` after the visitor clicks through — no request to Google fires, and no visitor IP is sent, until they opt in. Used on the home page and `contact.astro`.
**Props:**
| Prop | Type | Description |
|------|------|-------------|
| src | string | The Google Maps embed URL to load after consent |
| title | string | `<iframe>` accessible title |
| addressLabel | string | Address text shown on the placeholder card |
| class | string | Additional classes |

---

## Section Components (`src/components/sections/`)

### HeroSection
**File:** `src/components/sections/HeroSection.astro`
**Props:**
| Prop | Type | Description |
|------|------|-------------|
| accent | string | Small accent label above the headline |
| headline | string | Main `<h1>` heading |
| subheadline | string | Supporting text |
| images | { src, alt, width, height }[] | Hero image(s) |
| ctaPrimary | { label, href } | Primary CTA button |
| ctaSecondary | { label, href } | Secondary CTA button |

The primary/secondary CTAs render inside a `hidden md:flex` container — not visible on mobile viewports by design.

### FeatureCard
**File:** `src/components/sections/FeatureCard.astro`
**Props:**
| Prop | Type | Description |
|------|------|-------------|
| title | string | Card heading |
| description | string | Body text |
| image | { src, alt } | Feature image |
| cta | { label, href } | Action button |
| reverse | boolean | Flip image/text order |

### UserReviews
**File:** `src/components/sections/UserReviews.astro`
Renders the guest-reviews section on the home page.

### MenuItemCard
**File:** `src/components/sections/MenuItemCard.astro`
Full-detail menu item card (used for most menu categories). Reads `siteSettings` directly for the order-online link. Composes `DietaryBadge` and `AllergenBadge`.

### MenuBistroCard
**File:** `src/components/sections/MenuBistroCard.astro`
Compact menu item card, used across most of `menu.astro`'s categories (quesadillas, tacos, bowls, drinks/bebidas, and more) — not limited to drinks. Supports `priceVariants` (non-alcoholic/alcoholic dual pricing) and `addOns`.
**Props:**
| Prop | Type | Description |
|------|------|-------------|
| name | string | Dish/drink name |
| description | string | German description |
| descriptionEn | string? | English description |
| priceInCents | number | Base price in EUR cents |
| priceVariants | { nonAlcoholic?, alcoholic? } | EUR cents, for dual-price drinks |
| prepTime / prepTimeEn | string? | Prep time text |
| allergens | string[] | Allergen codes |
| addOns | { label, price }[] | Optional add-ons |
| imageSrc / imageAlt | string? | Optional image |
| available | boolean | Whether currently available |

---

## Layout Components (`src/components/layout/`)

### NavBar
**File:** `src/components/layout/NavBar.astro`
Desktop scroll-transition header plus the mobile capsule trigger (logo, "Speisekarte" link, hamburger button). Renders `MobileNavDrawer` and owns the scroll-transition `<script>`; the drawer's own open/close/focus-trap logic lives in `MobileNavDrawer.astro`.

### MobileNavDrawer
**File:** `src/components/layout/MobileNavDrawer.astro`
Full-screen mobile navigation overlay (`role="dialog"`, `aria-label="Navigationsmenü"`), split out of `NavBar.astro`. Talks to `NavBar`'s hamburger button (`#mobile-menu-btn`) by id rather than component subtree, since Astro doesn't scope `<script>` tags. Owns open/close, `Escape`-to-close, a Tab focus trap, and `inert`/`aria-hidden` toggling while closed.

### Footer
**File:** `src/components/layout/Footer.astro`
**Props:** `cta`, `address` (string array), `phone`, `phoneHref`, `copyrightName`, plus link arrays. Renders the location line inside a semantic `<address>` element.

### MobileBottomBar
**File:** `src/components/layout/MobileBottomBar.astro`
Persistent bottom action bar shown on mobile, rendered directly by `Base.astro` (not per-page). Reads phone/order-link from `siteSettings`.

---

## Layout Shell

### Base
**File:** `src/layouts/Base.astro`
**Props:**
| Prop | Type | Description |
|------|------|-------------|
| title | string | Page title |
| description | string? | Meta description |
| image | string? | OG/Twitter image URL |
| canonical | string? | Canonical URL |
| type | 'website' \| 'article' | OG type |

Handles `<head>` (SEO meta, fonts, Schema.org `Restaurant` JSON-LD), global CSS import, and renders `MobileBottomBar` plus `nav`/`footer`/default slots. Does **not** import `NavBar`/`Footer` itself — each page imports and slots them individually.

---

## Class Composition

There is no `cn()` utility in this codebase (a previous `clsx`/`tailwind-merge`-based one was removed as dead code). Use Astro's native `class:list={[...]}` directive for conditional/merged classes, e.g.:

```astro
<div class:list={['base-class', { 'active-class': isActive }]}>
```
