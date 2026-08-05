/**
 * Consent Mode v2 update helpers. GoogleTagManager.astro sets the
 * required default (all denied except security_storage) before GTM
 * loads; call these once a consent-management UI captures the
 * visitor's choice. No such UI exists in this repo yet — see
 * docs/analytics.md for what's required before enabling real
 * tracking under GDPR.
 *
 * Safe to call even when GTM isn't configured for this environment
 * (window.gtag won't exist) — these no-op rather than throwing.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConsentCategory = 'analytics' | 'ads';

const CONSENT_PARAMS: Record<ConsentCategory, string[]> = {
  analytics: ['analytics_storage'],
  ads: ['ad_storage', 'ad_user_data', 'ad_personalization'],
};

function updateConsent(categories: ConsentCategory[], state: 'granted' | 'denied'): void {
  if (typeof window === 'undefined' || !window.gtag) return;

  const update: Record<string, 'granted' | 'denied'> = {};
  for (const category of categories) {
    for (const param of CONSENT_PARAMS[category]) {
      update[param] = state;
    }
  }
  window.gtag('consent', 'update', update);
}

export function grantConsent(categories: ConsentCategory[] = ['analytics', 'ads']): void {
  updateConsent(categories, 'granted');
}

export function denyConsent(categories: ConsentCategory[] = ['analytics', 'ads']): void {
  updateConsent(categories, 'denied');
}
