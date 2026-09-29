# Design System Audit — D'ouro Soulfood Bistro (2026-09-29)

Repo-scaled execution of the AI-Native Design System playbook. Calibration first: this is a 7-page static restaurant site maintained by one owner, not a product org. There is no multi-team rollout, no Figma library, no "months" program. What follows is the same four phases cut to what this repo can actually absorb: audit with file:line evidence, token gaps, a prioritization matrix over the real 24 components, and a rollout plan measured in commits, not quarters.

Context: Astro 7 + Tailwind v4 + Keystatic, Cloudflare Pages. Audience: restaurant guests (mobile-first, de-AT, Sie-form). Aesthetic: Sunlit Cantina Editorial (variance 6 / motion 4 / density 5). Tokens live in `src/styles/tokens.css`; component contracts in `COMPONENT_SPECS.md`.

## 1. Audit — what repeats, what conflicts, what to keep

### P0 — Conflicts (fix first; these charge inconsistency rent daily)

1. **Gold CTA styling duplicated in 4 places outside `Button`.** `HeroSection.astro:156-159` + secondary `:168-173`, `NavBar.astro:95-97`, `MapEmbed.astro:51-54` re-declare the gold triple by hand; `PhotoGrid.astro:99` re-declares gold fill for order buttons. The registry claim "every button-like element routes through Button" is hereby corrected: these five are ratified divergences, not violations. **Verdict 2026-09-29: document, don't route — attempted and reverted.** Routing through `Button`'s `class` prop cannot reproduce them: Tailwind v4 emits same-property utilities in ascending-value order, so `Button`'s base wins every override that sorts earlier (`text-sm` loses to `text-base`, `font-medium` loses to `font-semibold`, `py-2` loses to `py-2.5` — verified in built `dist/client/_astro/*.css`). The alternatives are `!important` overrides (no precedent in this codebase; sets a copyable bad example) or extending `Button`'s API (touches every consumer). Divergence reasons, now recorded: hero/nav CTAs need `text-sm`/`font-extrabold`/`uppercase` outside Button's 3-size scale; MapEmbed's consent button carries a `data-map-embed-trigger` JS hook Button can't inject; PhotoGrid's order control is an icon-only circle, a pattern Button doesn't offer. Drift guard going forward: these five may gain `Button`'s interactive states (e.g. `active:scale`) by hand when Button changes — check them on any Button edit.
2. **Two amber dialects — fixed 2026-09-29.** `AllergenBadge`, `MenuItemCard`, `MenuBistroCard` used raw `amber-*`; now `brand-flare`/`bistro-spice` roles in `tokens.css`, values identical, zero raw `amber-*`/`stone-*`/`zinc-*`/`neutral-*` utilities left in components. `COLOR_SYSTEM.md` amber bullet updated.
3. **`text-[11px]` in 12 places — fixed 2026-09-29.** Promoted to `--text-micro` (`0.6875rem`, size only, inherits line-height like the arbitrary values it replaced) with a "labels only, never body" rule; all 12 sites migrated, utility verified emitted.
4. **Bistro-paper second token syntax — documented 2026-09-29.** `DESIGN_TOKENS.md` gained a "Token reference syntax" section: named utilities are the only legal form for new code; `bg-(--color-*)` is grandfathered in `MenuBistroCard`/`AllergenHeaderLegend`, cosmetic-only migration unscheduled.

### P1 — Repeats worth consolidating

5. **Card-hover physics — frozen 2026-09-29.** Two patterns written into `MOTION_SYSTEM.md`, no code restyle (all existing hovers already conform): commerce cards lift + deepen shadow, imagery zooms without lift, badges/links shift border/color only.
6. **Section headers — `SectionHeader` atom built 2026-09-29** (`ui/SectionHeader.astro`); `FaqAccordion` + `PhotoGrid` center variant migrated byte-identical. `UserReviews` (4xl display title + pause block), `OurStorySection` (dark band), and PhotoGrid `commerce` (CTA row) recorded as intentional non-consumers in the atom's anti-usage.
7. **`formatPrice` deduplicated 2026-09-29** into `src/lib/format.ts` (+ `formatDualPrice`), both cards migrated, pinned by `scripts/checks/verify-format.mjs` (`pnpm check:format`, 6 assertions).
8. **Dead motion + `phone-ring` removed 2026-09-29.** Unreferenced `.animate-fade-up`/`.stagger` deleted from `global.css`; `phone-ring` keyframes + class removed from `MobileBottomBar` (static icon + `:active` shift remain).

### Keep — what already works

Tokens-only discipline (only exempt hex: flag fills, `theme-color` meta), `class:list` convention, one JSON-LD block invariant, two-click MapEmbed, native `<details>` FAQ, sprite-based flags, `Section` owning all rhythm, SSOT site constants in `@/lib/site`. The system is closer to done than to broken: ~2 days of P0/P1 fixes, not a rebuild.

## 2. Tokens — gap analysis against the playbook's six categories

