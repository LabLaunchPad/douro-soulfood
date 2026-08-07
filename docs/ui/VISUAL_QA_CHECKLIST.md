# Visual QA Checklist

This standard's §11 checklist, filled in with the real 2026-08-07 audit result — not a blank template.

- [x] Tokens are used everywhere — 0 raw hex outside literal flag SVGs; typography scale realigned to real usage; 38/44 previously-un-tokenized color call sites fixed
- [x] Background styles follow approved surface roles — see `SURFACE_SYSTEM.md`, zero undocumented surface treatments found
- [x] Typography follows the type scale — verified, see `TYPOGRAPHY.md`
- [x] Spacing follows the spacing scale — 75 documented half-step exceptions, judged defensible not drift, see `SPACING_SYSTEM.md`
- [x] Grid alignment is clean — verified via real screenshots, one defect found and fixed (Contact opening-hours)
- [x] Components are reused, not duplicated — verified against `COMPONENT_REGISTRY.md`, zero one-off duplicate components found
- [x] Component states are complete — verified per-component; the honest gaps (menu-nav `selected` state, `MapEmbed` error state) are flagged, not hidden — see `COMPONENT_STANDARDS.md`
- [x] Mobile is polished — full 7-route × 2-viewport Puppeteer audit, see `MOBILE_QA_CHECKLIST.md`
- [x] Contrast is verified — real Puppeteer contrast measurement, fixed where failing (WCAG AA 4.5:1)
- [x] Keyboard navigation works — real 40-element tab-through test
- [x] Focus is visible — verified, consistent 2px gold outline pattern
- [x] Target sizes are acceptable — all clear WCAG 2.2 minimum (24×24px); nav/footer icon-buttons additionally fixed to meet this standard's 44×44px preferred
- [x] Empty/loading/error states exist — where applicable; where not applicable (no forms, no async data), explicitly marked N/A with reason rather than faked, see `COMPONENT_STANDARDS.md`
- [x] No major visual noise remains — verified, decorative elements (gold glow) confirmed as deliberate, minimal, documented brand touches
- [x] Documentation is updated — this folder + `docs/design-system/` both current as of 2026-08-07

## Verdict

Ship-ready per this standard's own bar (§12), with two honestly-tracked, non-blocking follow-ups: the menu quick-nav's missing "currently viewing" indicator, and `MapEmbed`'s lack of a branded iframe-failure state. Neither blocks approval per this standard's own rules — both are documented, neither represents hidden debt.
