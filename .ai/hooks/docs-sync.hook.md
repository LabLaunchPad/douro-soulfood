# Hook: docs-sync

**Trigger**: code changes in a way a doc describes.

**Condition**: the changed behavior/structure/API is documented anywhere in `docs/**` or `.ai/packs/*.okf.md`.

**Action**: update the doc in the same change, per this repo's "fix the doc, don't leave a note that trusts the code instead" convention. Run DOC SYNC if the drift is broader than one file.

**Output**: docs and code land in the same commit/PR, never a "docs will follow later."

**Failure behavior**: shipping code without its doc update is exactly the kind of drift `okf/audit/current-state.okf.md`-style audits exist to catch later — better to not create it in the first place.
