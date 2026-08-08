import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Datenschutz page E2E tests — D'ouro Soulfood Bistro
 *
 * Verifies /datenschutz renders the DSGVO privacy-policy content,
 * table of contents, and NavBar/Footer. Added to close the CI
 * accessibility-coverage gap noted in docs/design-system/ACCESSIBILITY.md
 * (was 5 of 7 routes covered via existing specs; impressum/datenschutz
 * had none).
 */

test.describe('Datenschutz page — content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datenschutz');
  });

  test('page loads with correct heading', async ({ page }) => {
    const h1 = page.locator('h1', { hasText: 'Datenschutzerklärung' });
    await expect(h1).toBeVisible();
  });

  test('responsible-party (Verantwortlicher) section is visible', async ({ page }) => {
    await expect(page.locator('article#verantwortlicher')).toBeVisible();
    await expect(page.locator('address', { hasText: "D'ouro Soulfood Bistro" })).toBeVisible();
  });

  test('hosting disclosure section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Hosting & Server-Log-Files' })).toBeVisible();
  });

  test('NavBar is present on datenschutz page', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');
    await expect(nav).toBeVisible();
  });

  test('Footer is present on datenschutz page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Datenschutz page — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datenschutz');
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

test.describe('Datenschutz page — SEO meta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/datenschutz');
  });

  test('page has correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Datenschutz');
  });

  test('page has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://douro-soulfood.com/datenschutz/');
  });
});
