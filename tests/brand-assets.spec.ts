import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Brand-asset + SEO-identity contracts (spec: brand hardening).
 *
 * Covers: file existence + dimension contracts (A/B), HTML head contract (C),
 * SEO/JSON-LD contract (D), HTTP/MIME contract (E), browser contract (F).
 * Visual contract (G) is covered by .ui-agent baselines + section screenshots.
 *
 * All derivatives are generated deterministically by `pnpm brand:build`
 * from already-approved sources (favicon D-mark, apple icon).
 */

const ROOT = process.cwd();
const SITE = 'https://douro-soulfood.com';

test.describe('Brand assets — files & dimensions', () => {
  test('favicon family exists with correct dimensions', async () => {
    // sharp is a devDependency; metadata read from real file headers.
    const { default: sharp } = await import('sharp');
    for (const [file, size] of [
      ['public/favicon-48.png', 48],
      ['public/favicon-32.png', 32],
      ['public/images/logo-square.png', 512],
      ['public/apple-touch-icon.png', 180],
    ] as const) {
      expect(existsSync(join(ROOT, file)), `${file} exists`).toBe(true);
      const meta = await sharp(join(ROOT, file)).metadata();
      expect(meta.width, `${file} square`).toBe(meta.height);
      expect(meta.width, `${file} size`).toBe(size);
    }
    expect(existsSync(join(ROOT, 'public/favicon.ico')), 'favicon.ico exists').toBe(true);
    expect(existsSync(join(ROOT, 'public/apple-touch-icon.png')), 'root apple-touch-icon exists').toBe(true);
  });
});

test.describe('Brand assets — HTML head contract', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('exactly one favicon set + apple + theme-color', async ({ page }) => {
    const icons = await page.locator('link[rel="icon"]').count();
    expect(icons).toBe(3); // svg + 48px + 32px
    await expect(page.locator('link[rel="shortcut icon"][href="/favicon.ico"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"][href="/images/apple-touch-icon.png"]')).toHaveCount(1);
    expect(page.locator('link[rel="manifest"]').count()).resolves.toBe(0); // no fake PWA
    const theme = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(theme).toBe('#FAF8F5');
  });
});

test.describe('Brand assets — SEO identity contract', () => {
  test('single graph, square logo node, no aggregateRating', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('script[type="application/ld+json"]').count()).toBe(1);
    const raw = await page.locator('script[type="application/ld+json"]').innerText();
    expect(raw).not.toContain('aggregateRating');
    const graph = JSON.parse(raw)['@graph'];
    const restaurant = graph.find((n: { '@type': string }) => n['@type'] === 'Restaurant');
    expect(restaurant.logo.url).toBe(`${SITE}/images/logo-square.png`);
    expect(restaurant.logo.width).toBe(512);
    expect(restaurant.logo.height).toBe(512);
    expect(restaurant.hasMap).toContain('query_place_id=ChIJZ5K9XxaRdkcRtUZhEVaeRPo');
    const site = graph.find((n: { '@type': string }) => n['@type'] === 'WebSite');
    expect(site.name).toBe("D'ouro Soulfood Bistro");
    expect(site.url).toBe(`${SITE}/`);
  });

  test('og-default stays 1200x630 and separate from logo', async () => {
    const { default: sharp } = await import('sharp');
    const meta = await sharp(join(ROOT, 'public/images/og-default.jpg')).metadata();
    expect(meta.width).toBe(1200);
    expect(meta.height).toBe(630);
  });
});

test.describe('Brand assets — HTTP/MIME + browser contract', () => {
  test('public brand URLs serve 200 with correct content-type', async ({ request }) => {
    for (const [url, ct] of [
      ['/favicon.svg', 'image/svg+xml'],
      ['/favicon-48.png', 'image/png'],
      ['/favicon-32.png', 'image/png'],
      ['/favicon.ico', 'image/x-icon'],
      ['/images/logo-square.png', 'image/png'],
      ['/apple-touch-icon.png', 'image/png'],
    ] as const) {
      const res = await request.get(url);
      expect(res.status(), `${url} 200`).toBe(200);
      expect((res.headers()['content-type'] || ''), `${url} mime`).toContain(ct);
    }
  });

  test('logos render undistorted with full brand name alt, no console asset errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('response', (r) => {
      if (r.status() >= 400 && /favicon|logo|apple|og-default/.test(r.url())) errors.push(`${r.status()} ${r.url()}`);
    });
    await page.goto('/');
    for (const sel of ['nav[data-nav] img', 'footer img[alt*="Bistro Logo"]']) {
      const logo = page.locator(sel).first();
      await expect(logo).toBeVisible();
      const box = await logo.evaluate((el) => {
        const r = (el as HTMLImageElement).getBoundingClientRect();
        const img = el as HTMLImageElement;
        return { ratio: r.width / Math.max(1, r.height), natural: img.naturalWidth / Math.max(1, img.naturalHeight) };
      });
      expect(Math.abs(box.ratio - box.natural), `${sel} aspect preserved`).toBeLessThan(0.02);
    }
    expect(errors, 'no asset console/network errors').toEqual([]);
  });
});
