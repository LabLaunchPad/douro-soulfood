# Design Principles — D'ouro Soulfood Bistro

## Philosophy: "Warm Precision"

Apple's spatial clarity meets Brazilian sensory warmth. Every interaction should feel as polished as an iOS app but as inviting as Angela's cooking.

## The five rules (from `docs/design-system.md`, unchanged, restated here for the priority-ordered list this folder's master prompt references)

1. **Light, not dark** — Warm cream surfaces with high-contrast espresso text. Dark mode is explicitly not planned; the brand identity is light.
2. **Motion is meaning** — Every animation communicates state or hierarchy, never decorates. `prefers-reduced-motion` is respected globally.
3. **Warm contrast** — Gold/terracotta accents create appetite against a light backdrop, used for emphasis and CTAs, not as a base color.
4. **Generous space** — iOS-level whitespace; section padding is 120px desktop / 72px mobile (`--spacing-section` / `--spacing-section-mobile`), never cramped.
5. **One hero per section** — Every section has one focal point (a heading, an image, or a single CTA), not competing elements.

## Tradeoff rules (decision order when principles conflict)

- Clarity over flourish
- Consistency over novelty
- Usability over decoration
- Quality over speed

## What "production-ready" means here

A screen passes when: token-driven colour and radius (already close to 100% compliant), a defined type scale is actually used (currently the gap — see `TYPOGRAPHY.md`), spacing sits on the 4px grid (75 known exceptions, documented not hidden), touch targets clear 24×24px CSS pixels (WCAG 2.2 SC 2.5.8, verified), and contrast clears 4.5:1 for text (WCAG 1.4.3, verified and fixed where it previously failed).
