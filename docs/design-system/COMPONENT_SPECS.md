# UI Component Specifications — D'ouro Soulfood Bistro

Developer handoff spec for all 24 components in `src/components/`, verified against source on 2026-09-29. Companion docs: `COMPONENT_REGISTRY.md` (inventory + audit history), `COMPONENT_GUIDELINES.md` (contract template), `MOTION_SYSTEM.md`, `COLOR_SYSTEM.md`, `TYPOGRAPHY.md`, `ACCESSIBILITY.md`.

Global rules (apply to every component below, not repeated per component): design tokens only (`var(--color-*)` etc. from `src/styles/tokens.css`; literal flag-emoji SVG fills exempt); `class:list={[...]}` for conditional classes, no `cn()`/`clsx`; Astro components, no client framework; `prefers-reduced-motion` kill-switch in `Base.astro` zeroes all transitions; minimum touch target `min-h-11`/`min-w-11` (44px) unless a component's spec says otherwise; focus-visible is always a 2px gold outline at 2px offset (`outline-brand-gold` or `outline-brand-gold-ink` on dark surfaces).

Motion vocabulary (from `tokens.css`): `--ease-spring: cubic-bezier(0.22, 1, 0.36, 1)` (interactive), `--ease-smooth`, `--ease-out-quart`, `--ease-out-quint`; `--duration-fast: 200ms`, `--duration-normal: 350ms`, `--duration-slow: 500ms`, `--duration-entrance: 700ms`.

---

## Atoms — `src/components/ui/`

### 1. Button (`ui/Button.astro`)

**1. Overview.** The single reusable action trigger site-wide. Renders `<a>` when `href` is set, `<button>` otherwise. Use for every CTA and secondary action. Do not recreate button styling inline elsewhere; do not use `primary` more than once per view (one focal action). **Accessibility:** semantically correct element choice (never `<div onclick>`); focus-visible gold outline on all variants; all sizes `min-h-12` (48px), clears WCAG 2.2 SC 2.5.8.

**2. Visual design.** Sizes: `sm` (`min-h-12 px-3 py-2 text-base gap-1.5`), `md` (`min-h-12 px-5 py-2.5 text-base gap-2`), `lg` (`min-h-12 px-6 py-3 text-base gap-2`); all `rounded-[var(--radius-sm)]` (10px), `font-semibold`. Color variants: `primary` — `bg-brand-gold` / espresso text; hover `bg-brand-gold-light` + `shadow-glow-gold`; active `bg-brand-gold-dark`. `secondary` — `border-border-default`, `text-text-secondary`; hover `bg-surface-elevated`, `text-text-primary`, `border-border-emphasis`; active `bg-surface-primary`. `ghost` — no border/fill; hover `text-text-primary` + `bg-surface-elevated`; active `bg-surface-primary`. Typography: inherits UI sans at `text-base`; no custom font. Iconography: optional `arrow` chevron (20×20, stroke 2, round caps) that translates 2px right and fades from 60% to full opacity on hover. Arrow intent (R-31): chevron means "browse on" (menu/gallery CTAs); order CTAs (Lieferando handoff) carry no arrow.

**3. States and variants.** Default / hover / active (color shift + `scale(0.98)` press confirm) / focus-visible (gold outline). No disabled, loading, or error states exist — the site has no async actions that need them; do not invent one.

**4. Interaction.** Hover color/elevation shift; press scale 0.98; arrow nudge on hover. Transition: `transition-all var(--duration-fast) var(--ease-spring)`. No responsive changes (sizes are fixed; layout around the button responds, not the button).

**5. Technical.** Props: `href?: string`, `target?: '_blank' | '_self'`, `rel?: string`, `variant?: 'primary' | 'secondary' | 'ghost'` (default `'primary'`), `size?: 'sm' | 'md' | 'lg'` (default `'md'`), `arrow?: boolean` (default `false`), `class?: string`. Slot: label content. Events: none (native anchor/button behavior). Dependencies: none.

### 2. AllergenBadge (`ui/AllergenBadge.astro`)

**1. Overview.** Single-letter EU allergen code chip (A/B/E/F/G/M/R) shown on menu cards. Use next to a dish name/price wherever allergens are listed. Do not use for dietary preferences (vegan etc.) — that's `DietaryBadge`. **Accessibility:** full bilingual label exposed via `title` and `aria-label` (`Allergen {code}: {label}`); the visible letter alone is never the only information.

**2. Visual design.** `inline-flex`, `px-1.5 py-0.5`, `text-[11px] font-bold tracking-wider`, `rounded-xs`. Colors are raw Tailwind amber (`bg-amber-500/20 text-amber-300 border-amber-500/40`) — un-tokenized by design for on-photo legibility; do not "fix" to tokens without re-verifying contrast on imagery. No icon.

**3. States and variants.** Static, non-interactive: no hover, focus, active, disabled, loading, or error states.

**4. Interaction.** None. Responsive: fixed size at all breakpoints.

**5. Technical.** Props: `code: string` (uppercased internally; unknown codes fall back to rendering the raw code). Events: none. Dependencies: none.

### 3. AllergenHeaderLegend (`ui/AllergenHeaderLegend.astro`)

