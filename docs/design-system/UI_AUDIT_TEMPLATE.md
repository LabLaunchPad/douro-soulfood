# UI Audit Template

Reusable format for any future full-site design-system audit. Filled in below with the 2026-08-07 audit as a worked example — copy the structure, not the specific numbers, for the next pass.

```markdown
## Audit: [date]

### Method
- [ ] Static grep pass (spacing/color/typography token usage)
- [ ] Browser-rendered detector pass (contrast, undersized text, layout)
- [ ] Real screenshot review (desktop + mobile, every route)
- [ ] Web research cross-verification (for any legal/standards claim — WCAG version, GDPR case law, platform crawl limits, etc. — never assume from training memory alone)

### Findings by category
Typography | Spacing | Color | Accessibility | Mobile | Legal/Compliance
— count, evidence (grep output or screenshot), severity, fix status

### False positives ruled out
— what looked like a bug, what you checked to confirm it wasn't, so the next audit doesn't rediscover it

### Fixed this pass
— what changed, verified how

### Deferred (documented, not silently dropped)
— what's real but out of scope for a safe single-pass fix, and why
```

---

## Worked example: 2026-08-07 full-site audit

**Method used**: all four steps above. Web research cross-verified: WCAG 2.2's new success criteria (2.5.8 Target Size, 2.4.11 Focus Not Obscured), the EU ODR platform's 2025-07-20 discontinuation (Impressum legal accuracy), and the LG München Google Fonts ruling (confirming an earlier self-hosting fix was correctly grounded).

**Findings**: Typography — 298 raw-utility call sites, 0 scale adoption. Spacing — 75 off-4px-grid instances. Color — 44 un-tokenized neutral/warning-palette instances. Accessibility — brand-gold text contrast ~2:1 (fixed), text-tertiary 4.1-4.3:1 near-miss (fixed), undersized text 9-11px in several components (fixed to 11-12px floor), one stale legal reference (EU ODR platform link, fixed). Mobile — one real alignment defect (Contact opening-hours), fixed.

**False positives ruled out**: dark-glow shadow (verified intentional brand decision, source-commented); testimonial glass-card low-contrast (verified via real screenshot, traced to headless-Chromium `backdrop-filter` compositing, not a live defect); lazy-loaded images appearing blank in full-page screenshots (Puppeteer doesn't scroll-trigger them, confirmed by re-capturing with a scroll pass); fixed-position elements appearing to duplicate mid-page (screenshot-stitching artifact, not real for an actual scrolling user); Datenschutz table-of-contents "cramped padding" (detector doesn't trace padding through to a nested child element, confirmed via element screenshot); Impressum `<dt>` uppercase labels flagged as "all-caps body text" (standard definition-list metadata convention, not body prose).

**Fixed this pass**: see `git log` on `claude/init-5izf4b` for the specific commits — brand-gold-ink token + ~30 call-site swap, text-tertiary darkening, surface-glass opacity, 9 undersized-text instances, 1 stale legal link, 1 alignment bug, 1 remaining `ch`-unit line-length instance.

**Deferred**: typography scale adoption (298 sites — needs a phased, visually-verified per-component pass, not a blind regex), spacing normalization (75 sites — same reasoning), color-role addition (`--color-warning` + routing 44 call sites through it).

---

## Worked example: 2026-08-07 follow-up audit (tablet/wide viewports + full a11y CI coverage)

**Method used**: real Playwright screenshots + horizontal-overflow detection (`scrollWidth` vs `clientWidth`) at narrow (320px)/tablet (768px)/wide (1920px), plus `@axe-core/playwright` scans at all viewports, across all 7 routes — closing the two gaps this template's own previous entry deferred.

**Findings**: Responsive — 1 real overflow defect (`/datenschutz` `<h1>` at 320px, 39px overflow from an unbroken 21-char German word with no `break-words` safeguard on the shared `text-[clamp(2rem,4vw,3rem)]` heading pattern duplicated across 5 pages). Accessibility — 3 real, repeated violations invisible to the previously-2/7-covered CI gate: `MobileBottomBar` outside any landmark (`region`, all 7 routes), a duplicate nested `Gästebewertungen` landmark on the homepage (`landmark-unique`), and hover-only-underline links inside body text on 2 legal pages (`link-in-text-block`, serious, WCAG 1.4.1). Doc drift — `RESPONSIVE_GUIDELINES.md` claimed the capsule nav collapses at `md:`/768px; the actual breakpoint (per `NavBar.astro`) is `lg:`/1024px, moved there by #48 without a doc update. Also found and fixed stale copy-paste comment labels in `tokens.css` header (leftover "Taco Green"/"Dark Black" labels from the `talkintacos.net` structural-reference build, mislabeling the actual terracotta/cream tokens).

