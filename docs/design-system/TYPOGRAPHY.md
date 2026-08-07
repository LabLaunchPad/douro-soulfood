# Typography

## Font stack

| Role | Stack | Loading |
|---|---|---|
| Display (`--font-display`) | `'Fraunces', 'Georgia', 'Times New Roman', serif` | Self-hosted `.woff2` (`public/fonts/fraunces-*.woff2`), `@font-face` in `tokens.css`, preloaded in `Base.astro` |
| Body (`--font-body`) | `'DM Sans', 'Inter', system-ui, -apple-system, sans-serif` | Self-hosted `.woff2` (`public/fonts/dm-sans-*.woff2`), same mechanism |
| Mono (`--font-mono`) | `'SF Mono', 'Fira Code', 'Cascadia Code', monospace` | System stack only, no webfont — code/technical data, essentially unused on this content site |

Fonts are self-hosted, not loaded from Google — a deliberate fix for the GDPR/IP-transmission exposure established by the Munich Regional Court ruling (LG München, Az. 3 O 17493/20, 2022-01-20): dynamic Google Fonts loading transmits visitor IPs to Google without a legal basis. Verified via web research 2026-08-07, cross-checked against multiple independent legal sources.

Only two families ship (display + body) — clears the "limit font families" rule with room to spare.

## Type scale (realigned 2026-08-07 — see history below)

| Token | Size | Tailwind equivalent | Line-height | Role |
|---|---|---|---|---|
| `--text-label` | 0.75rem (12px) | `text-xs` | 1.4 | eyebrows, badges, uppercase micro-copy — 46 real uses |
| `--text-body-sm` | 0.875rem (14px) | `text-sm` | 1.5 | captions, metadata — 26 real uses |
| `--text-body-base` | 1rem (16px) | `text-base` | 1.6 | default paragraph text — 4 real uses |
| `--text-body-lg` | 1.125rem (18px) | `text-lg` | 1.6 | lead paragraphs, emphasized body — 12 real uses |
| `--text-title-sm` | 1.25rem (20px) | `text-xl` | 1.3 | card/section titles — 9 real uses |
| `--text-title-md` | 1.5rem (24px) | `text-2xl` | 1.25 | larger titles, eyebrow+title pairs — 2 real uses |
| `--text-title-lg` | 1.875rem (30px) | `text-3xl` | 1.2 | title/headline boundary |
| `--text-heading-sm` | 1.875rem (30px) | `text-3xl` | 1.2 | subheadings |
| `--text-heading-md` | 2.25rem (36px) | `text-4xl` | 1.15 | section headings |
| `--text-heading-lg` | 3rem (48px) | `text-5xl` | 1.1 | large section headings |
| `--text-display-sm` | 3.75rem (60px) | `text-6xl` | 1.05 | page/hero titles |
| `--text-display-md` | 4.5rem (72px) | `text-7xl` | 1.0 | large hero heading |

## Global rules

- Headings (`h1`–`h6`) get `-0.02em` letter-spacing and `1.15` line-height by default, set once in `tokens.css`'s `@layer base` — this applies regardless of which size utility is used.
- Body text defaults to `1.6` line-height.
- Real-content line-length target: 45–75 characters/line (`max-w-[52ch]`/`[48ch]`/`[45ch]` containers on prose blocks — the exact ch-value is tuned per-page because DM Sans's `ch` unit renders wider than a literal character count would suggest; verified empirically via the Impeccable detector, not assumed. Tuning was applied as a `~0.685×` scale factor from the naive value across `about.astro`, `catering.astro`, `menu.astro`, `datenschutz.astro`, `impressum.astro`, `OurStorySection.astro`, `FeatureCard.astro`, `MenuItemCard.astro`, `PhotoGrid.astro`, `UserReviews.astro`, `HeroSection.astro`).

## History: how the "0% adoption" finding was actually resolved

The 2026-08-07 audit's first pass found the custom `--text-*` scale had zero adoption (298 raw Tailwind-utility call sites instead). Investigating *why* revealed the real problem: the custom scale's values (22/28/44/56/88px) were invented and never matched any size actually used in the codebase — the real, organically-emerged usage pattern is Tailwind's own native scale, applied with real discipline (298 instances collapse into just 17 distinct, consistent size combinations, e.g. `text-lg md:text-xl` used identically 17 times, `text-sm md:text-base` used 23 times).

**The fix applied**: realigned every `--text-*` token to equal the Tailwind step it was supposed to represent (documented above), rather than migrating 298 markup call sites to match invented values. This means `text-xl` and the new `--text-title-sm` token render identically — **zero visual change**, verified by construction (every new token value equals the pre-existing Tailwind step) and confirmed via `pnpm build` + a full visual re-audit (screenshots, all 7 routes, before/after). New/refactored components should reach for the named token going forward; existing raw-Tailwind markup is not "wrong," it's the reference the tokens now describe accurately.

Two token names from the original (unaligned) scale were retired since nothing in the real 17-combination set needed them: the old `--text-display-lg` (72px) and `--text-display-xl` (88px) steps. The new `--text-display-md` (72px) now covers the real large-hero use case that the old `--text-display-lg` was aiming for, just at the correct value. Confirmed zero source references to the retired names before removal.
