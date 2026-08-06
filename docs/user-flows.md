---
okf_version: "0.2"
id: "docs/user-flows"
type: "knowledge"
title: "User Flows"
status: "approved"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance: { source: "ai", references: ["src/pages/", "src/components/"] }
attestation: { method: "manual", checks: ["verified no contact form exists anywhere via repo-wide search"] }
summary: "Five real user flows traced to actual files/components — no flow describes a page or interaction this codebase doesn't actually have."
load_when: "New CTA, new interactive component, navigation changes."
token_budget: 800
related: [".ai/packs/repo-overview.okf.md"]
---

# User Flows

## Machine Contract
doc_id: FLOWS-01 | status: approved | outputs: navigation structure in `NavBar.astro`/`MobileNavDrawer.astro`/`Footer.astro`/`MobileBottomBar.astro`, cross-page linking in `src/pages/*.astro`

## 1. Context & Inputs
Verified against the actual file-based routes in `src/pages/` (`index.astro`, `menu.astro`, `about.astro`, `catering.astro`, `contact.astro` — no others exist; `docs/architecture.md`'s Rendering Strategy diagram is the source of truth for the route list) and the real interactive components: `MobileNavDrawer.astro` (hamburger drawer), `MapEmbed.astro` (two-click Maps consent gate), `FaqAccordion.astro` (native `<details>` accordion), and category-anchor navigation in `menu.astro`. **There is no contact form anywhere in this codebase** — verified via repo-wide search for `<form>`/`type="submit"`, zero matches. Contact happens only via `tel:`/`mailto:` links, the Lieferando order link, or in person.

## 2. Required Outputs
Five flows, each traced against real routes/components — no flow describes a page or interaction this codebase doesn't actually have:

### Flow A — Order food (primary conversion)
`Any page` → click `ctaPrimary` in `NavBar.astro` ("Jetzt bestellen") **or** `MobileBottomBar.astro`'s "Jetzt bestellen" button → external redirect to `siteSettings.lieferando_url` (`https://www.lieferando.at/en/menu/douro`), `target="_blank"`. This is the only real "order" flow — there is no checkout, cart, or ordering system inside this site itself; it hands off entirely to Lieferando.

### Flow B — Browse the menu, check for allergens
`/` → NavBar/Footer "Speisekarte" link, or a category tile in `index.astro`'s "6 Afro-Latino Spezialitäten" grid (each links to `/menu#category-{slug}`) → `/menu` → `AllergenHeaderLegend.astro` at the top explains allergen codes → scroll or click a category-nav anchor (`menu.astro`'s `<nav aria-label="Menü-Kategorien">`) → `MenuItemCard.astro`/`MenuBistroCard.astro` per dish, each showing `AllergenBadge`/`DietaryBadge`.

### Flow C — Find the restaurant / check hours
`Any page` → `/contact` (NavBar/Footer link) **or** the home page's "Unser Standort" section → `MapEmbed.astro`'s static placeholder card ("Karte anzeigen" button) → click → real Google Maps iframe loads (this is the one and only point in the whole site where a third-party network request fires on user action, per the GDPR consent-gate design documented in `docs/security.md`) → route-planning CTA links to `https://www.google.com/maps/dir/?api=1&destination=...`. Hours are shown via `siteSettings.hours` (Keystatic-editable) and, on the home page specifically, corrected client-side to the actual current day in `Europe/Vienna` time (see `index.astro`'s inline `<script>`).

### Flow D — Mobile navigation
`Any page, mobile viewport` → tap hamburger (`#mobile-menu-btn` in `NavBar.astro`) → `MobileNavDrawer.astro` opens: focus moves to the close button, `inert`/`aria-hidden` clear, a Tab focus-trap activates → tap a link, tap the close button, or press `Escape` → drawer closes, focus returns to the hamburger. This is the only modal-pattern interaction in the site.

### Flow E — Answer a question without contacting the restaurant
`/` → scroll to "Häufig gestellte Fragen" (`FaqAccordion.astro`, reads the `faq` content collection) → click a question `<summary>` → native `<details>` expand/collapse, no JS required. If the FAQ collection is empty, the whole section renders nothing (`FaqAccordion.astro`'s `items.length > 0` guard).

## 3. Constraints
- No flow may assume a contact form, login, cart, or checkout exists on this site — they don't, and adding one is a product decision requiring a new PRD entry, not an assumption this doc should encode.
- Any new flow description must name the actual file(s) it passes through, the same way Flows A–E do — a flow that can't be traced to real files doesn't belong in this document.
- The Lieferando hand-off (Flow A) is external and out of this codebase's control; do not describe post-redirect behavior as if verified here.

## 4. Acceptance Criteria
- Given a new CTA is added anywhere in the site, when it's meant to drive an order, then it must point at `siteSettings.lieferando_url` (or the hardcoded equivalent already used in `NavBar.astro`/`MobileBottomBar.astro`), not a new/different ordering mechanism.
- Given the Maps embed is used on a new page, when implemented, then it must go through `MapEmbed.astro` (Flow C's consent gate), never a raw `<iframe>`.
- Given a new interactive overlay/modal is added, when built, then it should follow `MobileNavDrawer.astro`'s pattern (focus management, `inert`/`aria-hidden`, `Escape`-to-close) — the one modal this codebase has already solved correctly.

## 5. Agent Execution Rules
- MUST: verify a flow against real files before documenting or building against it (per `CLAUDE.md`'s `1_INGEST` step).
- MUST: keep this document's flows in sync with `src/pages/` — if a page or major interactive component is added/removed, update this doc in the same change.
- MUST NOT: describe a checkout, contact form, or account system as if it exists — it doesn't, and implying otherwise misleads future agents into building against a false premise.
