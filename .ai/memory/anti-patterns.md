# Anti-Patterns

Mistakes actually made (and caught/fixed) in this repo's history — don't repeat them.

- **Merging two branches that touch the same lines without checking for conflicts first.** `IMG-01` and `CMS-01` both rewrote the same `index.astro` sections independently. Caught before merge by predicting the conflict, sequencing the merges deliberately, and resolving explicitly rather than letting GitHub's auto-merge silently pick one side.
- **A branch trailing `main` by one merged commit.** A legal-pages branch was merged with `main` right before a separate Maps-consent-gate fix landed, so it described a component that wasn't actually in that branch yet. Caught by a fresh audit before the branch's content was trusted as accurate.
- **Leaving a stale doc reference after deleting the file it describes.** `CLAUDE.md` described a `run-e2e.sh` helper script for a full session after the script itself had been deleted in an earlier cleanup pass. Caught by a repo-wide grep during a later audit, not proactively.
- **Assuming a route's runtime guard is sufficient without checking build-time tooling.** `/dev/ui`'s `import.meta.env.DEV` guard correctly 404s it at runtime, but `@astrojs/sitemap` still listed it in `sitemap.xml` because sitemap generation doesn't know about runtime guards. Caught by explicitly checking build output, not assumed to be fine because the guard existed.
- **Inserting a plausible-looking but unverified specific number into a legal document.** An AI-synthesized web search produced a specific-looking GISA/UID number for the Impressum page, but it conflated two structurally different Austrian registries — a reliability red flag. Declined to use it; kept an honest placeholder instead.
