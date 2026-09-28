import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * P0 regression suite — Design System Investigation HOLD findings.
 *
 * Each test asserts user-visible behavior (reachability, visible focus,
 * controllable motion, clean semantics), never exact class names.
 * Written BEFORE the fixes (TDD RED); all must fail on main @ 50d5ad3.
 */

/* ═══════════════════════════════════════════════════════════════
   P0-1: fixed bottom bar must not own tablet widths or cover content
   ═══════════════════════════════════════════════════════════════ */

test.describe('P0-1 mobile bottom bar', () => {
  test('bar is hidden at 768px and 1024px (phone-only chrome)', async ({ browser }) => {
    for (const width of [768, 1024]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      const page = await context.newPage();
      await page.goto('/');
      await expect(page.locator('[data-mobile-bottom-bar]')).toBeHidden();
      await context.close();
    }
  });

  test('bar is visible on phones and last footer action stays clickable', async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('[data-mobile-bottom-bar]')).toBeVisible();

    // Scroll to the very bottom, then click the last footer link:
    // proves the fixed bar never traps or covers the final action.
    const lastLink = page.locator('footer a').last();
    await lastLink.scrollIntoViewIfNeeded();
    await expect(lastLink).toBeVisible();
    await lastLink.click({ trial: true });
    await context.close();
  });

  test('no horizontal overflow at phone widths', async ({ browser }) => {
    for (const width of [320, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 844 } });
      const page = await context.newPage();
      await page.goto('/');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow).toBeLessThanOrEqual(1);
      await context.close();
    }
  });
});

/* ═══════════════════════════════════════════════════════════════
   P0-2: keyboard focus must be visible on nav controls
   ═══════════════════════════════════════════════════════════════ */

test.describe('P0-2 nav keyboard focus', () => {
  test('Tab to hamburger shows a visible focus ring (mobile)', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');

    // Real keyboard tabbing from the top until the menu trigger is focused.
    // (No mouse click first: clicking would move focus mid-page and switch
    // :focus-visible heuristics to mouse modality.)
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      if ((await page.evaluate(() => document.activeElement?.id)) === 'mobile-menu-btn') break;
    }
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('mobile-menu-btn');

    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const cs = getComputedStyle(el);
      return { style: cs.outlineStyle, width: cs.outlineWidth };
    });
    expect(ring.style).toBe('solid');
    expect(ring.width).toBe('2px');
    await context.close();
  });

  test('drawer open → close button focused → Escape returns focus (mobile)', async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto('/');

    await page.locator('#mobile-menu-btn').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#mobile-menu-close-btn')).toBeFocused();

    const closeRing = await page.evaluate(() => {
      const cs = getComputedStyle(document.activeElement as HTMLElement);
      return { style: cs.outlineStyle, width: cs.outlineWidth };
    });
    expect(closeRing.style).toBe('solid');
    expect(closeRing.width).toBe('2px');

    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('mobile-menu-btn');
    await context.close();
  });
});

/* ═══════════════════════════════════════════════════════════════
   P0-3: testimonial motion must be stoppable by keyboard
   ═══════════════════════════════════════════════════════════════ */

test.describe('P0-3 marquee pause control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('pause button toggles motion and keeps focus', async ({ page }) => {
    const toggle = page.locator('[data-marquee-toggle]');
    await expect(toggle).toBeVisible();
    await toggle.focus();
    await expect(toggle).toBeFocused();

    const track = page.locator('[data-marquee-track]');
    await toggle.click();
    await expect(toggle).toHaveText(/fortsetzen/i);
    await expect
      .poll(async () => track.evaluate((el) => getComputedStyle(el).animationPlayState))
      .toBe('paused');
    await expect(toggle).toBeFocused();

    await toggle.click();
    await expect(toggle).toHaveText(/pausieren/i);
    await expect
      .poll(async () => track.evaluate((el) => getComputedStyle(el).animationPlayState))
      .toBe('running');
  });

  test('explicit stop sticks after focus leaves', async ({ page }) => {
    const toggle = page.locator('[data-marquee-toggle]');
    await toggle.click();
    await expect(toggle).toHaveText(/fortsetzen/i);
    // Tab away: hover/focus-out must NOT resume until re-activated.
    await page.locator('h1').focus();
    await expect
      .poll(async () =>
        page
          .locator('[data-marquee-track]')
          .evaluate((el) => getComputedStyle(el).animationPlayState),
      )
      .toBe('paused');
  });

  test('duplicate track stays hidden from assistive tech', async ({ page }) => {
    const hiddenTrack = page.locator('[data-marquee-track-dup]');
    await expect(hiddenTrack).toHaveAttribute('aria-hidden', 'true');
    expect(await hiddenTrack.locator('a, button').count()).toBe(0);
  });

  test('reduced-motion renders a static track', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    // Deterministic triple, no style-timing race:
    // 1. emulation active, 2. global kill-block zeroes durations (!important,
    // unconditional), 3. the marquee static fallback rule ships in CSS.
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(
      true,
    );
    const track = page.locator('[data-marquee-track]');
    await expect(track).toBeVisible();
    // Render-blocking CSS: the reduced-motion rule applies from first paint,
    // so this is synchronous by load (no poll — the earlier poll masked a
    // whitespace bug in assertion 3 below, not timing).
    expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
    // The CSSOM expands `animation: none` into longhands on serialize
    // (`animation: auto ease 0s 1 normal none running none`), so assert the
    // parsed `animation-name` of the marquee rule inside the reduce block.
    const staticName = await page.evaluate(() => {
      const walk = (rules: CSSRuleList | null): string | null => {
        if (!rules) return null;
        for (const rule of rules) {
          if (
            rule instanceof CSSMediaRule &&
            rule.media.mediaText.includes('prefers-reduced-motion') &&
            rule.media.mediaText.includes('reduce')
          ) {
            for (const inner of rule.cssRules) {
              if (
                inner instanceof CSSStyleRule &&
                inner.selectorText.includes('.animate-marquee') &&
                !inner.selectorText.includes(':hover')
              ) {
                return inner.style.animationName;
              }
            }
          }
          if ('cssRules' in rule) {
            const found = walk((rule as CSSGroupingRule).cssRules);
            if (found !== null) return found;
          }
        }
        return null;
      };
      for (const sheet of document.styleSheets) {
        try {
          const found = walk(sheet.cssRules);
          if (found !== null) return found;
        } catch {
          continue;
        }
      }
      return 'NO_RULE';
    });
    expect(staticName).toBe('none');
    await context.close();
  });
});

/* ═══════════════════════════════════════════════════════════════
   P0-4: hero background must be decorative, not a live region
   ═══════════════════════════════════════════════════════════════ */

test.describe('P0-4 hero decorative semantics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('background layer is hidden from AT; H1 and CTAs stay semantic', async ({ page }) => {
    const bg = page.locator('[data-hero-background]');
    await expect(bg).toHaveAttribute('aria-hidden', 'true');
    expect(await bg.getAttribute('role')).toBeNull();
    expect(await bg.getAttribute('aria-live')).toBeNull();

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Speisekarte ansehen', exact: true }).first())
      .toBeAttached();
  });

  test('axe stays clean with all P0 changes', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
