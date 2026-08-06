# Recurring Failures

Environment/tooling failures seen more than once in this repo's session history — expected, not surprising, when they recur.

- **`Deploy Preview` GitHub Actions job fails on every PR**, due to a missing `CLOUDFLARE_API_TOKEN` repository secret. Confirmed across dozens of PRs in this repo's history. `Build` job status is the reliable per-PR signal instead. This is a repo-configuration gap (needs a repo-admin to add the secret), not something any single code change can fix.
- **`wrangler pages dev` fails to start locally** in at least one sandboxed agent environment (`workerd` module resolution error). Recurs identically every time it's attempted in that environment — not worth re-attempting without first checking whether the environment has changed.
- **Playwright's browser binary is missing** in that same environment, so `npx playwright test` (full run) fails, while `npx playwright test --list` (no browser needed) succeeds. Use the `--list` fallback for static verification when a full run isn't possible.

## If a "recurring failure" stops recurring
If any of the above suddenly works (e.g. a future environment has a working Chromium binary), update this file to say so — don't keep treating a fixed limitation as still-broken.
