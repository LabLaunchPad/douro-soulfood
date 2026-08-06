---
okf_version: "0.2"
id: "docs/security"
type: "knowledge"
title: "Security"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance: { source: "ai", references: ["public/_headers", "src/components/ui/MapEmbed.astro"] }
attestation: { method: "manual", checks: ["CSP copied verbatim from public/_headers"] }
summary: "Real CSP, GDPR consent-gate patterns already shipped (self-hosted fonts, two-click Maps), and one verified-but-unfixed gap (JSON-LD likely blocked by CSP)."
load_when: "Third-party scripts, embeds, consent, CSP changes."
token_budget: 800
related: [".ai/packs/security.okf.md"]
---

# Security

## Machine Contract
doc_id: SECURITY-01 | status: approved | outputs: `public/_headers`, GDPR-relevant components (`MapEmbed.astro`, self-hosted fonts in `src/styles/tokens.css`/`src/layouts/Base.astro`), Impressum/Datenschutz content (`src/pages/impressum.astro`/`datenschutz.astro`, currently on unmerged PR #20)

## 1. Context & Inputs
This site has no authentication, no user accounts, no database, and no server-side data processing beyond Keystatic's own admin routes (`/keystatic`, `/api/keystatic`) — the attack surface is small and mostly about response headers, third-party requests, and Austrian/EU privacy compliance for a public marketing site. Verified against `public/_headers` (the actual, current CSP), the `MapEmbed.astro` consent-gate implementation, and the self-hosted-fonts change (both shipped in earlier work this session, not hypothetical).

## 2. Required Outputs
### Current, verified security posture
- **HTTP security headers** (`public/_headers`): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Strict-Transport-Security` with `includeSubDomains`, and a CSP: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://images.unsplash.com; frame-src https://maps.google.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'`.
- **No unconsented third-party requests fire on page load.** Google Fonts are self-hosted (`public/fonts/`, `@font-face` in `src/styles/tokens.css`) instead of loaded from `fonts.googleapis.com`/`fonts.gstatic.com`. Google Maps only loads after an explicit click through `MapEmbed.astro`'s two-click pattern. Both were real fixes to a real problem (the underlying issue behind the 2022 Munich Google Fonts ruling: loading fonts/embeds from Google leaks visitor IP before consent) — not preemptive hardening.
- **No `set:html` XSS surface.** The only `set:html` usage in the codebase is `Base.astro`'s JSON-LD `<script>`, and its input is a locally-constructed object passed through `JSON.stringify` — no user or CMS-supplied data flows into it.
- **Keystatic admin access**: the CMS's own docs describe `/keystatic` and `/api/keystatic` as SSR routes (not prerendered, per `docs/architecture.md`'s Rendering Strategy diagram) — access control for who can reach the admin UI is Keystatic's/the hosting platform's responsibility, not something this codebase implements itself (local storage mode, per `docs/prd.md` §6).

### Known, verified gap (not yet fixed — documented honestly)
- **`Base.astro`'s inline JSON-LD `<script type="application/ld+json">` is likely blocked by `script-src 'self'` in production.** Verified via research: CSP's `script-src` directive applies to all `<script>` elements regardless of `type`, including non-executable ones like JSON-LD, unless a nonce/hash/`'unsafe-inline'` is present. This site has none of those for `script-src`. The practical effect: the `Restaurant` structured data this site relies on for SEO (`docs/prd.md` §7) may not actually be readable by search engines, silently. Fixing this correctly needs per-route build-time hash injection (the JSON-LD content differs per page — title/image vary), which is real infrastructure work, not a one-line fix — tracked here rather than rushed.

## 3. Constraints
- Any new third-party integration (analytics, a chat widget, a payment processor) must go through the same two-click-consent evaluation `MapEmbed.astro` already models — default to not loading, load only on explicit user action, document the data flow in this file.
- CSP changes must stay minimal and specific: `public/_headers`' `frame-src` was deliberately narrowed to exactly `https://maps.google.com` (not `*.google.com`) after confirming that's the only origin `MapEmbed.astro` ever injects — new entries need the same "what actually loads, verified, not assumed" discipline.
- Business/legal facts that can't be verified (the Impressum's legal form, UID/Kleinunternehmer status, Firmenbuchnummer — see the unmerged `claude/impressum-datenschutz` branch, PR #20) must stay as explicit placeholders, never a plausible-looking guess. An honest placeholder is safer than a wrong specific-looking number in a legal document.

## 4. Acceptance Criteria
- Given a new external script/embed is proposed, when evaluated, then it must either load only after explicit consent (matching `MapEmbed.astro`) or be justified as strictly necessary with no alternative (matching why Cloudflare/Keystatic's own infrastructure isn't consent-gated).
- Given the CSP is modified, when changed, then `pnpm build` + a manual check of what actually loads in the built output should confirm the new directive matches real, current usage — not aspirational future usage.
- Given the JSON-LD/CSP gap above is addressed in a future pass, when implemented, then this document's "Known, verified gap" section must be updated to reflect the fix, not left stale (per `CLAUDE.md`'s "fix the doc, don't leave a note that trusts the code instead" convention).

## 5. Agent Execution Rules
- MUST: treat any change that causes an unconsented third-party network request as a regression, even if it "just" restores previously-removed behavior (this happened once already in this session's history — a branch briefly lost the Maps consent-gate fix by merging `main` at the wrong point, caught and corrected before merge).
- MUST: research external security/browser-behavior claims before acting on them (as done here for the CSP/JSON-LD finding) rather than asserting from memory.
- MUST NOT: insert unverified specific-looking legal/business facts (VAT numbers, registration numbers) into `impressum.astro` or anywhere else — placeholder-with-explanation beats a plausible guess.
- MUST NOT: weaken the CSP (e.g., adding `'unsafe-inline'` to `script-src`) as a quick fix for the JSON-LD gap without exhausting the nonce/hash approach first.
