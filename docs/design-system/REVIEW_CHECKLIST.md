# AI Review Checklist

Before approving any design change in this repo, answer these — with evidence (a grep count, a screenshot, a measured value), not a guess.

## Structure
- [ ] Is everything componentized? (No inline one-off markup duplicating an existing component's job.)
- [ ] Is there unnecessary duplication? (Check `COMPONENT_REGISTRY.md` before writing new markup — does a component already do this?)
- [ ] Are reusable patterns extracted, not copy-pasted? (E.g. `FlagSprites`'s shared-symbol pattern vs. inline SVG per use.)

## Visual
- [ ] Is spacing consistent? (On the 4px scale, or a documented, justified half-step per `SPACING_SYSTEM.md`?)
- [ ] Is typography consistent? (Reaching for `TYPOGRAPHY.md`'s scale in new/refactored components — current gap: existing markup doesn't yet, don't compound it.)
- [ ] Are colours tokenized? (`grep` for raw hex or un-tokenized Tailwind default-palette classes before merging.)
- [ ] Is hierarchy obvious? (One focal point per section — Design Principle 5.)

## Mobile
- [ ] Comfortable thumb reach (primary actions within `MobileBottomBar` or the top-of-viewport nav — not buried mid-scroll)
- [ ] Comfortable scrolling (no janky fixed-position interactions, no scroll-jacking)
- [ ] No clipping, no overflow (test at 390px, not just desktop-shrunk)
- [ ] No broken layouts (real Puppeteer screenshot, not "should be fine")
- [ ] Proper touch targets (measure it — ≥24×24px CSS pixels, WCAG 2.2 SC 2.5.8)

## Accessibility
- [ ] WCAG 2.2 AA compliant (contrast measured, not eyeballed — see `ACCESSIBILITY.md` for the current verified-status list)
- [ ] Keyboard accessible (tab through it for real)
- [ ] Focus visible (check z-index stacking, not just that an outline style exists in CSS)
- [ ] Semantic structure (right element for the job — `<dl>` for name/value pairs, `<button>` vs `<a>` chosen correctly)
- [ ] Screen reader friendly (meaningful `aria-label`s, not "click here")

## Engineering
- [ ] Easy to maintain (does it introduce a second way to do something `Button`/`MenuItemCard`/etc. already does?)
- [ ] Easy to extend (props-driven, not hardcoded per-instance variants)
- [ ] Easy to test (does `pnpm build` + the CSP-hash check + `verify-csp-hashes.mjs` still pass?)
- [ ] Documented (is `COMPONENT_REGISTRY.md` updated if this is a new/changed component?)

## Verdict format

State the finding count and evidence, not a vibe: "3 instances found via grep, 2 fixed and verified via screenshot, 1 documented as a deliberate exception because X" — never "looks good."
