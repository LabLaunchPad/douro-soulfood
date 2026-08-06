---
okf_version: "0.2"
id: "docs/design-system"
type: "knowledge"
title: "Design System: D'ouro Soulfood"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance: { source: "human", references: ["src/styles/tokens.css"] }
attestation: { method: "manual", checks: [] }
summary: "Design philosophy, tokens, typography, spacing, motion conventions. Source of truth is src/styles/tokens.css; this doc describes it and must stay in sync."
load_when: "Any styling/token work."
token_budget: 800
related: [".ai/packs/design-system.okf.md", "src/styles/tokens.css"]
---

# Design System: D'ouro Soulfood

> **Version:** 0.2.0
> **Design DNA:** Apple iOS device aesthetic + Brazilian soul warmth
> **Structural reference:** talkintacos.net (spacing/grid conventions only — D'ouro's own palette, fonts, and content)
> **Source of truth:** `src/styles/tokens.css` — this document describes it, values here must stay in sync with that file

---

## 1. Design Philosophy

**"Warm Precision"** — Apple's spatial clarity meets Brazilian sensory warmth. Every interaction should feel as polished as an iOS app but as inviting as Angela's cooking.

### Principles
1. **Light, not dark** — Warm cream surfaces with high-contrast espresso text, not a dark theme
2. **Motion is meaning** — Every animation communicates, never decorates
3. **Warm contrast** — Gold/terracotta accents create appetite against a light backdrop
4. **Generous space** — iOS-level whitespace, never cramped
5. **One hero per section** — Every section has one focal point

---

## 2. Color Palette

### Brand Colors (OKLCH — `src/styles/tokens.css`)
```
Terracotta (Primary CTA):   oklch(0.56 0.18 24.5)   — Earthy rust red
Terracotta Light (Hover):   oklch(0.66 0.18 24.5)
Terracotta Dark (Pressed):  oklch(0.42 0.18 24.5)
Gold (Secondary CTA):       oklch(0.78 0.18 85.0)   — Honey gold
Gold Light (Hover):         oklch(0.85 0.16 85.0)
Gold Dark (Pressed):        oklch(0.65 0.18 85.0)
Forest (Fresh/Vegan):       oklch(0.68 0.22 142.5)
Sage (Green labels):        oklch(0.72 0.12 142.5)
Espresso (Dark Neutral):    oklch(0.12 0.01 0)      — Near-black warm espresso tone
Cream (Warm Neutral):       oklch(0.98 0.005 80)    — Soothing warm cream tone
```

### Surface System (Light Theme — Default)
```
Primary Surface:     oklch(0.98 0.005 80)       — Page background
Elevated Surface:    oklch(0.95 0.01 80)        — Nav bars, subtly separated containers
Card Surface:        oklch(1.0 0.002 80)        — Menu items, feature cards
Glass Surface:       oklch(1.0 0.002 80 / 0.72) — Frosted glass with backdrop blur
```

### Text Hierarchy
```
Primary Text:        oklch(0.20 0.02 40)   — Deep espresso/charcoal
Secondary Text:      oklch(0.42 0.02 45)   — Medium-dark warm grey
Tertiary Text:       oklch(0.58 0.015 50)  — Muted warm grey, captions/footnotes
Inverse Text:        oklch(0.98 0.005 80)  — Cream text on dark/filled CTAs
```

### Borders
```
Subtle:              oklch(0.20 0.02 40 / 0.06) — 6% opacity dark neutral
Default:             oklch(0.20 0.02 40 / 0.10) — 10% opacity dark neutral
Emphasis:            oklch(0.20 0.02 40 / 0.20) — 20% opacity dark neutral
```

### Bistro Menu Palette
A secondary gold/cream palette used specifically for the menu page's category banners and allergen legend, visually distinct from the primary brand palette (deeper ink, brighter gold):
```
Banner:              #1B140E
Banner Border:       #D4AF37
Banner Text:         #F4E3B3
Ink:                 #2C1810
Paper:               #FFFDF9
Paper Border:        #E8DFC8
Paper Alt:            #FAF6EE
Taupe:                #D6C4A5
```

---

## 3. Typography

### Font Stack
- **Display:** `'Fraunces', 'Georgia', 'Times New Roman', serif` — a wonky, soft serif for headings, heroes, pull quotes
- **Body:** `'DM Sans', 'Inter', system-ui, -apple-system, sans-serif` — clean, geometric, warm
- **Mono:** `'SF Mono', 'Fira Code', 'Cascadia Code', monospace` — code/technical data only

Loaded via `<link>` tags in `Base.astro`'s `<head>` (preconnect + stylesheet with `display=swap`), not `@import`.

### Type Scale
`tokens.css` defines a modular semantic scale (`--text-display-*`, `--text-heading-*`, `--text-body-*`, `--text-label`) intended for new/refactored components, layered on top of Tailwind's default `text-xs`…`text-7xl` scale (still used by most existing markup):

