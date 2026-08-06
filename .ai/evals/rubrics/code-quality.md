# Rubric: Code Quality

Score each dimension 0–2 (0 = fails, 1 = partial, 2 = meets bar). A passing change scores 2 on every dimension.

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Design tokens | Hardcoded hex/px values introduced | Mixes tokens and hardcoded values | 100% `var(--token)`/Tailwind-token classes |
| Conditional classes | String concatenation or a new `cn()`-style helper | Inconsistent `class:list` usage | Consistent `class:list={[...]}` |
| Component defaults | Framework choice (React) used without justification | React used for a borderline case without documented rationale | Astro-first; React only per an approved, cited exception |
| Typed props | Untyped or `any` props | Partially typed | Full `interface Props` matching actual usage |
| Schema sync | Keystatic/Astro content schema changed on only one side | Changed both but unverified | Both changed and verified via build/`/keystatic` round-trip |
| Smallest correct change | Unrequested refactor/abstraction bundled in | Mostly scoped, minor scope creep | Exactly the requested change, nothing more |
| Verification | No build run, or claimed pass without running it | Build run but failures not investigated | Build run, real output checked, failures root-caused |
