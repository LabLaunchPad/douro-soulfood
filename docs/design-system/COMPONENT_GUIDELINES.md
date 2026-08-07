# Component Guidelines — Contract Template

Every reusable component in this repo should be describable against this template. Not every existing component has a full write-up yet (see `COMPONENT_REGISTRY.md` for which do); use this template when adding a new one or documenting an existing gap.

```markdown
### ComponentName

**Category**: atom | section | layout
**Purpose**: one sentence — what job does this do that nothing else does?

**Anatomy**: the DOM/visual structure, named parts
**Props**: name, type, required?, default
**Variants**: named visual/behavioral variants (e.g. Button's primary/secondary/ghost)
**States**: default, hover, focus, active, disabled, loading, error, empty (only list the ones that actually apply)

**Behaviour**
- Hover: ...
- Focus: ...
- Active: ...
- Disabled: ...
- Loading / Empty (if applicable): ...

**Accessibility**
- Keyboard: tab order, key handlers
- Screen reader: aria-label/role choices and why
- Contrast: which token pairs are used, verified ratio
- Touch target: measured size, clears 24×24px?

**Responsive rules**: what changes at `md`/`lg`, if anything

**Token mapping**: which color/spacing/radius/typography tokens this component consumes

**Usage**: when to reach for this component
**Anti-usage**: when NOT to — what to use instead
```

## Rules for filling this out

- Cite real values (measured px, actual token names), not "should be accessible" hand-waving.
- If a component doesn't have a real Loading/Error/Empty state (many won't — this is a static content site, not an app with async data), say so explicitly rather than inventing one that doesn't exist in the code.
- Anti-usage matters as much as usage — e.g. `Button`'s `secondary` variant exists specifically for de-emphasized actions (`Route planen` on the Contact page); using it for a primary CTA would invert the intended hierarchy.
