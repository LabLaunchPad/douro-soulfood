import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Catering page E2E tests — D'ouro Soulfood Bistro
 *
 * Verifies /catering renders the intro copy and both FeatureCard
 * blocks (Firmenevents, Private Feiern), NavBar/Footer, and passes
 * accessibility/SEO checks. Content strings verified directly against
 * src/pages/catering.astro.
 *
 * Runs on both desktop and mobile viewports via config projects.
 */

test.describe('Catering page — content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catering');
  });

  test('page loads with correct heading', async ({ page }) => {
    const h1 = page.locator('h1', { hasText: 'Catering & Events' });
    await expect(h1).toBeVisible();
  });

  test('Firmenevents feature card is visible with CTA to /contact', async ({ page }) => {
    const heading = page.locator('h2', { hasText: 'Firmenevents' });
    await expect(heading).toBeVisible();

    const cta = page.locator('a[href="/contact"]', { hasText: 'Anfrage senden' });
    await expect(cta).toBeVisible();
  });

  test('Private Feiern feature card is visible with CTA to /contact', async ({ page }) => {
    const heading = page.locator('h2', { hasText: 'Private Feiern' });
    await expect(heading).toBeVisible();

    const cta = page.locator('a[href="/contact"]', { hasText: 'Jetzt planen' });
    await expect(cta).toBeVisible();
  });

  test('clicking a catering CTA navigates to /contact', async ({ page }) => {
    const cta = page.locator('a[href="/contact"]', { hasText: 'Anfrage senden' });
    await cta.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('NavBar is present on catering page', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');
    await expect(nav).toBeVisible();
  });

  test('Footer is present on catering page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Catering page — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catering');
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

test.describe('Catering page — SEO meta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catering');
  });

  test('page has correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Catering & Events');
  });

  test('page has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://douro-soulfood.com/catering/');
  });
});