**False positives ruled out**: blank white boxes in the gallery grid at tablet/wide screenshots — confirmed via `naturalWidth` check after a real scroll pass that these are `loading="lazy"` images not yet triggered by a static full-page screenshot, not broken images.

**Fixed this pass**: `break-words` added to the 5-page shared heading pattern; `MobileBottomBar`'s wrapper `<div>` → `<nav aria-label="…">`; redundant outer landmark removed from `index.astro`'s reviews section wrapper; default underline added to 9 body-text link instances across `impressum.astro`/`datenschutz.astro`; `RESPONSIVE_GUIDELINES.md` breakpoint claim corrected; `tokens.css` formalized into explicit `TIER 1 — PRIMITIVE`/`TIER 2 — SEMANTIC` sections (zero value change, verified via build + computed-style check) with stale header comments fixed; `tests/impressum.spec.ts` and `tests/datenschutz.spec.ts` added, closing CI's axe-core coverage to 7/7 routes (was 5/7 with working assertions, not the 2/7 this and other docs had claimed — that figure was itself stale and is corrected across `ACCESSIBILITY.md`, `docs/ui/ACCESSIBILITY_GUIDELINES.md`, `.ai/status.md`, `.ai/tasks/backlog/README.md`).

**Deferred**: none new this pass — both gaps the previous audit deferred are now closed.

---

## Worked example: 2026-08-07 mobile-homepage-only audit (section rhythm, tap targets, motion, scroll behavior)

**Method used**: full-file reads of every homepage section/component (not just the outer wrappers), a Playwright-based real-browser sweep at narrow (320px)/standard (390px)/large (430px) mobile widths plus a tablet(768)/desktop(1440) regression check, `axe-core` scan at 390px, `prefers-reduced-motion` emulation, and a real scroll-direction interaction simulation (not a static screenshot) for the one new behavior added this pass.

**Findings**: Root cause — `--spacing-section-mobile` (72px), a correctly-named section-rhythm token, was defined in `tokens.css` and used by zero components; every one of the homepage's post-hero sections instead used ad hoc `py-2`/`py-3` (8–20px) wrappers, the real driver behind a cramped mobile feel. Accessibility — `UserReviews`'s marquee had no `prefers-reduced-motion` guard (its only pause trigger was `:hover`, meaningless on touch) despite the same pattern already existing elsewhere (hero video, phone-ring icon). Several secondary controls (MapEmbed's consent button, the "Speisekarte" pill in both navbar states, Footer's nav/legal links, `ReviewBadge`-as-link) fell short of the codebase's own 44px tap-target convention. `HeroSection` used `min-h-screen` (100vh) rather than `100svh`, and `FeatureCard`'s image used a fixed `min-h-[300px]` that dominated short mobile viewports.

**New requirement (user-directed, not a defect)**: `MobileBottomBar` — the mobile visitor's only CTA path, since Hero's CTAs are deliberately `hidden` below `md:` — now hides on scroll-down, reveals on scroll-up, and always shows at page-top/on load.

**A real infrastructure bug found via implementation, not audit**: adding the new inline `<script>` to `MobileBottomBar.astro` changed the byte content of Astro's per-page combined inline script, which broke this repo's exact-hash CSP (`public/_headers`) — confirmed via the repo's own `scripts/checks/verify-csp-hashes.mjs`, and via a real scroll-simulation test showing the handler silently never ran in-browser (console-only CSP violation, no build error, exactly as that script's own docstring warns). Fixed by adding the new hash; re-verified both via the check script and a live scroll-interaction test (visible at load → hidden after scroll-down → visible after scroll-up → visible at top).

**Fixed this pass**: `py-section-mobile` adopted across all 8 homepage section boundaries (`index.astro` ×4, `PhotoGrid.astro`, `OurStorySection.astro`, `FaqAccordion.astro`, `UserReviews.astro`); `min-h-11` added to `MapEmbed`'s button, `FaqAccordion`'s summary, `NavBar`/`MobileNavDrawer`'s "Speisekarte" pill (both instances), and mobile-only (`md:min-h-0`) to `Footer`'s nav/legal links and `ReviewBadge`-as-link; `prefers-reduced-motion` guard added to `.animate-marquee` in `global.css`; `HeroSection`'s `min-h-screen` supplemented with `min-h-[100svh]`; `FeatureCard`'s image floor changed from a fixed `min-h-[300px]` to `aspect-[4/3]` on mobile (desktop unchanged via `md:min-h-[300px]`); `MobileBottomBar` scroll-direction hide/show implemented and the CSP hash it broke was fixed in the same pass.

