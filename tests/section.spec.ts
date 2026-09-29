import { test, expect } from '@playwright/test';

/**
 * Section spacing-system contract — one component owns homepage section
 * rhythm (padding, container, accessible name).
 *
 * Green since 2026-09-27: all inline homepage sections render through
 * Section (data-section-mode="contained"); component-owned sections carry
 * the identical token pair without the wrapper.
 * Full-width mode has no homepage consumer by design; it is previewed at
 * /dev/ui (dev-only, not in dist) with a manual-check note per the
 * visual-preview pattern — no automated test claims to cover it.
 *
 * Full-bleed sections (Story, PhotoGrid grids, Events band) are exempt from
 * CONTAINED_SECTIONS by design: the band carries the identical padding
 * tokens (py-section-mobile md:py-20) with an inner max-w-7xl container,
 * verified visually per pass, same as the other exempt sections.
 */

const CONTAINED_SECTIONS = [
  'Google-Bewertung',
  'Schnellzugriff',
  'Speisekarte Kategorien',
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
    // Research-backed generous tier (2026-09-28): mobile py-section-mobile
    // (40px, half the desktop register), desktop md:py-20 (80px, premium
    // hospitality band 80-160px; gaps land at 80px mobile / 160px desktop).
    const expectedPad = isMobile ? '40px' : '80px';
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
