// CAPTURE: serve dist, screenshot every route × viewport, collect geometry + a11y.
// Usage: node .ui-agent/bin/capture.mjs [--out evidence/<runId>] [--routes /,/menu/] [--viewports 1440x900,390x844]
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const cfg = JSON.parse(readFileSync(join(root, '.ui-agent/config.json'), 'utf8'));

const arg = (k) => {
  const i = process.argv.indexOf(k);
  return i === -1 ? null : process.argv[i + 1];
};
const runId = arg('--out') || `evidence/${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
const onlyRoutes = (arg('--routes') || '').split(',').filter(Boolean);
const onlyVp = (arg('--viewports') || '').split(',').filter(Boolean);
const PORT = 8899;

const routes = cfg.routes.filter((r) => !r.includes('.') && (!onlyRoutes.length || onlyRoutes.includes(r)));
const viewports = cfg.viewports
  .map(([w, h]) => ({ w, h, key: `${w}x${h}` }))
  .filter((v) => !onlyVp.length || onlyVp.includes(v.key));

async function serve() {
  const srv = spawn('node', ['scripts/serve-dist.mjs', '--port', String(PORT)], { cwd: root, stdio: 'ignore' });
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/`);
      if (r.ok) return srv;
    } catch { /* warming */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  srv.kill();
  throw new Error('serve-dist did not start');
}

const out = (...p) => join(root, '.ui-agent', runId, ...p);
const manifest = { runId, startedAt: new Date().toISOString(), port: PORT, pages: [] };

const { chromium } = await import('@playwright/test');
const srv = await serve();
const browser = await chromium.launch();
try {
  for (const route of routes) {
    const slug = route === '/' ? 'home' : route.replaceAll('/', '');
    for (const vp of viewports) {
      const dir = out(slug, vp.key);
      mkdirSync(dir, { recursive: true });
      const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
      const page = await ctx.newPage();
      const rec = { route, viewport: vp.key, ok: true };
      try {
        await page.goto(`http://127.0.0.1:${PORT}${route}`, { waitUntil: 'load', timeout: 45000 });
        await page.waitForTimeout(2200);
        await page.screenshot({ path: join(dir, 'viewport.png') });
        await page.screenshot({ path: join(dir, 'full.png'), fullPage: true });
        rec.geometry = await page.evaluate(() => {
          const q = (s) => document.querySelector(s);
          const box = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
          };
          const main = q('main');
          const kids = main ? Array.from(main.children).filter((el) => {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            return r.height > 2 && cs.display !== 'none';
          }).map((el) => {
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            const f = el.firstElementChild, l = el.lastElementChild;
            const fr = f ? f.getBoundingClientRect() : null, lr = l ? l.getBoundingClientRect() : null;
            return {
              tag: el.tagName, id: el.id || null, label: el.getAttribute('aria-label') || null,
              top: Math.round(r.y + scrollY), h: Math.round(r.height),
              pt: cs.paddingTop, pb: cs.paddingBottom,
              contentTop: fr ? Math.round(fr.y + scrollY) : null,
              contentBottom: lr ? Math.round(lr.y + lr.height + scrollY) : null,
            };
          }) : [];
          const nav = q('nav[data-nav], nav');
          const imgs = Array.from(document.querySelectorAll('main img')).map((img) => {
            const r = img.getBoundingClientRect();
            return { w: Math.round(r.width), h: Math.round(r.height), alt: (img.alt || '').slice(0, 40) };
          });
          return {
            docW: document.documentElement.scrollWidth, winW: window.innerWidth,
            overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
            navBg: nav ? getComputedStyle(nav).backgroundColor : null,
            navH: nav ? Math.round(nav.getBoundingClientRect().height) : null,
            sections: kids, images: imgs.slice(0, 40), imageCount: imgs.length,
          };
        });
        writeFileSync(join(dir, 'geometry.json'), JSON.stringify(rec.geometry, null, 1));
        // a11y: axe on widest + narrowest viewports only (cost control)
        if (vp.w === 1440 || vp.w === 390) {
          const { default: AxeBuilder } = await import('@axe-core/playwright');
          const res = await new AxeBuilder({ page }).analyze();
          rec.a11y = { violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })) };
          writeFileSync(join(dir, 'a11y.json'), JSON.stringify(rec.a11y, null, 1));
        }
      } catch (e) {
        rec.ok = false; rec.error = String(e.message || e).split('\n')[0];
      }
      manifest.pages.push(rec);
      await ctx.close();
      process.stdout.write(`${rec.ok ? 'ok' : 'FAIL'} ${route} ${vp.key}\n`);
    }
  }
} finally {
  await browser.close();
  srv.kill();
}
manifest.finishedAt = new Date().toISOString();
writeFileSync(out('manifest.json'), JSON.stringify(manifest, null, 1));
const fails = manifest.pages.filter((p) => !p.ok).length;
console.log(`captured ${manifest.pages.length - fails}/${manifest.pages.length} → ${runId}`);
process.exit(fails ? 1 : 0);
