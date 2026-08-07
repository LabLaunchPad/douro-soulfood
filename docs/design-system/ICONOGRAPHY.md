# Iconography

## Style

Hand-written inline SVGs — no icon library dependency (Lucide, Heroicons, etc. were removed from the project as unused, per an earlier cleanup pass; do not reintroduce one without a real need).

## Rules

- Stroke width: `1.5px`–`2.5px` depending on component (thinner for large decorative icons, thicker for small functional icons like the hamburger menu) — matches an iOS-style line-icon feel.
- Color: always via `currentColor` + a Tailwind text-color utility, never a hardcoded fill — icons inherit their container's color token, so hover/active states work automatically.
- Category icons (`CategoryIcon.astro`) and flag icons (`FlagIcon.astro`) are componentized, not copy-pasted inline SVG per use site.
- Flag icons use a shared `<symbol>`/`<use>` sprite (`FlagSprites.astro`, rendered once in `Base.astro`) rather than duplicating the same SVG path markup at every use site — this was a real DOM-size fix earlier in this project's history (28% DOM-size reduction on `/menu`).

## Sizing

Icons are sized via Tailwind `w-*`/`h-*` utilities matched to their context (`w-4 h-4` inline with small text, `w-6 h-6` for standalone nav/toggle icons, `w-8 h-8` for larger decorative icons). No dedicated icon-size token scale exists yet — sizes are chosen per-instance to match the adjacent text/touch-target size. This is low-risk as-is (icon sizing is naturally coupled to its immediate context) but could be formalized into `--icon-size-sm/md/lg` tokens if icon usage grows.
