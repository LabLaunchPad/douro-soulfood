---
okf_version: "0.2"
id: "memory/experience-ledger"
type: "knowledge"
title: "Experience Ledger"
status: "active"
created: "unknown"
updated: "unknown"
freshness: "current"
lifecycle: "active"
trust: "verified"
provenance:
  source: "ai"
  references: [".ai/memory/learned-constraints.md", ".ai/memory/anti-patterns.md", ".ai/memory/recurring-failures.md"]
attestation:
  method: "agent"
  checks: ["cross-references only real, session-verified events"]
summary: "OKF-formatted rollup of what worked, what failed, what required rework, and what patterns are now standard in this repo — a higher-level synthesis of the more granular .ai/memory/*.md files."
load_when: "A new agent wants a fast read on 'how has work actually gone in this repo so far' before starting."
token_budget: 900
related: [".ai/memory/learned-constraints.md", ".ai/memory/anti-patterns.md", ".ai/memory/recurring-failures.md"]
---

# Experience Ledger

## What worked
- **Sequencing merges to avoid predictable conflicts**: when `IMG-01` and `CMS-01` were known to touch the same `index.astro` lines, merging the "superset" branch (`CMS-01`) first and rebasing the other, resolving deliberately, avoided a messy auto-merge outcome.
- **Verifying live rather than trusting a runtime guard alone**: `/dev/ui`'s `import.meta.env.DEV` check correctly 404s it, but checking actual build output caught that `@astrojs/sitemap` still listed it — the guard alone wasn't sufficient evidence of "fully hidden."
- **Trying a real thing instead of trusting a stale assumption**: an earlier stated "Playwright's browser binary is missing in this sandbox" turned out to be incomplete — a pre-installed Chromium at `/opt/pw-browsers` actually works for Lighthouse once the real blocker (proxy TLS interstitial against a live HTTPS URL) was correctly diagnosed and routed around via `astro preview`'s plain HTTP local server.

## What failed (and was caught)
- Astro frontmatter compiler mis-ordering (`if`/`return` guard before `import` statements) produced a confusing, unrelated-looking esbuild error.
- A branch merged `main` one commit too early, missing a fix that landed moments later — caught by a fresh audit before trusting the branch's content.
- Headless Chrome against a live Cloudflare Workers preview URL consistently hit a proxy-TLS interstitial that `--ignore-certificate-errors` + explicit `--proxy-server` did not suppress — worked around via a local server instead of forcing it further (installing NSS cert tools would have needed an `apt install`, judged not worth the environment risk for this pass).

## What required rework
- `CLAUDE.md` was fully replaced twice with different large system prompts across this session, each time per explicit request — the second replacement required reconciling a direct contradiction with a third round's "CLAUDE.md must be a short pointer" requirement, resolved by relocating (not re-deleting) content.

## What agents misunderstood (before correction)
- An early, untested assumption that "Playwright/Lighthouse can't run in this sandbox at all" was too broad — the actual limitation is narrower (wrangler's local runtime, and headless Chrome specifically against externally-proxied HTTPS URLs), not Chromium itself being unavailable.

## What patterns are now standard
- `PhotoGrid`/`FaqAccordion`/`OurStorySection`-style section-component extraction for genuinely duplicated (not speculative) page markup.
- Two-click consent-gate pattern (`MapEmbed.astro`) for any third-party embed.
- `inert`/`aria-hidden` + focus-trap (`MobileNavDrawer.astro`) for any modal/overlay.
- OKF frontmatter for knowledge artifacts; plain markdown for role cards/commands/hooks; no frontmatter at all for code snippets.
