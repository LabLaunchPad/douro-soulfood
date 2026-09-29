import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Contact page E2E tests — D'ouro Soulfood Bistro
 *
 * Verifies /contact renders address/phone/hours (sourced from
 * src/content/settings/default.json via siteSettings, wired up per
 * Round 2.4 of this repo's cleanup history), the "Route planen" CTA,
 * the consent-gated Google Maps embed, and NavBar/Footer.
 *
 * Runs on both desktop and mobile viewports via config projects.
 */

test.describe('Contact page — content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('page loads with correct heading', async ({ page }) => {
    const h1 = page.locator('h1', { hasText: 'Kontakt' });
    await expect(h1).toBeVisible();
  });

  test('address is visible with real street address', async ({ page }) => {
    // Scoped to #main-content: the Footer renders the same address sitewide,
    // so an unscoped `address` locator matches two elements and trips
    // Playwright's strict mode. This asserts the contact page's own copy.
    const address = page.locator('#main-content address').filter({ hasText: 'Auerspergstraße 10' });
    await expect(address).toBeVisible();
    await expect(address).toContainText('5020');
    await expect(address).toContainText('Salzburg');
  });

  test('phone number links to correct tel: href', async ({ page }) => {
    // Scoped for the same reason: the phone number is also a tel: link in the
    // Footer and in MobileBottomBar's "Jetzt anrufen" button (3 matches total).
    const phoneLink = page.locator('#main-content a[href="tel:+436764231921"]');
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveText('+43 676 4231921');
  });

  test('opening hours list is visible with all 7 days', async ({ page }) => {
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    for (const day of days) {
      await expect(page.locator('dt', { hasText: day })).toBeVisible();
    }
    await expect(page.locator('dd', { hasText: 'Geschlossen' })).toBeVisible();
  });

  test('"Route planen" button links to Google Maps directions', async ({ page }) => {
    const routeButton = page.locator('a', { hasText: 'Route planen' });
    await expect(routeButton).toBeVisible();
    await expect(routeButton).toHaveAttribute('href', /google\.com\/maps\/dir/);
  });

  test('NavBar is present on contact page', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');
    await expect(nav).toBeVisible();
  });

  test('Footer is present on contact page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Contact page — Google Maps consent gate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('no Google Maps iframe is present before consent', async ({ page }) => {
    const mapEmbed = page.locator('[data-map-embed]');
    await expect(mapEmbed).toBeVisible();
    await expect(mapEmbed.locator('iframe')).toHaveCount(0);
  });

  test('clicking "Karte anzeigen" loads the Google Maps iframe', async ({ page }) => {
    const mapEmbed = page.locator('[data-map-embed]');
    await mapEmbed.getByRole('button', { name: 'Karte anzeigen' }).click();

    const iframe = mapEmbed.locator('iframe');
    await expect(iframe).toHaveCount(1);
    await expect(iframe).toHaveAttribute('src', /maps\.google\.com/);
  });
});

test.describe('Contact page — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('zero axe accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length > 0) {
      console.log('Accessibility violations:', JSON.stringify(results.violations, null, 2));
    }

    expect(results.violations).toEqual([]);
  });
});

test.describe('Contact page — SEO meta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('page has correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Kontakt');
  });

  test('page has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://douro-soulfood.com/contact/');
  });
});

test.describe('Contact page — location/distance', () => {
  test('directions link is place-anchored (origin left to device)', async ({ page }) => {
    await page.goto('/contact');
    const routeButton = page.locator('a', { hasText: 'Route planen' });
    const href = await routeButton.getAttribute('href');
    expect(href).toContain('destination_place_id=ChIJZ5K9XxaRdkcRtUZhEVaeRPo');
    expect(href).not.toContain('origin=');
  });

  test('map iframe pins the GBP record by name', async ({ page }) => {
    await page.goto('/contact');
    const mapEmbed = page.locator('[data-map-embed]');
    await mapEmbed.getByRole('button', { name: 'Karte anzeigen' }).click();
    const src = await mapEmbed.locator('iframe').getAttribute('src');
    expect(src).toContain('output=embed');
    expect(src).toContain('Soulfood');
  });

  test('granted location shows on-device straight-line distance', async ({ page, context }) => {
    // Salzburg old town ~950 m from Auerspergstraße 10 — nothing leaves the device.
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 47.8094, longitude: 13.055 });
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Entfernung anzeigen' }).click();
    const result = page.locator('[data-distance-result]');
    await expect(result).toContainText(/Ca\. 9\d0 m Luftlinie/);
  });

  test('denied location degrades to the directions hint', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Entfernung anzeigen' }).click();
    await expect(page.locator('[data-distance-result]')).toContainText(/Route planen/);
  });
});
