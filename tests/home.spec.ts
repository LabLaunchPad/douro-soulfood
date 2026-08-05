import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Home page E2E tests — D'ouro Soulfood Bistro
 *
 * Tests run at BOTH desktop (1440×900) and mobile (375×812) viewports
 * via the playwright.config.ts project matrix.
 *
 * Assertions match the site's actual shipped German copy and markup
 * (src/pages/index.astro, src/components/NavBar.astro, Footer.astro,
 * HeroSection.astro) — not placeholder English content.
 *
 * Selectors use aria-label, data-*, id, and semantic HTML —
 * no data-testid attributes needed (none exist in the codebase).
 */

/* ═══════════════════════════════════════════════════════════════
   SECTION: Content & Visibility
   ═══════════════════════════════════════════════════════════════ */

test.describe('Home page — content & visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('H1 "Afro-Latin Soul im Herzen von Salzburg" is visible', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText("Afro-Latin Soul im Herzen von Salzburg");
  });

  // Hero CTAs are hidden below the md breakpoint (HeroSection.astro: "hidden md:flex") —
  // on mobile they're reached instead via the NavBar's Speisekarte link and the
  // MobileBottomBar's call/order buttons.
  test('hero primary CTA "Besuchen Sie uns" is visible and navigates to /contact', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hero CTAs are hidden on mobile viewport (hidden md:flex)');

    const primaryCta = page.locator('header a[href="/contact"]', { hasText: 'Besuchen Sie uns' });
    await expect(primaryCta).toBeVisible();

    await primaryCta.click();
    await expect(page).toHaveURL(/\/contact/);
  });

  test('hero secondary CTA "Speisekarte ansehen" navigates to /menu', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Hero CTAs are hidden on mobile viewport (hidden md:flex)');

    const secondaryCta = page.locator('header a[href="/menu"]', { hasText: 'Speisekarte ansehen' });
    await expect(secondaryCta).toBeVisible();

    await secondaryCta.click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test('4.8 star review badge is visible', async ({ page }) => {
    // ReviewBadge component uses aria-label "{rating} von {maxRating} Sternen — {count} {source}"
    const reviewBadge = page.locator('[aria-label*="4.8 von 5 Sternen"]');
    await expect(reviewBadge).toBeVisible();

    const ratingText = page.locator('span.font-semibold.text-brand-gold-ink', { hasText: '4.8' });
    await expect(ratingText).toBeVisible();
  });

  test('"Beliebte Gerichte im D\'ouro Bistro" section is visible', async ({ page }) => {
    const heading = page.locator('h2', { hasText: "Beliebte Gerichte im D'ouro Bistro" });
    await expect(heading).toBeVisible();
  });

  test('"Komplette Speisekarte ansehen" CTA links to /menu', async ({ page }) => {
    const fullMenuCta = page.locator('a[href="/menu"]', { hasText: 'Komplette Speisekarte ansehen' });
    await expect(fullMenuCta).toBeVisible();
  });

  test('"Wie D\'ouro begann" story section is visible', async ({ page }) => {
    const storySection = page.locator('section[aria-label="Unsere Geschichte"]');
    await expect(storySection).toBeVisible();

    await expect(storySection.locator('h2', { hasText: "Wie D'ouro begann" })).toBeVisible();
    await expect(
      storySection.locator('p', { hasText: /D'ouro begann während des Lockdowns/ })
    ).toBeVisible();
  });

  test('FAQ accordion is visible and expands on click', async ({ page }) => {
    const faqSection = page.locator('section[aria-label="Häufig gestellte Fragen"]');
    await expect(faqSection).toBeVisible();

    const firstItem = faqSection.locator('details').first();
    await expect(firstItem).toBeVisible();
    await expect(firstItem).not.toHaveAttribute('open', '');

    // Native <details>/<summary> is keyboard- and screen-reader-accessible by default.
    await firstItem.locator('summary').click();
    await expect(firstItem).toHaveAttribute('open', '');
  });

  test('Footer contains address "Auerspergstraße 10"', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('Auerspergstraße 10', { exact: false })).toBeVisible();
  });

  test('Footer has no links to non-existent routes', async ({ page }) => {
    const footer = page.locator('footer');
    const hrefs = await footer.locator('a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    // gift-cards is not a real page (no route, no content backing it);
    // impressum/datenschutz are real routes (src/pages/impressum.astro, datenschutz.astro).
    for (const href of hrefs) {
      expect(href).not.toBe('/gift-cards');
    }
  });

  test('Footer legal links (Impressum, Datenschutz) navigate to real pages', async ({ page }) => {
    const footer = page.locator('footer');
    const impressum = footer.locator('a[href="/impressum"]', { hasText: 'Impressum' });
    await expect(impressum).toBeVisible();
    await impressum.click();
    await expect(page).toHaveURL(/\/impressum/);
    await expect(page.locator('h1', { hasText: 'Impressum' })).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: Navigation Bar
   Desktop-specific nav link click tests only run on desktop,
   since those links are hidden on mobile (md:flex breakpoint).
   ═══════════════════════════════════════════════════════════════ */

test.describe('Home page — NavBar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('NavBar is present with correct aria-label', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');
    await expect(nav).toBeVisible();
    await expect(nav).toHaveAttribute('aria-label', 'Hauptmenü');
  });

  test('brand logo link to homepage is visible in NavBar', async ({ page }) => {
    const brand = page.locator('nav[data-nav] a[aria-label="D\'ouro Soulfood Homepage"]');
    await expect(brand).toBeVisible();
    await expect(brand).toHaveAttribute('href', '/');
    await expect(brand.locator('img[alt="D\'ouro Soulfood Logo"]')).toBeVisible();
  });

  test('all desktop nav links are present in DOM', async ({ page }) => {
    const nav = page.locator('nav[data-nav]');

    // Expected nav links (German labels from NavBar.astro defaults)
    const expectedLinks = [
      { label: 'Speisekarte', href: '/menu' },
      { label: 'Catering', href: '/catering' },
      { label: 'Über uns', href: '/about' },
      { label: 'Kontakt', href: '/contact' },
    ];

    for (const link of expectedLinks) {
      const navLink = nav.locator(`a[href="${link.href}"]`, { hasText: link.label }).first();
      await expect(navLink).toBeAttached();
    }
  });

  // Desktop-only: nav links are hidden on mobile (md:flex breakpoint)
  test('desktop nav link to /menu is clickable and navigates', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop nav links hidden on mobile viewport');

    const menuLink = page.locator('nav[data-nav] a[href="/menu"]', { hasText: 'Speisekarte' }).first();
    await expect(menuLink).toBeVisible();
    await menuLink.click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test('desktop nav link to /contact is clickable and navigates', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop nav links hidden on mobile viewport');

    const contactLink = page.locator('nav[data-nav] a[href="/contact"]', { hasText: 'Kontakt' }).first();
    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL(/\/contact/);
  });
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: Mobile-specific tests
   Only run in the "mobile" project (viewport ≤ 768px)
   ═══════════════════════════════════════════════════════════════ */

test.describe('Home page — mobile menu', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile-only tests');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hamburger menu button exists on mobile viewport', async ({ page }) => {
    const hamburgerBtn = page.locator('button#mobile-menu-btn');
    await expect(hamburgerBtn).toBeVisible();
    await expect(hamburgerBtn).toHaveAttribute('aria-label', 'Navigationsmenü öffnen');
    await expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('clicking hamburger opens mobile navigation overlay', async ({ page }) => {
    const hamburgerBtn = page.locator('button#mobile-menu-btn');
    const mobileMenu = page.locator('div#mobile-menu');

    // Initially closed
    await expect(mobileMenu).toHaveAttribute('data-open', 'false');

    // Click to open
    await hamburgerBtn.click();

    // Now open
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');
    await expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'true');

    // Mobile nav links should be visible inside the overlay
    const mobileNav = mobileMenu.locator('nav[aria-label="Mobile Navigation Drawer"]');
    await expect(mobileNav).toBeVisible();
  });

  test('mobile navigation links are clickable inside overlay', async ({ page }) => {
    const hamburgerBtn = page.locator('button#mobile-menu-btn');
    await hamburgerBtn.click();

    // Scoped to the drawer's link list — #mobile-menu also has its own
    // top-bar "Speisekarte" quick link, so an unscoped href match here
    // would resolve to two elements and violate Playwright's strict mode.
    const mobileNav = page.locator('nav[aria-label="Mobile Navigation Drawer"]');
    const menuLink = mobileNav.locator('a[href="/menu"]', { hasText: 'Speisekarte' });
    await expect(menuLink).toBeVisible();
    await menuLink.click();
    await expect(page).toHaveURL(/\/menu/);
  });

  test('Escape key closes the mobile menu and returns focus to the toggle', async ({ page }) => {
    const hamburgerBtn = page.locator('button#mobile-menu-btn');
    const mobileMenu = page.locator('div#mobile-menu');

    await hamburgerBtn.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');

    await page.keyboard.press('Escape');

    await expect(mobileMenu).toHaveAttribute('data-open', 'false');
    await expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'false');
    await expect(hamburgerBtn).toBeFocused();
  });

  test('closing hamburger menu restores collapsed state', async ({ page }) => {
    const hamburgerBtn = page.locator('button#mobile-menu-btn');
    const mobileMenu = page.locator('div#mobile-menu');

    // Open
    await hamburgerBtn.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'true');

    // Close by clicking again
    await hamburgerBtn.click();
    await expect(mobileMenu).toHaveAttribute('data-open', 'false');
    await expect(hamburgerBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('sticky mobile bottom bar with call and order actions is visible', async ({ page }) => {
    const bottomBar = page.locator('.mobile-bottom-bar');
    await expect(bottomBar).toBeVisible();
    await expect(bottomBar.getByRole('link', { name: 'Jetzt anrufen' })).toBeVisible();
    await expect(bottomBar.getByRole('link', { name: 'Jetzt online bestellen' })).toBeVisible();
  });
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: Accessibility (axe-core)
   Runs on both desktop and mobile projects
   ═══════════════════════════════════════════════════════════════ */

test.describe('Home page — accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('zero axe accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // Log violations for debugging if any
    if (results.violations.length > 0) {
      console.log(
        'Accessibility violations:',
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

  test('reduced motion disables hero video autoplay', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'emulateMedia reduced-motion is most reliable on Chromium');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const video = page.locator('[data-hero-video]').first();
    await expect(video).toHaveJSProperty('paused', true);
  });
});

/* ═══════════════════════════════════════════════════════════════
   SECTION: SEO & Meta
   ═══════════════════════════════════════════════════════════════ */

test.describe('Home page — SEO meta tags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toContain('Afro-Lateinamerikanische');
  });

  test('page has meta description', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /brasilianische.*Salzburg/);
  });

  test('page has canonical URL', async ({ page }) => {
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', 'https://douro-soulfood.com');
  });

  test('page has Schema.org Restaurant JSON-LD', async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // Parse and verify it's valid JSON with Restaurant type
    const content = await jsonLd.first().textContent();
    const parsed = JSON.parse(content!);
    expect(parsed['@type']).toBe('Restaurant');
  });
});
