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
