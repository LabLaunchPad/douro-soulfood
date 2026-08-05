# Agent Instructions: D'ouro Soulfood

> **Read this file FIRST before any code changes.**
> This file tells AI coding agents (Claude Code, Cursor, Copilot, Gemini CLI) how to work in this repo.

---

## Project Identity

**What:** Restaurant website for D'ouro Soulfood Bistro, Salzburg, Austria
**Stack:** Astro 6 + Tailwind CSS v4 + Keystatic CMS + Cloudflare Pages
**Design:** Apple iOS-inspired light theme with Brazilian gold warmth
**Reference site:** talkintacos.net (structural/spacing reference only — D'ouro's own brand palette, fonts, and content)

---

## File Map

```
docs/
  prd.md              → Product requirements (READ for scope)
  design-system.md    → Colors, typography, motion, components (READ for styling)
  architecture.md     → Technical architecture decisions
  components.md       → Component API reference
  agent.md            → THIS FILE

src/
  components/
    ui/               → Reusable atoms: Button, AllergenBadge, DietaryBadge, CategoryIcon, ReviewBadge, AllergenHeaderLegend
    sections/         → Page composites: HeroSection, FeatureCard, UserReviews, MenuItemCard, MenuBistroCard
    layout/           → NavBar, Footer, MobileBottomBar
  content/
    menu-items/       → Keystatic collection, one JSON file per dish
    faq/               → Keystatic collection, one JSON file per Q&A
    settings/          → Keystatic singleton, site-wide contact/hours/social info
  lib/
    menu.ts            → Menu category config + filter/sort/group logic
  layouts/
    Base.astro         → Root layout with <head>, fonts, global CSS, nav/footer slots
  pages/
    index.astro        → Home page
    menu.astro         → Menu page
    about.astro         → About page
    catering.astro       → Catering page
    contact.astro         → Contact page (reads address/phone/hours from settings)
  styles/
    tokens.css          → Design tokens (@theme block)
    global.css           → Base styles, utility classes

public/
  images/               → Static images, logo, favicon
```

---

## Critical Rules

### 1. Design System Compliance
- **ALWAYS** use CSS custom properties from `src/styles/tokens.css`
- **NEVER** hardcode colors — use `var(--color-brand-gold)` etc. (the live brand palette; there is no `--color-douro-*` — that legacy alias map was removed)
- **ALWAYS** use the radius scale: `rounded-[var(--radius-md)]` or Tailwind classes
- **ALWAYS** use the easing curves: `transition: all var(--duration-normal) var(--ease-spring)`

### 2. Astro 6 Patterns
- `.astro` components only — this site ships **zero client-side JS framework**. There is no React integration; do not add one without discussing it first.
- Use Astro's built-in `<Image />` component for optimized images.
- Use content collections (`getCollection()`) for CMS-managed data — `menu_items` and `faq` are declared in `src/content.config.ts`. `settings` is read via a direct JSON import (`import siteSettings from '@/content/settings/default.json'`) since it's a singleton, not a collection.
- Node 22.12+ required — do NOT use APIs deprecated before that version.

### 3. Styling Rules
- Tailwind v4 utility classes preferred.
- Custom CSS only for complex animations or design tokens (`src/styles/tokens.css`, `global.css`).
- Mobile-first: always write base styles for mobile, then `md:` and `lg:`.
- Light theme is DEFAULT — warm cream surfaces, high-contrast espresso text.
- Glass effects via `.glass`, `.glass-light`, `.glass-gold`, `.glass-terracotta` utility classes.

### 4. Component Architecture
- Astro components only, no client-side hydration.
- Props interface typed with TypeScript.
- Use Astro's native `class:list={[...]}` directive for conditional/merged classes — this is the actual convention used throughout the codebase (there is no `cn()` helper; a previous one was removed as dead code).

### 5. Performance
- No React/client-JS framework overhead — this is a fully static/prerendered site.
- Images: always specify width/height, use `loading="lazy"` except the hero.
- Use `<link rel="preload">` for hero media where appropriate.

### 6. Accessibility
- Semantic HTML always (nav, main, section, article, footer, address for postal addresses).
- ARIA labels on interactive elements.
- Focus-visible styles on all interactive elements.
- Reduced motion: respect `prefers-reduced-motion` (see the global rule in `tokens.css`'s `@layer base`).

---

## Component Patterns

### Button
```astro
<a class="group relative flex items-center justify-center rounded-[var(--radius-sm)]
  bg-[var(--color-brand-gold)] text-[var(--color-brand-espresso)]
  font-semibold px-6 py-3
  transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]
  hover:bg-[var(--color-brand-gold-light)] hover:shadow-[var(--shadow-glow-gold)]">
  <span>Jetzt bestellen</span>
  <svg class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1">...</svg>
</a>
```
`src/components/ui/Button.astro` implements this pattern as a reusable component with `variant`/`size`/`arrow` props.

### Glass Card
```astro
<div class="glass rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)]">
  <slot />
</div>
```

### Section Container
```astro
<section class="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] px-4 md:px-8 max-w-7xl mx-auto">
  <slot />
</section>
```

---

## Git Conventions

- **Commits:** `feat:`, `fix:`, `style:`, `docs:`, `refactor:`, `chore:`
- **Branch:** `main` (production)
- **PR titles:** Match commit convention

---

## Deployment

```bash
# Local dev
pnpm dev              # wrangler pages dev on :8788 (Cloudflare Workers runtime, matches prod)
pnpm dev:astro        # plain astro dev on :4321 (faster iteration, no CF runtime emulation)

# Build
pnpm build            # astro build -> dist/

# Deploy
# Auto-deploys via Cloudflare Pages on push to main
```

---

## When In Doubt

1. Check `docs/design-system.md` for visual decisions.
2. Check `docs/prd.md` for scope/feature questions.
3. Check `keystatic.config.ts` before assuming a content shape — it's the CMS schema's source of truth, kept in sync by hand with `src/content.config.ts`.
4. Prefer Astro-native solutions over npm packages.
5. Keep it minimal — this is a restaurant site, not a SaaS.