| Token | Size | Line-height |
|-------|------|-------------|
| `--text-label` | 0.75rem | 1.4 |
| `--text-body-sm` | 0.875rem | 1.6 |
| `--text-body-base` | 1rem | 1.6 |
| `--text-body-lg` | 1.125rem | 1.6 |
| `--text-heading-sm` | 1.375rem | 1.25 |
| `--text-heading-md` | 1.75rem | 1.2 |
| `--text-heading-lg` | 2.25rem | 1.15 |
| `--text-display-sm` | 2.75rem | 1.1 |
| `--text-display-md` | 3.5rem | 1.05 |
| `--text-display-lg` | 4.5rem | 1.0 |
| `--text-display-xl` | 5.5rem | 0.98 |

### Rules
- Headings use `-0.02em` letter-spacing, `1.15` line-height (set globally on `h1`–`h6` in `tokens.css`'s `@layer base`)
- Body text uses `1.6` line-height

---

## 4. Spacing & Layout

### Section Spacing
- Desktop: `--spacing-section` (120px) vertical padding
- Mobile: `--spacing-section-mobile` (72px) vertical padding

### Content Max Width
- `max-w-7xl` (1280px, aliased as `--container-content` in tokens.css) for content sections

### Breakpoints
Tailwind v4 defaults, explicitly declared in `tokens.css` for documentation: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

---

## 5. Border Radius

```
XS:    6px   — Small chips, tags
SM:    10px  — Buttons, inputs
MD:    14px  — Cards, dropdowns
LG:    20px  — Feature cards, modals
XL:    28px  — Hero cards, galleries
2XL:   40px  — Full-page overlays
Full:  9999px — Avatars, pills
```

---

## 6. Shadows

```
XS:    0 1px 2px oklch(0.20 0.02 40 / 0.03)
SM:    0 2px 8px oklch(0.20 0.02 40 / 0.05)
MD:    0 4px 16px oklch(0.20 0.02 40 / 0.08)
LG:    0 8px 32px oklch(0.20 0.02 40 / 0.12)
XL:    0 16px 48px oklch(0.20 0.02 40 / 0.16)

Glow Gold: 0 0 40px oklch(0.6812 0.2208 142.67 / 0.15)
```

---

## 7. Motion & Animation

### Easing Curves
```
Spring:    cubic-bezier(0.22, 1, 0.36, 1)   — Default for most interactive transitions
Smooth:    cubic-bezier(0.4, 0, 0.2, 1)     — Background animations
Out-quart: cubic-bezier(0.25, 1, 0.5, 1)    — Page entrance animations
Out-quint: cubic-bezier(0.16, 1, 0.3, 1)    — Scroll reveals
```

### Durations
```
Fast:      200ms   — Hover, focus states
Normal:    350ms   — Standard transitions
Slow:      500ms   — Complex animations
Entrance:  700ms   — Page-load reveals
```

All motion respects `prefers-reduced-motion` (global rule in `tokens.css`'s `@layer base`).

### Z-Index Scale
`tokens.css` defines named stacking layers for new overlay-type components: `--z-index-dropdown` (1000), `--z-index-sticky` (1100), `--z-index-overlay` (1200), `--z-index-modal` (1300), `--z-index-popover` (1400), `--z-index-toast` (1500). Existing components mostly use raw Tailwind `z-10`/`z-20`/etc.

---

## 8. Components

See `docs/components.md` for the full API reference. Summary by folder:

| Folder | Components |
|--------|------------|
| `src/components/ui/` (atoms) | Button, AllergenBadge, DietaryBadge, CategoryIcon, ReviewBadge, AllergenHeaderLegend |
| `src/components/sections/` (composites) | HeroSection, FeatureCard, UserReviews, MenuItemCard, MenuBistroCard |
| `src/components/layout/` (shells) | NavBar, Footer, MobileBottomBar |

There is no third-party component library dependency — every component is hand-built `.astro`, no client-side JS framework.

---

## 9. Iconography

- Hand-written inline SVGs (nav icons, badges, category icons) — no icon library dependency.
- Stroke: `1.5px`–`2.5px` depending on component, matches iOS-style line icons.
- Color: inherits via `currentColor` / Tailwind text-color utilities.

---

## 10. Image Guidelines

- **Format:** Astro's `<Image />` component compiles to optimized formats via the Cloudflare adapter's `imageService: 'compile'`.
- **Remote images:** only `images.unsplash.com` is allowlisted in `astro.config.mjs`'s `image.remotePatterns` — used for exactly one hero fallback image.
- **Menu item photos:** stored under `public/images/menu/`, uploaded via Keystatic's image field.
- **Loading:** `loading="lazy"` on all images except the hero.