**1. Overview.** Allergen key bar for the menu page. Without props it renders the global key (all codes + bilingual disclaimer); with an `allergens` array it renders only that section's codes (G and M normalized to `G/M`, deduplicated). Use once per menu page/section. Do not hand-write allergen keys inline in pages. **Accessibility:** plain text definitions, no interaction; flag icons decorative (`aria-hidden` via `FlagIcon`).

**2. Visual design.** Bistro-paper card: `bg-(--color-bistro-paper)`, `border-(--color-bistro-paper-border)`, `rounded-sm`, `p-3.5 sm:p-4`, `shadow-sm`. Header row: info icon + `ALLERGENE / ALLERGENS:` in serif bold `text-xs uppercase tracking-wider`, ink color. Code chips: mono black `text-[11px]` on banner background; definitions `text-xs font-sans`, strong text color. Disclaimer (global only): `text-xs italic leading-snug`, muted, DE + EN rows each prefixed with a `3.5×2.5` flag. Typography: serif for header/codes, sans for definitions.

**3. States and variants.** Static, non-interactive. Two content variants: global (with disclaimer) vs section-filtered (no disclaimer).

**4. Interaction.** None. Responsive: stacks vertically centered on mobile (`flex-col`), splits label-left/keys-right on `md`; disclaimer stacks until `lg`.

**5. Technical.** Props: `allergens?: string[]`, `class?: string`. Events: none. Dependencies: `FlagIcon`.

### 4. DietaryBadge (`ui/DietaryBadge.astro`)

**1. Overview.** Colored tag for dietary flags (vegan, vegetarian, gluten-free, spicy, halal, dairy-free) on menu cards. Use for diet/lifestyle attributes only; allergen codes belong in `AllergenBadge`. **Accessibility:** human-readable German description in `title` tooltip; text label always visible (color is never the only signal).

**2. Visual design.** `inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-xs border`. Per-tag tint pairs (all tokenized): vegan `brand-forest/20` bg + `brand-forest-light` text; vegetarian `brand-sage`; gluten-free `brand-gold/15` + `brand-gold-ink`; spicy terracotta-tinted (shares forest classes — see code) with a 12px flame SVG; halal `brand-cream/15` + `brand-cream-warm`; dairy-free `brand-forest-light/15`. Only `spicy` carries an icon (flame, `w-3 h-3`, `aria-hidden`).

**3. States and variants.** Six tag variants (see above). Static, non-interactive: no hover/focus/active/disabled/loading/error states.

**4. Interaction.** None. Responsive: fixed size.

**5. Technical.** Props: `tag: 'vegan' | 'vegetarian' | 'gluten-free' | 'spicy' | 'halal' | 'dairy-free'` (required), `class?: string`. Events: none. Dependencies: none.

### 5. ReviewBadge (`ui/ReviewBadge.astro`)

**1. Overview.** Compact third-party rating widget: stars + numeric score + review count (e.g. Google 4.7). Use in hero-adjacent trust spots and review contexts. Must never carry `aggregateRating` microdata — the score is a third-party aggregate, not our own claim (see `src/lib/seo/graph.ts`); the component is deliberately microdata-free. **Accessibility:** parent carries the full rating as `aria-label` (`{score} von {max} Sternen bei {source}`, de-AT-formatted count); star SVGs are `aria-hidden` (an unnamed `role="img"` would be worse).

**2. Visual design.** `inline-flex items-center rounded-sm px-3 py-1.5`, `bg-surface-card border-border-subtle`. Stars in `brand-gold-ink`, empty stars outlined in `text-tertiary`; half star via `clip-path: inset(0 50% 0 0)` fill (avoids SVG gradient ID collisions). Numeric score `font-semibold text-brand-gold-ink`; count `text-text-tertiary`. Sizes: `sm` (`text-xs`, 14px stars), `md` (`text-sm`, 16px stars), `lg` (`text-base`, 20px stars). Typography: inherited sans.

**3. States and variants.** Default; with `href` it becomes a link: hover `border-border-default`, focus-visible gold outline, `min-h-12` touch target on mobile (`md:min-h-0`). No active/disabled/loading/error states.

**4. Interaction.** Hover border shift only (`transition-colors var(--duration-fast) var(--ease-spring)`); external links open `_blank` with `noopener noreferrer`. Responsive: size prop + mobile min-height when linked.

**5. Technical.** Props: `rating: number` (required), `maxRating?: number` (default `5`), `reviewCount: number` (required), `source?: string` (default `'Bewertungen'`), `href?: string`, `size?: 'sm' | 'md' | 'lg'` (default `'md'`), `class?: string`. Half-star band: fraction 0.25–0.75. Events: none. Dependencies: none.

### 6. CategoryIcon (`ui/CategoryIcon.astro`)

**1. Overview.** Stroke-style vector icon lookup for the nine menu categories, replacing OS-inconsistent food emoji. Use wherever a category needs a glyph (menu nav, category cards). Do not add emoji anywhere this component covers. **Accessibility:** always `aria-hidden`; the adjacent label carries meaning.

**2. Visual design.** 24×24 viewBox, `fill-none stroke-currentColor stroke-width-2 round caps/joins`, inherits text color. Nine names: `appetizers`, `quesadillas`, `tacos`, `bowls`, `mains`, `seafood`, `sides`, `drinks`, `desserts`. Default size `w-6 h-6`, overridable via `class`.

