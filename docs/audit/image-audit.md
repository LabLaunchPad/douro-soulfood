# Image Optimization Audit (OUTCOME-006)

> Per `CLAUDE.md`'s `OUTCOME-006`. This audit found the raw-`<img>` issue it was meant to fix had already been resolved in a prior pass this session (IMG-01) — documented here rather than silently skipped, per `docs/audit/current-state.md`'s finding.

## Result: zero raw `<img>` tags remain in `index.astro`/`menu.astro`

Verified via `grep -c '<img' src/pages/index.astro src/pages/menu.astro` → `0` for both files. All 29 image instances across the two files (18 in `index.astro`'s `PhotoGrid` usages, 9 in `menu.astro`'s category showcase rows, plus the 2 `FeatureCard` images which were already `<Image>` before this session) use Astro's `<Image>` component with real, per-file pixel dimensions verified via PIL/`file` — not guessed.

## Known, documented limitation (not a new finding — carried forward honestly)
The converted image files live in `public/images/`, not `src/assets/`. Verified by inspecting build output (`dist/client/index.html`, `dist/client/menu/index.html`): Astro's `imageService: 'compile'` passes `public/`-referenced string `src` values through **unprocessed** — the emitted `<img>` tag's `src` is unchanged, no format conversion (e.g. to WebP/AVIF), no recompression. What `<Image>` *does* provide for these files: correct `width`/`height` attributes (fixing a real prior bug — the old hardcoded `width="600" height="450"` didn't match any actual file, which could contribute to layout shift) and `decoding="async"`.

This matches the pre-existing, established behavior of every other `<Image>` usage in this codebase (`MenuItemCard`, `MenuBistroCard`, `FeatureCard` all reference `public/`-relative paths the same way) — not a regression introduced by this pass.

## If real compression/format gains are wanted later
Would require relocating the referenced files from `public/images/` into `src/assets/` and updating every `src` reference (Keystatic's `fields.image()` directory config in `keystatic.config.ts` would also need reconsidering, since it writes uploads to `public/images/menu` today). That's a larger, separate migration — not attempted here, consistent with `CLAUDE.md`'s "smallest correct change" directive and this document's job being to report accurately, not to expand scope.
