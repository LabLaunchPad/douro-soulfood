# Typography

Full narrative and the realignment fix history: `docs/design-system/TYPOGRAPHY.md`. Summary against this standard's requirements:

## Type scale (real, verified in use — not aspirational)

298 real call sites across `src/` collapse into 17 distinct, consistent size combinations built on Tailwind's native scale. The custom `--text-*` tokens (`tokens.css`) were realigned 2026-08-07 to equal these real values exactly (previously invented mismatched numbers with zero adoption):

| Role | Token | Px | Tailwind step |
|---|---|---|---|
| Caption/label | `--text-label` | 12 | `text-xs` |
| Body small | `--text-body-sm` | 14 | `text-sm` |
| Body | `--text-body-base` | 16 | `text-base` |
| Body large | `--text-body-lg` | 18 | `text-lg` |
| Title small | `--text-title-sm` | 20 | `text-xl` |
| Title | `--text-title-md` | 24 | `text-2xl` |
| Title large / Headline small | `--text-title-lg` / `--text-heading-sm` | 30 | `text-3xl` |
| Headline | `--text-heading-md` | 36 | `text-4xl` |
| Headline large | `--text-heading-lg` | 48 | `text-5xl` |
| Display small | `--text-display-sm` | 60 | `text-6xl` |
| Display | `--text-display-md` | 72 | `text-7xl` |

## Rules verified

- Two font families only (Fraunces display, DM Sans body) — clears "limit font families" with margin.
- Consistent hierarchy: verified via a real 7-route visual audit — headings are always visually distinct from body text, never ambiguous.
- Predictable weights: `font-bold`/`font-semibold`/`font-extrabold` used consistently for emphasis, `font-medium`/regular for body — no arbitrary weight values found.
- No arbitrary font sizes remain outside the documented scale (verified via grep — every `text-[Npx]` arbitrary-value instance found this session was a deliberate undersized-text bug, already fixed to the 11-12px floor).
- Readable line height: headings default to `1.15`, body to `1.6`, both set once globally in `tokens.css`'s `@layer base`.

Self-hosted fonts (GDPR fix, see `docs/design-system/TYPOGRAPHY.md` for the LG München ruling citation) — no request to Google's servers.