**3. States and variants.** Static glyph set; states come from the parent (e.g. `group-hover:scale-110` on category cards). Unknown `name` renders nothing — pass a valid name.

**4. Interaction.** None of its own. Responsive: sized by consumer.

**5. Technical.** Props: `name: string`, `class?: string` (default `'w-6 h-6'`). Events: none. Dependencies: none.

### 7. FlagIcon + FlagSprites (`ui/FlagIcon.astro`, `ui/FlagSprites.astro`)

**1. Overview.** DE/UK flag glyphs via a shared `<symbol>` sprite: `FlagSprites` defines both flags once (included in `Base.astro`); `FlagIcon` references them with `<use href="#flag-{lang}">`. Use for bilingual menu labels. Never inline flag SVG markup at usage sites. **Accessibility:** always `aria-hidden`; the adjacent DE/EN text carries meaning. Literal flag hex fills are exempt from the tokens-only rule.

**2. Visual design.** DE: black/red/gold triband (`5×3` viewBox). UK: simplified Union Jack (`60×30`, clipped diagonals + cross). Display size set by consumer (typical `w-3.5 h-2.5` or `w-4 h-3`, `rounded-[2px] shadow-xs`).

**3. States and variants.** Two variants: `lang='de' | 'uk'`. Static, no states.

**4. Interaction.** None. Responsive: consumer-sized.

**5. Technical.** Props (`FlagIcon`): `lang: 'de' | 'uk'` (required), `class?: string`. `FlagSprites` takes no props; must be included once per page (via `Base.astro`). Events: none. Dependencies: `FlagIcon` requires the `FlagSprites` symbols in the DOM.

### 8. MapEmbed (`ui/MapEmbed.astro`)

**1. Overview.** GDPR two-click Google Maps embed. Renders a static placeholder (address + consent button); the real iframe is inserted only after an explicit click, so no request reaches Google (and no visitor IP is sent) before opt-in. Use for every map on the site. Do not embed Google iframes directly. **Accessibility:** trigger is a real `<button>` (`min-h-12`, gold focus ring); after swap, focus moves programmatically to the iframe (otherwise focus silently drops to `<body>`); iframe has `title` and `tabIndex=-1`; privacy note links to `/datenschutz#karten`.

**2. Visual design.** Placeholder: `bg-surface-elevated` panel, clock/pin SVG (`w-8 h-8`, `brand-gold-ink`, decorative), address label `text-sm text-text-secondary max-w-[30ch]`, gold consent button (`bg-brand-gold`, espresso text, hover `-light`, active `-dark`, `rounded-sm px-4 py-2 text-sm font-semibold`), privacy caption `text-xs text-text-tertiary`. Loaded map fills the container borderless. Sizing comes from the consumer's wrapper (`w-full h-full`).

**3. States and variants.** Two states: placeholder (default) and loaded iframe. No hover/focus/active beyond the consent button's standard gold-button behavior; no disabled/loading/error states (a missing `src` silently no-ops).

**4. Interaction.** Click consent → `replaceChildren(iframe)`; `loading="lazy"`, `referrerPolicy="no-referrer-when-downgrade"`, `allowFullscreen`. Multiple instances coexist (scoped by `data-map-embed`, no IDs). Responsive: fluid to container.

**5. Technical.** Props: `src: string` (embed URL, required), `title: string` (required, becomes iframe title), `addressLabel: string` (required), `class?: string`. Events: none exposed (internal one-shot click listener, CSP-hash-pinned inline script). Dependencies: none.

### 9. DistanceToUs (`ui/DistanceToUs.astro`)

**1. Overview.** Opt-in "how far am I" widget for Standort/contact blocks. One explicit button; no auto-prompt, no tracking, no storage — coordinates are read once, compared on-device against the restaurant POI via haversine, then discarded. Use under maps. Do not auto-request geolocation on page load. **Accessibility:** trigger is an underlined text button with gold-ink focus ring; result announced via `aria-live="polite"`; denial/unsupported degrades to a "Route planen" hint, never a dead end.

**2. Visual design.** Text-button style: `text-xs md:text-sm font-semibold`, secondary text → `brand-gold-ink` on hover, `underline underline-offset-2`. Result in `text-text-primary font-medium`; privacy caption `text-xs text-text-tertiary` ("Nur mit Ihrer Zustimmung…"). No box, no icon.

**3. States and variants.** Idle (button) → locating (`disabled`, label "Standort wird ermittelt …") → result (button removed, distance shown) or fallback message (button removed). Straight-line distance formatted de-AT (meters under 1 km, one decimal km above). No error styling — the fallback is plain text.

**4. Interaction.** One-shot click; `geolocation.getCurrentPosition` with 8s timeout. Responsive: text scales `xs→sm` at `md`.

**5. Technical.** Props: `lat?: number`, `lon?: number` (default to `RESTAURANT_LAT/LON` `47.807635 / 13.042574` from `@/lib/site`). Events: none exposed. Dependencies: `@/lib/site` constants; browser Geolocation API.

### 10. AllergenHeaderLegend — see §3 (listed with atoms; lives in `ui/`).

---

