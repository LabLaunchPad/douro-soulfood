# Component Standards

Contract template per this standard's section 6. Every component should document: purpose, anatomy, variants, states, accessibility notes, responsive behavior, token mapping, usage/anti-usage rules, examples.

## Required states checklist

```
default · hover · focus · active · selected · disabled · loading · success · warning · error · empty
```

## How this repo's components map to that list — honestly, not by inventing states that don't exist

This is a static-content marketing/menu site: no user accounts, no forms with server-side validation, no async data fetching, no cart/checkout. Applying an app-shaped state checklist literally would mean inventing states that have no real trigger. Instead, for each component in `COMPONENT_REGISTRY.md`, only the states that have a real code path are documented, and states from the standard's list with no applicable trigger are marked N/A with the reason — not silently omitted, not faked.

| Standard's state | Real applicability on this site |
|---|---|
| `default` / `hover` / `focus` / `active` | Apply to every interactive element (buttons, links, accordion triggers) — verified present and consistent via `Button.astro`'s shared variant system |
| `selected` | Applies narrowly: the menu category quick-nav could visually indicate the currently-scrolled-to category, but currently doesn't (no active-section highlighting implemented) — a real, minor gap, not urgent given the page is short enough to scan without it |
| `disabled` | No disabled interactive elements exist in this site's actual UI |
| `loading` | No async operations exist — nothing to show a loading state for |
| `success` | No form submissions or confirmable actions exist on-site (contact happens via `tel:`/`mailto:` links and the external Lieferando order flow, both outside this site's own UI) |
| `warning` | Realized as the allergen/prep-time amber accents — a persistent informational treatment, not a transient state |
| `error` | No error-producing interactions exist (no forms) |
| `empty` | The one conditional-render case, `MenuItemCard`'s `available=false`, shows an explicit "Nicht verfügbar" banner rather than hiding the item — the closest real analog to an empty/unavailable state, and handled explicitly |

## Verified anti-patterns NOT found

- No invented one-off components duplicating an existing pattern (verified against the full inventory in `COMPONENT_REGISTRY.md`).
- No dead/obsolete component variants found (e.g. `Button`'s three variants — `primary`/`secondary`/`ghost` — are all in active use, none orphaned).
- No component skips a real applicable state (the `selected` gap above is the one honestly-flagged exception, not hidden).