| Category | Have | Missing / verdict |
|---|---|---|
| Color: brand + neutrals | Full `brand-*`, `surface-*`, `text-*`, `border-*` scales + bistro-paper set | **Missing: semantic success/error/warning/info.** Verdict: don't add — no forms, no async actions, no user input to validate. Revisit only if a form ships. |
| Color: dark mode | Nothing | **Verdict: don't add.** Single warm theme is the brand; espresso sections already provide dark bands where needed. |
| Typography | Display (Bricolage Grotesque) + body (DM Sans) + mono/serif accents in bistro context | **Missing: `--text-micro` (11px, §P0-3).** Scale, weights, leading otherwise complete. |
| Spacing | `py-section-mobile/md:py-20` rhythm, `max-w-7xl`, `px-4/md:px-16` via `Section` | Complete for this site's needs; no raw spacing scale required beyond Tailwind defaults. |
| Radius | `rounded-xs/sm/md/lg/xl/2xl/3xl` in use with SSOT notes (`rounded-sm` = 10px) | Complete; add the SSOT values to `DESIGN_TOKENS.md` if not already there. |
| Shadow | `shadow-sm→2xl` + custom `shadow-glow-gold` (gated by R-31: hunger action only) | Complete; glow gate is thertifact to preserve. |
| Breakpoints | `sm/md/lg` + `100svh`/`100vh` fallbacks, safe-area handling | Complete. |

Naming convention (already in force, restated for handoff): `--color-{brand,surface,text,border}-*` semantic roles, never raw hues in components (amber exception pending §P0-2); `--ease-*` / `--duration-*` motion; `--radius-*`; `--text-*` type. New tokens must ship with a usage rule, not just a value.

## 3. Foundations + prioritization matrix

Foundations (button, input) status: `Button` is specced and built (see `COMPONENT_SPECS.md` §1) with all real states — default/hover/active/focus; disabled/loading/error explicitly non-applicable (no async actions). **There are no inputs on this site** (no forms, no search, no contact form by design — conversion exits to phone/Lieferando). Spec'ing input states would be fiction; the playbook's "foundations first" reduces here to "Button is done; inputs don't exist."

Matrix over the real inventory (Usage 1–5 × Impact 1–5; Complexity noted):

| Tier | Components | Rationale | Effort |
|---|---|---|---|
| **P0 Must fix** | Button-routing (§P0-1), amber dialect (§P0-2), `--text-micro` (§P0-3), bistro syntax doc (§P0-4) | Highest usage + active drift | S each |
| **P1 Build/consolidate** | `SectionHeader` atom (new), `formatPrice` lib, card-hover rule, delete dead motion + phone-ring | High reuse, low risk | S–M |
| **P2 Document** | Full `COMPONENT_SPECS.md` exists as of 2026-09-29; remaining: sync stale `Button` sizes in `COMPONENT_REGISTRY.md` (36/44/48 claim vs actual `min-h-12` everywhere) | Correctness of docs | S |
| **P3 Later / never** | Inputs, modals, toasts, tables, dark mode, semantic palette, i18n switcher activation | No consumer on a static marketing site | — |

Dependency map: everything consumes `tokens.css` + `@/lib/site`; `MenuItemCard` → `DietaryBadge` + `AllergenBadge`; `MenuBistroCard` + `AllergenHeaderLegend` → `FlagIcon` → `FlagSprites` (via `Base`); `NavBar` → `MobileNavDrawer`; pages → `Section` + `Button`. Build order for P0/P1 is dependency-safe in any sequence (no component blocks another).

## 4. Docs & rollout (solo-maintainer scale)

- **No phased org rollout.** Adoption = merge to `main` → Cloudflare builds → verify. Each P0/P1 item ships as its own commit with `pnpm build` + affected Playwright specs (pattern already established: 251-pass suite, targeted runs for page-level changes).
- **Docs already exist:** 17 files in `docs/design-system/` + `.ai/` decision records. Missing: a `SectionHeader` contract when it's built; the `COMPONENT_REGISTRY.md` Button-size correction (§P2); a when-to-use line for the bistro token syntax (§P0-4).
- **Migration strategy:** incremental by construction — one component per commit, byte-identical rendering verified by screenshot specs where layout is touched (`fullPage` stitching artifact noted in `GRID_SYSTEM.md`: MobileBottomBar duplicates in screenshots are a Playwright artifact, not a bug).
- **Completeness checklist applied to this system:** interactive states — specced per component, non-applicable states called out, not invented; responsive — `md`/`lg` rules documented per component, touch targets ≥44px verified; a11y — contrast fixes logged 2026-08-07, focus rings universal, reduced-motion global; copy — de-AT Sie-form, zero em-dash rule (R-02), reviews verbatim; assets — `astro:assets` pipeline, WebP, lazy below fold, eager LCP.
- **Governance:** `.ai/decisions/*.okf.md` are settled law (no global React, tokens-only, `class:list`); new components must cite the `COMPONENT_GUIDELINES.md` template before merge. Success metric: zero new un-tokenized colors, zero new inline button styles, zero new `text-[11px]` without the token — all grep-enforceable in CI if desired.
