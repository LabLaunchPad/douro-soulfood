import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Menu page E2E tests — D'ouro Soulfood Bistro
 *
 * Verifies the /menu page renders correctly with:
 * - Page heading "Speisekarte"
 * - At least one menu category heading (e.g. Tacos, Bowls)
 * - At least one menu item with a Euro price
 *
 * Menu items are rendered by MenuBistroCard.astro (the "bistro paper"
 * card used for every current menu category), which formats prices as
 * "8,90 €" (de-DE Intl.NumberFormat, symbol after the number) rather
 * than the "€14,90" shape assumed by earlier versions of these tests.
 *
 * Runs on both desktop and mobile viewports via config projects.
 */

test.describe('Menu page — content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  test('menu page loads with correct heading', async ({ page }) => {
    const h1 = page.locator('h1', { hasText: 'Speisekarte' });
    await expect(h1).toBeVisible();
  });

  test('at least one menu category heading is visible', async ({ page }) => {
    // Category sections use id="category-{slug}" and contain h2 headings
    // e.g. Vorspeisen / Entradas, Quesadillas, Tacos, Bowls, Bebidas ...
    const categoryHeadings = page.locator('section[id^="category-"] h2');
    const count = await categoryHeadings.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('at least one menu item with a Euro price is visible', async ({ page }) => {
    // MenuBistroCard renders prices as "8,90 €" via Intl.NumberFormat('de-DE'),
    // symbol after the number with a non-breaking space.
    const priceElements = page.locator('text=/\\d+,\\d{2}\\s*€/');
    const count = await priceElements.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('category navigation links are present', async ({ page }) => {
    // The category nav bar at the top of the menu page
    const categoryNav = page.locator('nav[aria-label="Menü-Kategorien"]');
    await expect(categoryNav).toBeVisible();

    // Each category link points to #category-{slug}
    const categoryLinks = categoryNav.locator('a[href^="#category-"]');
    const count = await categoryLinks.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('clicking a category link scrolls to that section', async ({ page }) => {
    const firstCategoryLink = page.locator('nav[aria-label="Menü-Kategorien"] a[href^="#category-"]').first();
    await expect(firstCategoryLink).toBeVisible();

    const href = await firstCategoryLink.getAttribute('href');
    expect(href).toBeTruthy();

    await firstCategoryLink.click();

    // Verify the target section exists and is now in view
    const targetSection = page.locator(`section${href}`);
    await expect(targetSection).toBeVisible();
  });

  test('menu items have names (h3) and a description', async ({ page }) => {
    // MenuBistroCard renders item names as h3 elements inside <article>
    const itemNames = page.locator('article h3');
    const count = await itemNames.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Each card also has a German description paragraph
    const descriptions = page.locator('article p');
    const descCount = await descriptions.count();
    expect(descCount).toBeGreaterThanOrEqual(1);
  });

  test('menu item cards do not have duplicate DOM ids', async ({ page }) => {
    // MenuBistroCard renders inline SVG <clipPath> ids for the flag icons;
    // with many cards on the page, these must be unique per instance.
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll('[id]')).map((el) => el.id));
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    expect(duplicates).toEqual([]);
  });

  test('allergen legend is visible', async ({ page }) => {
    const legend = page.getByText('ALLERGENE / ALLERGENS:');
    await expect(legend.first()).toBeVisible();
  });

  test('NavBar is present on menu page', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');
    await expect(nav).toBeVisible();
  });

  test('Footer is present on menu page', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});

test.describe('Menu page — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/menu');
  });

  test('zero axe accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length > 0) {
      console.log(
        'Menu page accessibility violations:',
        JSON.stringify(
          results.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            nodes: v.nodes.length,
          })),
          null,
          2
        )
      );
    }

    expect(results.violations).toEqual([]);
  });

  test('category anchor links have visible focus indicators', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Focus-visible outline check is most reliable on Chromium');

    const firstCategoryLink = page.locator('nav[aria-label="Menü-Kategorien"] a[href^="#category-"]').first();
    await firstCategoryLink.focus();
    const outline = await firstCategoryLink.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe('none');
  });
});
