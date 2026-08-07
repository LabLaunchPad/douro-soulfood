import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Impressum page E2E tests — D'ouro Soulfood Bistro
 *
 * Verifies /impressum renders the §5 ECG / §25 MedienG legal disclosure
 * content and NavBar/Footer. Added to close the CI accessibility-coverage
 * gap noted in docs/design-system/ACCESSIBILITY.md (was 5 of 7 routes
 * covered via existing specs; impressum/datenschutz had none).
 */

test.describe('Impressum page — content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/impressum');
  });

  test('page loads with correct heading', async ({ page }) => {
    const h1 = page.locator('h1', { hasText: 'Impressum' });
    await expect(h1).toBeVisible();
  });

  test('company disclosure (§5 ECG) is visible', async ({ page }) => {
    await expect(page.locator('dd', { hasText: "D'ouro Soulfood Bistro" }).first()).toBeVisible();
    await expect(page.locator('dt', { hasText: 'Anschrift' })).toBeVisible();
  });

  test('media disclosure (§25 MedienG) is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Offenlegung gemäß §25 Mediengesetz' })).toBeVisible();
  });

  test('NavBar is present on impressum page', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');
    await expect(nav).toBeVisible();
  });

  test('Footer is present on impressum page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Impressum page — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/impressum');
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

test.describe('Impressum page — SEO meta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/impressum');
  });

  test('page has correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Impressum');
  });

  test('page has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://douro-soulfood.com/impressum/');
  });
});
