---
okf_version: "0.2"
id: "decision/no-aggregate-rating"
type: "decision"
title: "No aggregateRating markup for third-party review aggregates"
status: "approved"
created: "2026-09-27"
updated: "2026-09-27"
freshness: "current"
lifecycle: "stable"
trust: "verified"
provenance: { source: "repo", references: ["docs/seo.md", "src/lib/seo/graph.ts"] }
attestation: { method: "agent", checks: ["aggregateRating absent from built @graph on all 7 pages", "homepage badge presentational with current Google values + Stand date + place-ID link"] }
summary: "The site's own pages never emit schema.org aggregateRating for Google's third-party aggregate — at ANY value, so refreshing stale numbers would not fix the violation. Visible rating social proof lives only in the presentational homepage badge (current Google values, Stand date, GBP place link, no markup)."
load_when: "Any proposal to (re-)add aggregateRating, reviewCount, or Review markup."
token_budget: 250
related: ["docs/seo.md", ".ai/packs/seo.okf.md"]
---

# Decision: No aggregateRating for third-party aggregates

Removed 2026-09-27 (was Google's 4.8/978 hardcoded in `src/lib/seo/graph.ts`,
emitted on all 7 pages). Google's review-snippet policy does not allow a
business's own pages to mark up a third-party (Google) aggregate as their own
`aggregateRating` — refreshing it to the then-current 4.7/1,224 would have kept
the violation with fresher numbers, so removal was the only correct fix.

Re-add `aggregateRating` only if the restaurant collects its own first-party
reviews on-site (with provenance: who, when, where). Same bar applies to
`Review` markup for the `UserReviews.astro` testimonials: their sources were
de-labeled to generic "Gast" the same day because hardcoded quotes must not
wear Google's or TripAdvisor's name without verifiable provenance.
