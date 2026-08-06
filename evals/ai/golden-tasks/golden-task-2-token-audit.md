# Golden Task 2: Design-Token Compliance Audit

**Objective**: audit one specified component (e.g. `src/components/sections/FeatureCard.astro`) for design-token compliance — any hardcoded hex/px value that should be a token reference.

**Context required**: `.ai/packs/design-system.okf.md`, `.ai/decisions/design-tokens.okf.md`, the component file itself.

**Expected output**: a pass/fail verdict with evidence, and a proposed fix if any violation is found.

**Acceptance criteria**:
- Given the component file, when scanned for hex colors (`grep -n '#[0-9A-Fa-f]\{3,6\}'`), then every match is either a legitimate exception (flag-SVG fill) or flagged as a real violation.
- Given a violation is found, when fixed, then it references an existing token from `src/styles/tokens.css` (or a justified new one) — never a hardcoded replacement.

**Evidence required**: the real grep command and its output; if a fix is made, `pnpm build` passing afterward.
