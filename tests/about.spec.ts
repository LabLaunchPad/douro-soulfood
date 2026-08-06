import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * About page E2E tests — D'ouro Soulfood Bistro
 *
 * Verifies /about renders Angela's story, the three value cards,
 * NavBar/Footer, and passes accessibility/SEO checks. Selectors and
 * content strings verified directly against src/pages/about.astro.
 *
 * Runs on both desktop and mobile viewports via config projects.
 */

test.describe('About page — content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('page loads with correct heading', async ({ page }) => {
    const h1 = page.locator('h1', { hasText: 'Über uns' });
    await expect(h1).toBeVisible();
  });

  test("Angela's story section is visible with founder heading", async ({ page }) => {
    const heading = page.locator('h2', { hasText: "Angela's Geschichte" });
    await expect(heading).toBeVisible();

    const role = page.locator('p', { hasText: 'Founder & Chef' });
    await expect(role).toBeVisible();

    await expect(
      page.locator('p', { hasText: /D'ouro begann während des Lockdowns/ })
    ).toBeVisible();
  });

  test('all three value cards are visible', async ({ page }) => {
    const expectedTitles = ['Authentisch', 'Frisch', 'Mit Herz'];
    for (const title of expectedTitles) {
      await expect(page.locator('h3', { hasText: title })).toBeVisible();
    }
  });

  test('NavBar is present on about page', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');
    await expect(nav).toBeVisible();
  });

  test('Footer is present on about page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.locator('address', { hasText: 'Auerspergstraße 10' })).toBeVisible();
  });
});

test.describe('About page — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
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

test.describe('About page — SEO meta', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('page has correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Über uns');
    expect(title).toContain("D'ouro Soulfood Bistro");
  });

  test('page has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://douro-soulfood.com/about/');
  });
});
