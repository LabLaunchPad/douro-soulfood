# Personas

## Machine Contract
doc_id: PERSONAS-01 | status: approved | outputs: audience-informed copy/UX decisions in `src/pages/*.astro`, content tone in `src/content/faq/*.json`

## 1. Context & Inputs
Derived from `docs/prd.md` §2 ("Target Audience") and the actual bilingual (DE primary / EN secondary) copy already shipped across `src/pages/*.astro` and `src/content/menu-items/*.json`. No user research or analytics exist for this project (see `docs/prd.md` §6: "Analytics | None currently configured") — these personas are inferred from the product's stated goals and its own content, not from measured behavior. Treat them as working assumptions to sanity-check design/copy decisions against, not as validated research.

## 2. Required Outputs
Three personas, each used to answer "would this decision make sense to this person?" when writing copy, choosing a CTA, or prioritizing a page:

### Salzburg Local — "Stammgast" (primary)
- German-speaking, 22–45, lives or works near Salzburg's Altstadt/Neustadt.
- Already knows the neighborhood; wants an easy way to check today's hours, order for pickup/delivery, or find the address.
- Primary journeys: `/contact` (hours/address/route), the Lieferando order link (NavBar `ctaPrimary`, `MobileBottomBar`'s "Jetzt bestellen"), and the phone-call CTA (`MobileBottomBar`'s "Anrufen").
- What matters to this persona: `MobileBottomBar.astro`'s sticky call/order buttons and the home page's "Öffnungszeiten" widget (`index.astro`, computed client-side against `Europe/Vienna` time) — both are load-bearing for this exact use case.

### Tourist / Visitor — "Salzburg Besucher" (secondary)
- English or German speaking, visiting Salzburg short-term, looking for something other than traditional Austrian cuisine.
- Needs the menu translated (most `menu_items` entries carry `descriptionEn`, per `keystatic.config.ts`/`src/content.config.ts`), the address in a form Google Maps understands, and photos to build trust before walking in.
- Primary journeys: `/menu` (browsing with dietary/allergen filters — `AllergenHeaderLegend.astro`, `DietaryBadge.astro`), the home page's photo grids (`PhotoGrid.astro` instances for "Beliebte Gerichte"/"Galerie"), and the consent-gated `MapEmbed.astro` for wayfinding.
- What matters: allergen transparency (a legal/trust requirement in Austria, not just UX — see `docs/security.md` for the DSGVO angle) and the review badge (`ReviewBadge.astro`, 4.8★/978 reviews) as a trust signal for someone with no prior relationship to the restaurant.

### Delivery-Platform Discoverer — "Lieferando-Nutzer" (tertiary)
- Finds D'ouro via Lieferando's own listing first, not this website.
- Arrives at this site (if at all) to confirm the restaurant is legitimate, check hours, or look at the fuller menu/photos Lieferando's own listing doesn't show.
- Primary journeys: usually none on this site — this persona's actual conversion happens entirely on Lieferando's platform. When they do land here, the same trust signals as the Tourist persona apply (reviews, photos, address).

## 3. Constraints
- All copy is DE-primary; do not assume an EN-first visitor — `about.astro`/`catering.astro`/`contact.astro` have no English translation, only `menu_items.descriptionEn` is bilingual.
- No analytics exist to validate these personas against real traffic. Do not cite this document as if it were measured user research in copy, PRs, or stakeholder communication — it's an inferred working model, say so if asked.
- Any new page/feature should be justifiable against at least one of these three personas' actual journeys above, not a hypothetical fourth persona invented on the spot.

## 4. Acceptance Criteria
- Given a new home-page section is proposed, when checked against this doc, then it should serve at least one of: the Stammgast's speed-to-order/hours, the Tourist's trust-building/menu clarity, or general legitimacy signals useful to a Lieferando-discoverer.
- Given a copy decision is DE vs. DE+EN, when checked against this doc, then default to DE-only unless the content specifically targets the Tourist persona (matching the existing `descriptionEn` pattern on menu items).

## 5. Agent Execution Rules
- MUST: ground any "who is this for" question in one of the three personas above, or say explicitly that the request doesn't map to any of them.
- MUST: treat this document as an assumption set, not validated data — flag it as such if a human decision depends on its accuracy.
- MUST NOT: invent a fourth persona to justify a feature request without updating this document first (see `CLAUDE.md`'s `2_SPEC` execution-loop step — the doc comes before the code).
- MUST NOT: claim analytics-backed confidence this project doesn't have (`docs/prd.md` §6 confirms zero analytics are configured).