## Sections — `src/components/sections/`

### 11. HeroSection (`sections/HeroSection.astro`)

**1. Overview.** Full-bleed homepage hero: decorative background (dual mobile/desktop video with shared poster fallback, or static image), headline overlay, dual CTAs, optional slot content (trust badges, scroll hints). Use once, at the top of the homepage. The background layer is purely decorative (`aria-hidden`); heading, copy, and CTAs live in the content sibling and keep full semantics. **Accessibility:** semantic `<header>` + real `h1`; background hidden from AT; videos always `muted loop playsinline`, never `autoplay` attribute (script-driven start); reduced-motion visitors get the static poster, never video.

**2. Visual design.** Background: absolute-cover media + `bg-gradient-to-b from-black/50 via-black/40 to-black/60` contrast overlay. Content: `max-w-7xl`, bottom-anchored (`justify-end`, `pb-48` mobile / `pb-16` desktop), `max-w-2xl` column. Accent label: gold, semibold, `text-xs → xl → 2xl` responsive, display font. H1: white, semibold, `text-3xl → 5xl → 6xl`, display font, tight leading. Subheadline: `white/90`, `text-base → lg`, `max-w-[52ch]`. CTAs: primary gold w/ `shadow-glow-gold` (the one permitted glow — hunger action), secondary outlined; desktop row, hidden on mobile (bottom bar owns mobile conversion). Typography: Bricolage Grotesque display + DM Sans body.

**3. States and variants.** Media variants: dual-video (default, viewport-matched `src` set by script — never both fetched), or static-image fallback. No hover/focus/active beyond the inline CTA anchors' standard gold-button behavior; no disabled/loading/error states (poster covers every failure silently by design).

**4. Interaction.** Viewport-detection script assigns `src` to the matching video only; playback state tracked via `data-playback-state` (PLAYING / BLOCKED_AUTOPLAY / MEDIA_ERROR / NETWORK_ERROR / STALLED). Entrance: none on LCP content by design (paints immediately). Responsive: mobile video file + crop below `md`, desktop above; content padding shifts up on mobile.

**5. Technical.** Props: `accent: string`, `headline: string`, `subheadline?: string`, `videoSrc?: string` (default `/douroherovideo.mp4`), `videoSrcMobile?: string` (default `/douroheromobile.mp4`), `images?: HeroImage[]`, `poster?: string` (default shared 1280w WebP — must stay a static attribute, never script-assigned), `ctaPrimary: { label, href, external? }`, `ctaSecondary?: { label, href, external? }`. Slot: extra hero content. Events: none exposed. Dependencies: `Button` (imported; some CTA markup is inline anchors — keep visual parity if touching either), hero media assets.

### 12. FeatureCard (`sections/FeatureCard.astro`)

