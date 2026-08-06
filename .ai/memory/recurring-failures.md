# Recurring Failures

Environment/tooling failures seen more than once in this repo's session history — expected, not surprising, when they recur.

- **`Deploy Preview` GitHub Actions job fails on every PR**, due to a missing `CLOUDFLARE_API_TOKEN` repository secret. Confirmed across dozens of PRs in this repo's history. `Build` job status is the reliable per-PR signal instead. This is a repo-configuration gap (needs a repo-admin to add the secret), not something any single code change can fix.
- **`wrangler pages dev` fails to start locally** in at least one sandboxed agent environment (`workerd` module resolution error). Recurs identically every time it's attempted in that environment — not worth re-attempting without first checking whether the environment has changed.
- **Playwright's browser binary is missing** in that same environment, so `npx playwright test` (full run) fails, while `npx playwright test --list` (no browser needed) succeeds. Use the `--list` fallback for static verification when a full run isn't possible.

## If a "recurring failure" stops recurring
If any of the above suddenly works (e.g. a future environment has a working Chromium binary), update this file to say so — don't keep treating a fixed limitation as still-broken.

- **Date**: 2026-08-06
- **Source**: manual entry via memory-append.mjs
- **Type**: recurring-failure
- **Insight**: A CSP policy documented as a 'known SEO-only gap' (JSON-LD blocked) turned out on investigation to be a much more severe, currently-live functional bug: ALL inline scripts on the site were CSP-blocked, including the mobile hamburger menu toggle and the Google Maps consent-gate button -- both silently did nothing for real production visitors.
- **Evidence**: Headless-Chrome click test before the fix: clicking #mobile-menu-btn left #mobile-menu's data-open attribute at 'false'. After adding all 5 script hashes to public/_headers: data-open became 'true' and the map consent-gate iframe loaded on click, zero CSP console violations.
- **Recommended behavior**: When a backlog item says a CSP/security gap only affects SEO or a narrow feature, verify that scope directly (grep for ALL inline <script> tags site-wide, not just the one named in the note) before assuming the blast radius is as documented -- the actual impact here was much larger than what was written down
- **Status**: active
