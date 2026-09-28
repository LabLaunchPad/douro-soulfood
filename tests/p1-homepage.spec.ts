import { test, expect } from '@playwright/test';

/**
 * P1 homepage regression suite — verified findings from the full
 * UI/UX + Design System + Responsive + Accessibility pass.
 *
 * Asserts user-visible behavior and AT semantics, never exact class names.
 * Written BEFORE the fixes (TDD RED).
 */

test.describe('P1-1 review duplication capped', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('each track holds one doubled dataset (6 cards), not tripled', async ({ page }) => {
    const trackA = page.locator('[data-marquee-track] > div:not([aria-hidden])');
    await expect(trackA.locator(':scope > div')).toHaveCount(6);
    // One review's text occurs exactly 2× per track — no déjà vu per viewport.
    await expect(trackA.locator(':scope > div', { hasText: 'Beef Tacos' })).toHaveCount(2);
  });
});

test.describe('P1-2 category grid usable on phones', () => {
  test('tiles are tappable columns at 390px, not a 6-up crush', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');
    const section = page.locator('section', {
      has: page.locator('h2', { hasText: 'Afro-Latino' }),
    });
    const firstTile = section.locator('a').first();
    expect((await firstTile.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(90);
    const minHeight = await firstTile.evaluate(
      (el) => getComputedStyle(el).minHeight || '0px',
    );
    expect(parseFloat(minHeight)).toBeGreaterThanOrEqual(44);
    await context.close();
  });
});

test.describe('P1-3 skip link moves focus', () => {
  test('activating the skip link focuses #main-content', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main#main-content')).toHaveAttribute('tabindex', '-1');
    await page.locator('a[href="#main-content"]').focus();
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main-content');
  });
});

test.describe('P1-4 reduced motion kills smooth scroll', () => {
  test('scroll-behavior is auto under reduced-motion', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behavior).toBe('auto');
    await context.close();
  });
});

test.describe('P1-5 bistro card link keeps visible focus', () => {
  test('menu card stretched link shows a 2px outline on focus', async ({ page }) => {
    await page.goto('/menu/');
    const cardLink = page.locator('article a[aria-label*="bestellen"]').first();
    await cardLink.focus();
    const ring = await cardLink.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { style: cs.outlineStyle, width: cs.outlineWidth };
    });
    expect(ring.style).toBe('solid');
    expect(ring.width).toBe('2px');
  });
});

test.describe('P1-6 footer targets meet AA minimum', () => {
  test('desktop footer links and phone link are at least 24px tall', async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('/');
    const navLink = page.locator('footer nav a').first();
    expect((await navLink.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(24);
    const phone = page.locator(`footer a[href^="tel:"]`).first();
    expect((await phone.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(24);
    await context.close();
  });
});

test.describe('P1-7 decorative SVGs hidden from AT', () => {
  test('category icons expose no unnamed graphics', async ({ page }) => {
    await page.goto('/');
    const section = page.locator('section', {
      has: page.locator('h2', { hasText: 'Afro-Latino' }),
    });
    for (const svg of await section.locator('svg').all()) {
      await expect(svg).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('review badge stars carry no contradictory role', async ({ page }) => {
    await page.goto('/');
    const badge = page.locator('[aria-label*="4.7"]');
    expect(await badge.locator('[role="img"]').count()).toBe(0);
  });
});

test.describe('P1-8 landmark labels unambiguous', () => {
  test('proof strip no longer collides with "Gästebewertungen"', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('section[aria-label="Google-Bewertung"]')).toBeAttached();
    expect(await page.locator('section[aria-label="Bewertungen"]').count()).toBe(0);
  });
});

test.describe('P1-10 footer copyright whitespace', () => {
  test('copyright line reads "© 2026 D\'ouro" with a space', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toContainText('© 2026 D\'ouro');
  });
});

test.describe('P1-9 dead Fraunces italic face removed', () => {
  test('no shipped stylesheet references fraunces-italic', async ({ page }) => {
    await page.goto('/');
    const refs = await page.evaluate(() => {
      const hits: string[] = [];
      for (const sheet of document.styleSheets) {
        let rules: CSSRuleList | null = null;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        if (!rules) continue;
        for (const rule of rules) {
          if (rule instanceof CSSFontFaceRule && rule.style.src.includes('fraunces-italic')) {
            hits.push(rule.style.src);
          }
        }
      }
      return hits;
    });
    expect(refs).toEqual([]);
  });
});
