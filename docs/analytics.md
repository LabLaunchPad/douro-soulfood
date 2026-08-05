# Analytics Rules

> Reflects the actual implementation in `src/lib/analytics/`,
> `src/components/analytics/`, and their wiring in `src/layouts/Base.astro`.

## Status: plumbing only, not yet live

No analytics currently runs on this site. `GoogleTagManager.astro` renders
nothing at all unless the `PUBLIC_GTM_ID` environment variable is set for
the build — so by default, zero tracking code ships. **There is also no
cookie-consent banner UI in this repo.** Before setting `PUBLIC_GTM_ID` in
any real deploy environment, either:

1. build a consent banner that calls `grantConsent()` / `denyConsent()`
   from `src/lib/analytics/consent.ts` once the visitor makes a choice, or
2. confirm the GTM container itself gates the GA4/Ads tags behind consent
   (Consent Mode v2 already defaults everything to `denied` — see below —
   so tags configured to "require additional consent" won't fire without
   an explicit grant either way).

Shipping `PUBLIC_GTM_ID` without one of those in place means GTM loads but
no measurement tags actually fire — which is safe, but also means nothing
gets measured. This is intentionally left as a follow-up: it's a real UI
surface (banner copy, styling, remember-the-choice storage) that shouldn't
be invented without product/legal sign-off on the actual banner text.

## Architecture

| Piece | File | Purpose |
|---|---|---|
| GTM loader | `src/components/analytics/GoogleTagManager.astro` | Loads GTM + sets Consent Mode v2 defaults. No-ops without `PUBLIC_GTM_ID`. |
| Event contract | `src/lib/analytics/events.ts` | The only place event names/payload shapes are defined (`AnalyticsEventName`, `trackEvent()`). |
| Click tracking | `src/components/analytics/ClickTracking.astro` | One delegated listener for the whole page — see below. |
| Consent updates | `src/lib/analytics/consent.ts` | `grantConsent()` / `denyConsent()`, called by a future consent banner. |

All four are wired once, in `Base.astro`, so every page gets the same
setup automatically — no per-page or per-component snippet duplication.

## Consent Mode v2

`GoogleTagManager.astro` sets the default consent state **before** the GTM
container script loads (required ordering — Google will otherwise treat
early hits as consented):

```js
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted', // always necessary, not personal-data storage
  wait_for_update: 500,
});
```

This matches Google's documented Consent Mode v2 parameter set (four
consent signals: `ad_storage`, `analytics_storage`, `ad_user_data`,
`ad_personalization`), required since March 2024 for EEA/UK traffic to
retain remarketing/ads measurement. Configure any GA4/Ads tag in the GTM
container itself to "require additional consent for tag to fire" with the
relevant parameter(s) — the default-deny here is the safety net, not a
substitute for that per-tag setting.

## Event taxonomy

Defined in `src/lib/analytics/events.ts` as `AnalyticsEventName`:

| Event | Meaning | Notes |
|---|---|---|
| `page_view` | Route change | GTM's own history-change trigger typically covers this; not currently pushed manually. |
| `nav_click` | Header/footer navigation link click | Add `data-analytics-event="nav_click"` to wire an existing link. |
| `cta_click` | Generic call-to-action click | For CTAs that aren't order/call/directions specifically. |
| `order_click` | "Jetzt bestellen" / order-online click | Wired on `NavBar.astro`'s primary CTA and `MobileBottomBar.astro`'s order button. |
| `call_click` | Phone number / "Anrufen" click | Wired on `MobileBottomBar.astro`'s call button. |
| `directions_click` | Directions/map link click | Not yet wired to a specific element — add the data attribute where needed. |
| `faq_toggle` | FAQ accordion open/close | Wired on `index.astro`'s `<details>` FAQ items. `ClickTracking.astro` listens for the native `toggle` event (fires on open *and* close, any input method), not `click`. |
| `form_submit` | Any form submission | No forms currently exist on the site to wire. |

## Adding tracking to a new element

Don't write a new `dataLayer.push()` call. Add data attributes and let the
existing delegated listener (`ClickTracking.astro`) pick it up:

```astro
<a href="/menu" data-analytics-event="nav_click" data-analytics-id="footer-menu-link">
  Speisekarte
</a>
```

`data-analytics-id` becomes `element_id` in the pushed payload — use it to
tell apart multiple instances of the same event (e.g. `order_click` fires
from both the nav bar and the mobile bottom bar; `element_id` distinguishes
them without adding a new event name).

## Environment configuration

- `PUBLIC_GTM_ID` — GTM container ID (e.g. `GTM-XXXXXXX`). Unset in this
  repo; must be supplied per deploy environment (e.g. Cloudflare Pages
  environment variables) once a real container exists and consent handling
  is in place.
- GA4 is configured *inside* the GTM container (a GA4 Configuration tag),
  not as a separate script/ID in this codebase — that keeps this repo
  provider-agnostic (swapping GA4 for another tool is a GTM-container
  change, not a code change).

## Sources

- Google, Consent Mode v2 parameters and required implementation ordering: [Google Consent Mode V2 Setup Guide](https://www.cookiehub.com/blog/google-consent-mode-v2-setup-gtm-guide), [Google Consent Mode v2 Parameters Explained](https://support.secureprivacy.ai/article/google-consent-mode-v2-parameters-explained-url-passthrough-data-redaction-troub/)
