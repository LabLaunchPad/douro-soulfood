/**
 * Shared analytics event contract — the only place event names and
 * payload shapes are defined. Components should import `trackEvent`
 * and one of these types rather than pushing to `window.dataLayer`
 * directly, so every event is typed and discoverable in one file.
 * See docs/analytics.md for the taxonomy and consent rules this
 * implements.
 */

export type AnalyticsEventName =
  | 'page_view'
  | 'nav_click'
  | 'cta_click'
  | 'order_click'
  | 'call_click'
  | 'directions_click'
  | 'faq_toggle'
  | 'form_submit';

export interface AnalyticsEventPayload {
  event: AnalyticsEventName;
  /** Free-form label identifying the specific element/link, e.g. "hero-primary" or "mobile-bottom-bar". */
  element_id?: string;
  /** Destination href for link-based events. */
  destination?: string;
  /** Page path the event occurred on. */
  page_path?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

/**
 * Pushes a typed event onto window.dataLayer. No-ops (and does not
 * throw) if dataLayer doesn't exist yet — e.g. GTM isn't configured
 * for this environment (see GoogleTagManager.astro) or the push
 * happens before the bootstrap script has run.
 */
export function trackEvent(payload: AnalyticsEventPayload): void {
  if (typeof window === 'undefined' || !window.dataLayer) return;
  window.dataLayer.push({
    page_path: window.location.pathname,
    ...payload,
  });
}
