# Typography

## Font stack

| Role | Stack | Loading |
|---|---|---|
| Display (`--font-display`) | `'Fraunces', 'Georgia', 'Times New Roman', serif` | Self-hosted `.woff2` (`public/fonts/fraunces-*.woff2`), `@font-face` in `tokens.css`, preloaded in `Base.astro` |
| Body (`--font-body`) | `'DM Sans', 'Inter', system-ui, -apple-system, sans-serif` | Self-hosted `.woff2` (`public/fonts/dm-sans-*.woff2`), same mechanism |
| Mono (`--font-mono`) | `'SF Mono', 'Fira Code', 'Cascadia Code', monospace` | System stack only, no webfont — code/technical data, essentially unused on this content site |

Fonts are self-hosted, not loaded from Google — a deliberate fix for the GDPR/IP-transmission exposure established by the Munich Regional Court ruling (LG München, Az. 3 O 17493/20, 2022-01-20): dynamic Google Fonts loading transmits visitor IPs to Google without a legal basis. Verified via web research 2026-08-07, cross-checked against multiple independent legal sources.

Only two families ship (display + body) — clears the "limit font families" rule with room to spare.

## Type scale (defined, not yet adopted — see Verification below)

| Token | Size | Line-height | Intended role |
|---|---|---|---|
| `--text-label` | 0.75rem (12px) | 1.4 | eyebrows, badges, uppercase micro-copy |
| `--text-body-sm` | 0.875rem (14px) | 1.6 | captions, metadata |
| `--text-body-base` | 1rem (16px) | 1.6 | default paragraph text |
| `--text-body-lg` | 1.125rem (18px) | 1.6 | lead paragraphs, emphasized body |
| `--text-heading-sm` | 1.375rem (22px) | 1.25 | card titles, small subheadings |
| `--text-heading-md` | 1.75rem (28px) | 1.2 | section subheadings |
| `--text-heading-lg` | 2.25rem (36px) | 1.15 | section headings |
| `--text-display-sm` | 2.75rem (44px) | 1.1 | small hero / page titles |
| `--text-display-md` | 3.5rem (56px) | 1.05 | standard hero heading |
| `--text-display-lg` | 4.5rem (72px) | 1.0 | large hero heading |
| `--text-display-xl` | 5.5rem (88px) | 0.98 | maximal display, rarely used |

## Global rules

- Headings (`h1`–`h6`) get `-0.02em` letter-spacing and `1.15` line-height by default, set once in `tokens.css`'s `@layer base` — this applies regardless of which size utility is used.
- Body text defaults to `1.6` line-height.
- Real-content line-length target: 45–75 characters/line (`max-w-[52ch]`/`[48ch]`/`[45ch]` containers on prose blocks — the exact ch-value is tuned per-page because DM Sans's `ch` unit renders wider than a literal character count would suggest; verified empirically via the Impeccable detector, not assumed. Tuning was applied as a `~0.685×` scale factor from the naive value across `about.astro`, `catering.astro`, `menu.astro`, `datenschutz.astro`, `impressum.astro`, `OurStorySection.astro`, `FeatureCard.astro`, `MenuItemCard.astro`, `PhotoGrid.astro`, `UserReviews.astro`, `HeroSection.astro`).

## Verification finding (2026-08-07 audit)

**The scale above has zero adoption.** Grep against `src/pages` + `src/components`:

```
grep -rn "text-label\b|text-body-sm\b|text-body-base\b|..." → 0 matches
grep -rnoE '\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b' → 298 matches
```

Every heading and body-text size decision in the actual markup goes through Tailwind's raw utility scale instead, each combined ad hoc with its own responsive breakpoints (e.g. `text-xl md:text-6xl lg:text-7xl` on `menu.astro`'s h1). This is not a broken scale — the mapping from raw sizes to the intended semantic roles is mostly recoverable (raw `text-4xl md:text-6xl lg:text-7xl` clearly wants to *be* `--text-display-md`/`lg`/`xl`) — but it means:
- Two components with the same visual role can drift to different exact sizes over time with nothing to catch it.
- New components have no scale to reach for by default, so the raw-utility habit self-perpetuates.

### Fix (not yet applied — needs a phased, visually-verified pass)

Per component, one at a time: identify the raw-utility combination's intended semantic role, swap to the matching `--text-*` token via a `text-[length:var(--text-heading-md)] leading-[var(--text-heading-md--line-height)]` pattern (Tailwind v4 arbitrary-property syntax) or a small set of new named utility classes (`.text-display-md` etc.) generated from the same tokens, then visually diff before/after at both viewports per this repo's stress-test loop. Do **not** attempt as a single global find-replace — 298 call sites include enough context-dependent exceptions (hover-state colour changes bundled into the same class string, responsive breakpoints that don't map 1:1 to a single scale step) that a blind regex would introduce real regressions.
