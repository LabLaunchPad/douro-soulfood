# Analytics

## Machine Contract
doc_id: ANALYTICS-01
status: approved
outputs:
  - future analytics integration decisions
  - `public/_headers` CSP updates if/when analytics ships

## 1. Context
`docs/prd.md` §6 states plainly: `Analytics | None currently configured`. Verified directly against the codebase — no analytics script, pixel, or tag-manager reference exists anywhere in `src/`, `public/`, or `astro.config.mjs`. This document exists to make that absence explicit and intentional (not an oversight) and to define the bar any future analytics integration must clear, consistent with `docs/security.md`'s consent-gate precedent (self-hosted fonts, two-click Maps embed).

## 2. Inputs
- `docs/security.md`'s existing GDPR posture: no unconsented third-party request fires on page load anywhere in this site today.
- `docs/personas.md`'s three personas (Stammgast, Tourist, Lieferando-Nutzer) — any analytics scope should be justified against what decision it would actually inform for these three groups, not added speculatively.
- `public/_headers`'s current CSP (`script-src 'self'`, no third-party script origins allowlisted) — any analytics vendor requires this file to be edited deliberately, not silently by a copy-pasted snippet.

## 3. Required Outputs
This document does not mandate adding analytics — it defines the process for when analytics is requested:
1. State the specific decision the data would inform (e.g. "which menu category gets the most `/menu#category-X` clicks" is a real, answerable question; "general traffic numbers" is not specific enough to justify a third-party script).
2. Choose a privacy-respecting option first: Cloudflare Web Analytics (no cookies, no CSP third-party script needed beyond Cloudflare's own edge, already hosting this site) is the natural first choice over Google Analytics.
3. If a cookie-based/consent-requiring analytics tool is chosen instead, it must go through the same two-click consent-gate pattern `MapEmbed.astro` already implements — no analytics script fires before explicit opt-in.
4. Update `public/_headers`'s CSP to allowlist exactly the chosen vendor's script/beacon origins — no wildcard origins.
5. Update `docs/security.md`'s "Current, verified security posture" section to reflect the new integration.

## 4. Constraints
- No analytics may be added as a "quick add" without updating this doc, `docs/security.md`, and `public/_headers` in the same change.
- No analytics script may load unconditionally if it sets cookies or otherwise processes personal data under DSGVO — must go through a consent gate.
- Do not add analytics dependencies (npm packages) if a `<script>`-tag-based or edge-native option (Cloudflare Web Analytics) satisfies the stated decision-informing goal — prefer the option with zero added JS payload.

## 5. Acceptance Criteria
- Given a request to "add analytics," when evaluated, then the requester must first answer "what decision will this data inform?" per §3.1 before any implementation starts.
- Given Cloudflare Web Analytics is chosen, when implemented, then no CSP change should be needed beyond what Cloudflare's own snippet requires (verify against Cloudflare's current documented script origin, don't assume).
- Given a cookie-based analytics vendor is chosen instead, when implemented, then it must not fire before user consent, matching `MapEmbed.astro`'s pattern.

## 6. Agent Execution Rules
- MUST: treat "no analytics configured" as the deliberate current state, not a gap to silently fill.
- MUST: update `docs/security.md` and `public/_headers` in the same change as any analytics addition.
- MUST NOT: add a Google Analytics/Meta Pixel/similar cookie-setting script without an explicit, separate consent-gate implementation.
- MUST NOT: install an analytics SDK as a dependency when a lighter-weight, edge-native, or `<script>`-tag option would satisfy the same stated goal.