**1. Overview.** Generic image + text + CTA split card (catering Firmenevents/Private Feiern). Use for any 50/50 editorial feature. Do not use for menu dishes (that's `MenuItemCard`) or galleries (`PhotoGrid`). **Accessibility:** real `<h2>`, meaningful image `alt` (required prop), CTA is a `Button` component.

**2. Visual design.** Glass card (`glass rounded-xl shadow-lg overflow-hidden`), `flex-col md:flex-row`. Image half: `aspect-[4/3]` mobile, full-height cover `md:min-h-[300px]`, hover `scale-105` (`var(--duration-normal) var(--ease-out-quint)`). Content half: `p-8 md:p-14`, title `clamp(1.25rem,3vw,2.25rem)` semibold display tight, body `text-base text-text-secondary max-w-[52ch]`, CTA `Button primary lg arrow` full-width mobile / fit desktop. Optional full-bleed `background_image` behind the card. Outer rhythm is tight (`py-2 md:py-3`) — spacing belongs to the page, not the card.

**3. States and variants.** `reverse` prop mirrors image/content order on desktop. Image hover zoom is the only motion. No disabled/loading/error states.

**4. Interaction.** CTA via `Button`; image zoom on card hover (desktop pointers only in practice). Responsive: stacks on mobile, halves from `md`; `reverse` only affects `md+`.

**5. Technical.** Props: `title: string`, `description: string`, `image: { src: ImageMetadata; alt: string; width: number; height: number }` (all required), `cta?: { label: string; href: string }`, `reverse?: boolean` (default `false`), `background_image?: { … }`, `class?: string`. Events: none. Dependencies: `Button`, `astro:assets` Image.

### 13. OurStorySection (`sections/OurStorySection.astro`)

**1. Overview.** Founder-story band ("Wie D'ouro begann"). Full-bleed espresso background, narrow measure, founder byline. Use once for the Angela narrative. **Accessibility:** named `<section>` via `ariaLabel`; white/90 body text and gold eyebrow on espresso (verified pairs); avatar circle decorative.

**2. Visual design.** `bg-brand-espresso`, `max-w-3xl` centered column. Eyebrow: gold, semibold, `text-xs → sm`, uppercase tracking-wider. H2: white, semibold, `text-2xl → 3xl`, display font. Body: `text-base white/90 relaxed`, `max-w-[52ch]`. Founder row: 40px gold-tinted avatar circle with person glyph + name (`text-xs → sm semibold white`) / title (`text-xs white/70`).

**3. States and variants.** Static prose block; no variants, no interactive states.

**4. Interaction.** None. Responsive: eyebrow/name scale at `md`; measure fixed.

**5. Technical.** Props (all required strings): `eyebrow`, `title`, `text`, `founderName`, `founderTitle`, `ariaLabel`. Events: none. Dependencies: none.

### 14. UserReviews (`sections/UserReviews.astro`)

**1. Overview.** Testimonial marquee: infinite-scrolling guest-review cards under a centered heading. Use for social proof on home. Quotes are hardcoded with generic `Gast` source until reviews move to Keystatic with URL + date + consent — never attribute them to Google/TripAdvisor (unverifiable provenance must not wear a platform's name). **Accessibility:** persistent pause/play toggle (`aria-controls`, labeled in German) — hover-pause alone would fail WCAG 2.2.2 for keyboard/touch users; duplicated track B is `aria-hidden`; reduced-motion disables the marquee entirely; star groups are `role="img"` with per-card labels.

**2. Visual design.** Full-width section, centered header (eyebrow gold uppercase, H2 `text-2xl → 4xl` display, subtitle secondary). Track: masked edges (`marquee-mask` gradient), `py-4`. Cards: fixed `w-[300px] sm:w-[360px]`, `bg-surface-card border-border-subtle rounded-lg p-6 md:p-8`, 5 gold stars, italic body `text-base`, footer with 40px gold-tinted initials avatar + name (`text-sm semibold`) / source (`text-xs tertiary`). Card hover: border shift + `shadow-md`.

**3. States and variants.** Scrolling (default) / paused (toggle adds `reviews-paused`, label flips). Dataset is doubled per track (6 cards ≈ 2304px desktop) so the −50% loop never shows a gap. No disabled/loading/error states.

**4. Interaction.** 40s linear infinite `marquee` keyframes; hover pauses (desktop), toggle pauses persistently (all inputs). Card hover elevation (`transition-all var(--duration-fast) var(--ease-spring)`). Responsive: card width steps at `sm`; viewport full-bleed at all sizes.

**5. Technical.** Props: `title?: string`, `subtitle?: string`, `reviews?: Review[]` (defaults: 3 five-star quotes). Events: none exposed (internal toggle listener). Dependencies: none.

### 15. PhotoGrid (`sections/PhotoGrid.astro`)

**1. Overview.** Responsive photo grid for "Beliebte Gerichte" and "Galerie". Shows 8 tiles mobile, 9 desktop (9th hidden below `sm`). Two header variants: `center` (title + CTA button below) and `commerce` (left-aligned title with CTA docked header-right, one CTA per section guiding toward the menu). Optional persistent gold order button per tile — the honest quick-order pattern: always visible, never hover-only, so touch and keyboard get it too. **Accessibility:** real heading hierarchy; tile images carry descriptive `alt`; order buttons are real links with `aria-label` (`{alt} auf Lieferando bestellen`), `min-h-11 min-w-11`.

**2. Visual design.** Grid `grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4`, full-bleed (`px-2 md:px-4`, no max-width — imagery bleeds). Tiles: `aspect-[3/4] rounded-lg overflow-hidden shadow-md`, `bg-surface-card` while loading; image `object-cover`, hover `scale-105` (`var(--duration-normal) var(--ease-out-quart)`). Order button: gold circle bottom-right, `hover:scale-105 active:scale-95` (`var(--duration-fast) var(--ease-spring)`). Commerce CTA: `Button secondary sm arrow`. Eyebrow/title follow the standard section-header pattern (gold eyebrow, `text-2xl → 3xl` display H2).

**3. States and variants.** `variant: 'center' | 'commerce'` (default `'center'`); `orderHref` adds per-tile order buttons (external `_blank`). Tile hover zoom; order-button press scale. No disabled/loading/error states (card background covers image load).

**4. Interaction.** Hover zoom on tiles; order links exit to Lieferando. Responsive: 2→3 columns at `lg`; 9th tile `hidden sm:block`; commerce header stacks on mobile.

**5. Technical.** Props: `ariaLabel: string`, `eyebrow: string`, `title: string`, `description?: string`, `items: PhotoItem[]` (`{ src: ImageMetadata; alt: string; width: number; height: number }`), `cta?: { label: string; href: string }`, `variant?: 'center' | 'commerce'`, `orderHref?: string`. Events: none. Dependencies: `Button`, `astro:assets` Image.

### 16. FaqAccordion (`sections/FaqAccordion.astro`)

**1. Overview.** Native `<details>`-based FAQ accordion (home + catering). Renders nothing when `items` is empty. Page-specific FAQs are passed inline; the global Keystatic collection feeds only the homepage — do not mix the two. **Accessibility:** native `<details>/<summary>` gives free keyboard + screen-reader semantics; `summary` is `min-h-12` with gold focus ring; section carries `aria-label`; chevron `aria-hidden`.

**2. Visual design.** `max-w-4xl` centered column; rows separated by `border-b border-border-subtle`. Summary: `min-h-12 py-4`, `text-sm → base font-medium`, question left + chevron right, hover shifts text to `brand-gold-ink`. Answer: `pb-4`, `text-xs → sm`, `text-text-secondary relaxed`. Chevron: 16→20px, tertiary, rotates 180° when open (`group-open:rotate-180`).

**3. States and variants.** Closed / open (grid-rows `0fr→1fr` + opacity fade, `200ms var(--ease-out-quint)`). No disabled/loading/error states.

**4. Interaction.** Native toggle; answer bridge animation respects the global reduced-motion kill-switch. Responsive: type scales at `md`.

**5. Technical.** Props: `items: { question: string; answer: string }[]` (required), `ariaLabel: string`, `eyebrow: string`, `title: string`. Same array feeds `faqNode()` JSON-LD — prose and schema share one source so they cannot drift. Events: none. Dependencies: none.

### 17. MenuItemCard (`sections/MenuItemCard.astro`)

**1. Overview.** One menu dish, in two layouts from one props shape: full-bleed photo card when `imageSrc` exists, compact text card otherwise — so photo-less items never render empty placeholder boxes. Use for all menu listings. Do not add one-off layout variants in pages; extend props instead. **Accessibility:** whole card is one stretched link (`absolute inset-0`) to the order platform with `aria-label` (`Jetzt {name} bestellen`); photo variant uses white text over a black-gradient + blur scrim (verified against the darkest stop); text variant uses `text-primary`/`brand-gold-ink` on card surface; unavailable items stay visible with a banner (discoverable, not hidden).

**2. Visual design.** Photo variant: `aspect-square min-h-[320px] rounded-3xl shadow-lg`, image cover + `bg-gradient-to-t from-black/95 via-black/50` + 70%-height blur scrim, content pinned bottom (`p-4 md:p-5`): name `text-base → lg bold white display` (gold on hover), price chip gold-on-black `border-brand-gold/30`, description 2-line clamp at 85% white, add-on chips + `DietaryBadge`/`AllergenBadge` row above a `white/10` divider; prep-time and `Empfehlung` pills float top (`black/75` + gold/90). Text variant: `rounded-2xl p-5 min-h-[170px] bg-surface-card border-subtle shadow-md`, name primary, price chip on `surface-elevated`, same badge footer. Prices formatted de-AT EUR from cents; dual non-alcoholic/alcoholic prices join with `/`.

**3. States and variants.** `available=false` → `opacity-60` + "Nicht verfügbar" banner (photo) — still linked, still readable. `featured=true` → gold `Empfehlung` badge. Hover: lift `-translate-y-0.5` + shadow deepen + image `scale-105` + (photo) scrim darkens to `black/50`. No disabled/loading/error states (unavailable is a content state, not a control state).

**4. Interaction.** Stretched-link card → Lieferando (`_blank`). All motion `var(--duration-fast) var(--ease-spring)` (image zoom `--duration-normal --ease-out-quint`). Responsive: padding/type step at `md`; photo card stays square.

**5. Technical.** Props: `name`, `description`, `priceInCents: number` (required); `dietary?: DietaryTag[]`, `allergens?: string[]`, `prepTime?: string`, `addOns?: { label; price }[]`, `priceVariants?: { nonAlcoholic?; alcoholic? }`, `available?: boolean` (default `true`), `featured?: boolean` (default `false`), `imageSrc?: ImageMetadata | string`, `imageAlt?: string`, `imageWidth/Height?: number` (default `400/300`), `class?: string`. Events: none. Dependencies: `DietaryBadge`, `AllergenBadge`, `orderUrl` from `@/lib/site`, `astro:assets` Image. Z-order contract: link `z-30` > badges `z-30 pointer-events-none` > content `z-20` = banner `z-20` > scrim `z-15` > gradient `z-10` > image `z-0`.

### 18. MenuBistroCard (`sections/MenuBistroCard.astro`)

**1. Overview.** Bistro-paper-styled menu row for themed category banners (Entradas, Bebidas sub-categories): horizontal card with thumbnail, bilingual DE/EN descriptions with flags, price badge, allergen codes. Use only inside bistro-themed menu sections; standard listings use `MenuItemCard`. **Accessibility:** stretched link with `aria-label` (`Jetzt {name} bestellen`) and a real gold-ink focus ring (fixed 2026-09-27 — was `outline-none`); flags decorative; bilingual text is plain content.

**2. Visual design.** Row card: `rounded-sm p-3.5 → p-4`, `bg-(--color-bistro-paper)` + paper-border, `shadow-sm`. Thumbnail: `w-24 h-24 → md:w-36 md:h-36 lg:w-40 lg:h-40` square, right side on mobile (`order-2`), left on desktop. Name: serif black uppercase `text-sm → lg`. Price badge: serif extrabold on banner bg (`text-sm → lg`); dual prices stack with DE/EN "ohne / mit Alkohol" captions + flags. Descriptions: DE strong + EN muted, `text-xs → sm`, flag-prefixed. Add-ons: amber-100 chips; allergens: bold serif amber-900 code string. Known gap: `text-[11px]` captions and raw `amber-*`/`stone` colors predate the token scale (see `COLOR_SYSTEM.md`) — do not propagate the pattern.

**3. States and variants.** `available=false` → `opacity-60`. Hover: shadow deepen + border shifts to taupe + thumbnail `scale-105` (300ms ease-out). No disabled/loading/error states.

**4. Interaction.** Stretched-link card → `orderUrl` (`_blank`). Responsive: image side swaps at `md`; gaps/padding step at `sm`/`md`.

**5. Technical.** Props: `name`, `description`, `priceInCents: number` (required); `descriptionEn?`, `priceVariants?`, `prepTime?/prepTimeEn?`, `allergens?: string[]`, `addOns?: { label; price }[]`, `imageSrc?: ImageMetadata | string`, `imageAlt?`, `available?` (default `true`), `class?`. Events: none. Dependencies: `FlagIcon`, `orderUrl`, `astro:assets` Image.

---

## Layout — `src/components/layout/`

### 19. Section (`layout/Section.astro`)

**1. Overview.** Single owner of section rhythm: vertical padding, horizontal container, landmark naming. Use to wrap every page section. Extra classes are for decoration only (borders, backgrounds) — never spacing overrides; padding (not margins) separates sections so backgrounds bleed without collapsing. **Accessibility:** every section should pass `ariaLabel` (named landmark); optional `id` for anchor jumps (pair with `scroll-mt-28` to clear the fixed nav).

**2. Visual design.** Two modes, one spacing system: `py-section-mobile (40px) md:py-20 (80px)`, `max-w-7xl`, `px-4 md:px-16`. `contained` (default): the `<section>` itself is the container. `full`: full-bleed section with the container nested inside, so content edges align with contained sections. Emits `data-section` + `data-section-mode` hooks.

**3. States and variants.** Layout modes only; no interactive states. Component-owned sections (`PhotoGrid`, `UserReviews`, `FaqAccordion`) stay self-contained and do not need this wrapper.

**4. Interaction.** None. Responsive: padding/gutter step at `md` — the only responsive rule, owned here.

**5. Technical.** Props: `ariaLabel?: string`, `id?: string`, `mode?: 'contained' | 'full'` (default `'contained'`), `class?: string`. Slot: section content. Events: none. Dependencies: none.

### 20. NavBar (`layout/NavBar.astro`)

**1. Overview.** Persistent top navigation, one instance in `Base.astro`, slotted per page. Floating white pill over the hero at top; solid warm-white bar once scrolled (`scrollY > 20`). Desktop: inline links + outlined Reservierung + gold order CTA. Mobile: logo + light capsule (Speisekarte link + hamburger) opening `MobileNavDrawer` (`z-[70]`, above the bar's `z-50`). Never instantiate a second NavBar. **Accessibility:** hamburger has `aria-label` + live `aria-expanded`; skip link (`z-[100]`) sits above the bar — verified by a 40-element keyboard-tab test; logo link labeled "D'ouro Soulfood Homepage" (logotype exempt from text-contrast rules).

**2. Visual design.** Fixed shell `top-0 inset-x-0 z-50`. Pill: `rounded-full bg-white/95 backdrop-blur-md border-black/5 shadow-xl`, links `text-sm bold uppercase tracking-wider` primary → gold-ink hover; Reservierung outlined `rounded-sm`; order CTA gold extrabold uppercase with `shadow-md → lg` + `scale-[1.02]` hover. Scrolled: `bg-surface-primary/95` + bottom border + `shadow-md` + 12px blur; pill dissolves (transparent, borderless, shadowless). Mobile capsule: `bg-surface-card border-subtle rounded-md shadow-md`; Speisekarte link `min-h-12 text-xs extrabold`; hamburger `w-11 h-11` with three 20×2px bars. Logo `h-10 md:h-12`, hover `scale-105`.

**3. States and variants.** At-top vs scrolled (script-toggled `data-scrolled`). Link/CTA hover-active-focus per standard gold-button + nav-link behavior. No disabled/loading/error states.

**4. Interaction.** Passive scroll listener flips the shell state (300ms ease-out transitions). Hamburger delegates to `MobileNavDrawer` by element ID. Responsive: pill at `lg+`, capsule below.

**5. Technical.** Props: `links?: NavLink[]` (default `NAV_LINKS`), `ctaPrimary?: { label; href }` (default order URL), `ctaSecondary?: { label; href }` (default Reservieren → `/contact`), `class?: string`. Slot: passthrough content. Events: none exposed. Dependencies: `MobileNavDrawer`, `@/lib/nav`, `@/lib/site`, `@/lib/i18n/ui`, brand logo asset.

### 21. MobileNavDrawer (`layout/MobileNavDrawer.astro`)

**1. Overview.** Full-screen mobile navigation overlay, opened by NavBar's hamburger. Use only via `NavBar` (it talks to `#mobile-menu-btn` by ID across component boundaries — Astro doesn't scope scripts to subtrees). **Accessibility:** `role="dialog" aria-modal`, `aria-hidden` + `inert` when closed; opening moves focus to the close button, closing returns it to the hamburger; Escape closes; Tab is trapped inside while open; body scroll locks.

**2. Visual design.** `fixed inset-0 z-[70] lg:hidden`, `bg-brand-espresso/98 backdrop-blur-2xl`, top-left list. Inner top bar mirrors NavBar's row padding so logo/button don't shift on open; capsule holds Speisekarte link (`min-h-12 text-xs extrabold`) + `w-11 h-11` close X. Links: `text-2xl bold uppercase tracking-wide` white → gold hover, `min-h-11`, generous `gap-6` with bottom padding for scroll clearance.

**3. States and variants.** Closed (`opacity-0 pointer-events-none`, inert) / open (fade in, 300ms). No other states.

**4. Interaction.** Fade only — no slide or stagger by design (functional chrome; restraint per animation audit). Focus trap + Escape + scroll-lock as above. Responsive: mobile only (`lg:hidden`).

**5. Technical.** Props: `links: NavLink[]` (required). Events: none exposed (internal open/close/keyboard listeners, CSP-hash-pinned script). Dependencies: `@/lib/i18n/ui` (aria-labels), brand logo asset.

### 22. MobileBottomBar (`layout/MobileBottomBar.astro`)

**1. Overview.** Sticky mobile (< `md`) conversion bar: call + order buttons, flush to the viewport bottom. Use globally via layout; never duplicate its CTAs mid-page on mobile. **Accessibility:** `<nav aria-label="Schnellzugriff: Anrufen und Bestellen">`; both targets `min-h-11` with gold focus rings; phone icon decorative (motion disabled under reduced-motion).

**2. Visual design.** Full-width square bar: `fixed bottom-0 z-[60]`, `bg-brand-espresso/98 backdrop-blur-md`, top hairline, `p-3` + safe-area bottom padding. Call button: terracotta fill, cream text; order button: gold fill, espresso text + `shadow-glow-gold` (the permitted hunger-action glow). Both `flex-1`, 18px glyphs, `text-sm bold uppercase tracking-wider`, `rounded-sm`. Phone glyph is static by design (infinite `phone-ring` wiggle removed 2026-09-29 — persistent attention loop with no state-change purpose).

**3. States and variants.** Visible / hidden-on-scroll-down (`data-hidden` → `translateY(100%)`, always visible at page top). Button hover/active shift to `-light`/`-dark` token shades. No disabled/loading/error states.

**4. Interaction.** Scroll-direction script hides on scroll down, reveals on scroll up (`transform var(--duration-fast) var(--ease-spring)`; `transition: none` under reduced-motion). Footer reserves `pb-24` mobile clearance so the bar never covers footer content. Responsive: `md:hidden` — desktop has no equivalent (NavBar owns desktop conversion).

**5. Technical.** Props: none (reads `settings`, `phoneHref`, `orderUrl` from `@/lib/site`). Events: none exposed. Dependencies: `@/lib/site`.

### 23. LanguageSwitcher (`layout/LanguageSwitcher.astro`)

**1. Overview.** Locale switcher that renders nothing while `LIVE_LOCALES` holds fewer than two entries — deliberate, not a placeholder: a one-option switcher is a control that does nothing. No consumer guards the import; adding `en` to `LIVE_LOCALES` activates it with zero call-site changes. **Accessibility:** `<nav aria-label="Sprache wählen">` with `hreflang` links when live.

**2. Visual design.** Inline flex row, `text-sm` links. Currently unrendered; style to site nav-link conventions when activating.

**3. States and variants.** Hidden (current) / visible (future multi-locale). No interactive states beyond standard links.

**4. Interaction.** Plain locale links (`/{code}/`). Responsive: none defined.

**5. Technical.** Props: none. Reads `LIVE_LOCALES` + `LOCALE_REGISTRY` from `@/lib/i18n/locales`. Events: none. Dependencies: `@/lib/i18n/locales`.

### 24. Footer (`layout/Footer.astro`)

**1. Overview.** Site footer: floating card (logo + tagline, nav, order CTA) over an espresso base, divider + legal links inside the card, social/copyright/location bar below. One instance per page via slot. **Accessibility:** `<footer>` landmark; nav/legal/social links are real anchors with gold hover + focus rings; logo duplicates the header link target intentionally (footer convention).

**2. Visual design.** Base `bg-brand-espresso border-t white/10`, `pt-8 pb-24 md:pb-12` (mobile bottom padding clears `MobileBottomBar`). Card: `bg-surface-card border-subtle rounded-2xl p-6 → p-10 shadow-xl`. Top row stacks mobile, spreads `lg` (logo/contact block `max-w-sm`: tagline, address, phone, social; two nav link columns `grid-cols-2`; gold order CTA). Bottom bar: legal links left, © center, "Design & Developed by Lab LaunchPad" right, hairline top border. Meta text uses raw `neutral-*`/`zinc-*`/`white/70` tones (known gap, see `COLOR_SYSTEM.md`). Social icons: `p-3 tertiary → gold-ink` hover on the light card. Legal row `text-xs`.

**3. States and variants.** Link hover/focus only. All content overridable via props but defaults come from the site SSOT (`@/lib/site`, `FOOTER_NAV_LINKS`).

**4. Interaction.** None beyond links. Responsive: column → row at `lg`; card padding steps `sm`/`md`; bottom padding drops at `md` (no bottom bar on desktop).

**5. Technical.** Props (all optional with SSOT defaults): `tagline?`, `links?: FooterLink[]`, `cta?: { label; href }`, `address?: string[]`, `phone?`, `phoneHref?`, `legalLinks?` (Impressum/Datenschutz), `copyrightName?` (year auto). Events: none. Dependencies: `Button`, `@/lib/site`, `@/lib/nav`, brand logo asset.
