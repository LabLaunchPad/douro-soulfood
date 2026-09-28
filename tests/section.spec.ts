import { test, expect } from '@playwright/test';

/**
 * Section spacing-system contract — one component owns homepage section
 * rhythm (padding, container, accessible name).
 *
 * TDD RED: no section carries data-section-mode yet (raw <section> tags).
 * Full-width mode has no homepage consumer by design; it is previewed at
 * /dev/ui (dev-only, not in dist) with a manual-check note per the
 * visual-preview pattern — no automated test claims to cover it.
 */

const CONTAINED_SECTIONS = [
  'Google-Bewertung',
  'Schnellzugriff',
  'Speisekarte Kategorien',
  'Events & Feiern',
  'Unser Standort',
];

test.describe('Section component contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('inline sections render through the shared component', async ({ page }) => {
    for (const label of CONTAINED_SECTIONS) {
      await expect(page.locator(`section[aria-label="${label}"]`)).toHaveAttribute(
        'data-section-mode',
        'contained',
      );
    }
  });

  test('section rhythm matches the spacing system', async ({ page, isMobile }) => {
    // Mobile: py-section-mobile (32px). Desktop: md:py-12 (48px, menu.astro precedent).
    const expectedPad = isMobile ? '32px' : '48px';
    for (const label of CONTAINED_SECTIONS) {
      const section = page.locator(`section[aria-label="${label}"]`);
      await expect
        .poll(async () => section.evaluate((el) => getComputedStyle(el).paddingTop))
        .toBe(expectedPad);
      await expect
        .poll(async () => section.evaluate((el) => getComputedStyle(el).maxWidth))
        .toBe('1280px');
    }
  });
});