**Deferred (explicitly, per this pass's own scope)**: `PhotoGrid`'s 9-item/2-col tablet-width asymmetry (doesn't reproduce on phones, out of mobile-only scope); `MobileBottomBar`/`Footer` `env(safe-area-inset-bottom)` interaction on notched devices (needs real-device or DevTools-safe-area emulation, not yet performed); manual-swipe alternative for the reviews marquee (user explicitly chose reduced-motion-guard-only for this pass).

---

## Worked example: 2026-08-07 spacing-strict follow-up (section-by-section, viewport-by-viewport, token-grounded)

**Method used**: exhaustive real-code extraction of every spacing-related class (`p-/m-/gap-/space-`) across all 15 homepage-related files (read fresh from disk, not from memory or a sample), cross-referenced against external grounding (Material Design's 8dp-grid convention, WCAG 1.4.10 Reflow's 320px/400%-zoom equivalence per the W3C Understanding doc), then a full section/component/viewport spacing table before any edit. Plan reviewed and approved (two explicit decision points) before implementation.

**Findings**: The homepage's 6-category grid was the one section wrapper never migrated to `py-section-mobile` in the prior pass (still ad hoc `pt-4 md:pt-6 pb-3 md:pb-4`). Across the 10 sections that *were* migrated, the paired desktop value had silently drifted into three different numbers (`md:py-3`/`md:py-4`/`md:py-5`) for structurally identical section boundaries — real, measurable spacing drift invisible to a mobile-only viewport check. Sub-section-tier drift also found: eyebrow→heading gap was `mb-1` in 3 sections but `mb-2` in 2 (`OurStorySection`, `UserReviews`); heading-block gap was `mb-4 md:mb-5` in 4 sections but `mb-4 md:mb-6` in the 5th (`UserReviews`). Separately, of ~6 CTA-style buttons on the homepage, only one (`FeatureCard`'s) used the shared `Button.astro` component — the other five hand-rolled their own padding/arrow-icon markup, with `PhotoGrid`'s CTA rendering under the 44px tap-target floor on mobile (`min-h-10`) despite reading close enough to pass a casual check.

**Decisions (user-confirmed before implementation)**: standardize all drifted `md:py-*` values to `md:py-5` (majority pattern, lowest risk); consolidate PhotoGrid's, the map section's, and Footer's CTAs into `Button.astro` (MapEmbed's consent button and NavBar's capsule pill left as intentionally distinct, structurally-embedded UI). Firmenevents/Private Feiern's apparent "double section padding" (outer `<section>` `py-section-mobile` + `FeatureCard`'s own inner `py-2 md:py-3`) was screenshot-verified as a legitimate card-in-a-lane pattern, not a defect — left unchanged.

**A real component gap found during implementation, not planning**: `Footer`'s CTA is an external link (`target="_blank" rel="noopener noreferrer"`) — `Button.astro` had no `target`/`rel` props, which would have blocked that consolidation. Extended the component with both as optional props (small, additive, doesn't affect any existing consumer since both default to `undefined`) rather than skipping Footer's conversion.

**Fixed this pass**: 6-category grid → `py-section-mobile md:py-5`; all 5 remaining `md:py-3`/`md:py-4` instances → `md:py-5` (10 section declarations now uniform); eyebrow-gap and heading-block-gap consistency fixes in `OurStorySection.astro`/`UserReviews.astro`; `PhotoGrid`'s, the map section's, and `Footer`'s CTAs converted to `Button.astro` (`target`/`rel` props added to support the Footer case; `PhotoGrid`'s persistent `shadow-glow-gold` and `Footer`'s `font-extrabold tracking-wider uppercase shadow-md hover:shadow-lg hover:scale-[1.02]` preserved via the `class` passthrough prop) — closes the `min-h-10` tap-target gap on `PhotoGrid`'s CTA as a side effect (now `min-h-12`/48px via `Button`'s `lg` size).

**Deferred**: `--spacing-section` (desktop-only section token, 120px) remains entirely unused — a larger, separate adoption effort than this pass's scope; `MapEmbed`/`NavBar` CTA consolidation (user chose PhotoGrid+Map+Footer only); `ReviewBadge`'s `size` prop not affecting its own container padding (`px-3 py-1.5` static regardless of `size`) — noted as a possible component oversight, left as-is since it has no visible defect at its one current call site.
