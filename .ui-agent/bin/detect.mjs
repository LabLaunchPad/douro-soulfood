// BOOT probe: auto-detect repo reality → .ui-agent/config.json
// No assumptions: framework, PM, routes, browsers, vision all detected.
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = (...p) => join(root, '.ui-agent', ...p);
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const has = (f) => existsSync(join(root, f));
const tryExec = (cmd, timeout = 8000) => {
  try { return execSync(cmd, { timeout, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim(); }
  catch { return null; }
};

// framework: astro config > next config > vite
let framework = 'unknown';
if (has('astro.config.mjs') || has('astro.config.mts') || has('astro.config.ts')) framework = 'astro';
else if (has('next.config.js') || has('next.config.mjs')) framework = 'next';
else if (has('vite.config.ts') || has('vite.config.js')) framework = 'vite';

// routes: pages dir per framework
const routes = [];
if (framework === 'astro' && has('src/pages')) {
  const walk = (dir, base) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith('_') || e.name.startsWith('[')) continue;
      const full = join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== 'dev') walk(full, base + e.name + '/'); }
      else if (/\.(astro|ts)$/.test(e.name) && !e.name.startsWith('_')) {
        const name = e.name.replace(/\.(astro|ts)$/, '');
        if (name === '404' || name === '500') continue;
        const route = '/' + (base + (name === 'index' ? '' : name)).replace(/\/$/, '');
        routes.push(route === '/' ? '/' : route + '/');
      }
    }
  };
  walk(join(root, 'src/pages'), '');
}

// browsers: playwright cache families present?
let browsers = [];
for (const home of [process.env.PLAYWRIGHT_BROWSERS_PATH, join(process.env.USERPROFILE || process.env.HOME || '', '.cache/ms-playwright')]) {
  if (!home || !existsSync(home)) continue;
  for (const e of readdirSync(home)) {
    const m = e.match(/^(chromium|firefox|webkit)-/);
    if (m && !browsers.includes(m[1])) browsers.push(m[1]);
  }
}

// vision: ollama binary + models?
let vision = { provider: 'none', models: [], selected: null, status: 'VISION_DEGRADED' };
const ollamaVer = tryExec('ollama --version');
if (ollamaVer) {
  const list = tryExec('ollama list') || '';
  const models = list.split('\n').slice(1).map((l) => l.split(/\s+/)[0]).filter(Boolean);
  const want = ['qwen3-vl:2b', 'qwen3-vl:4b', 'gemma3:4b'];
  const pick = want.find((w) => models.some((m) => m.startsWith(w.split(':')[0])));
  vision = { provider: 'ollama', models, selected: pick || null, status: pick ? 'VISION_READY' : 'VISION_DEGRADED' };
}

// tokens: harvest color/spacing/radius custom props
const tokens = { colors: [], spacing: [], radius: [] };
const cssFiles = ['src/styles/tokens.css', 'src/styles/global.css', 'src/index.css'].filter(has);
for (const f of cssFiles) {
  const css = readFileSync(join(root, f), 'utf8');
  for (const m of css.matchAll(/--color-([\w-]+)\s*:/g)) tokens.colors.push(m[1]);
  for (const m of css.matchAll(/--spacing-([\w-]+)\s*:\s*([^;]+);/g)) tokens.spacing.push(`${m[1]}=${m[2].trim()}`);
  for (const m of css.matchAll(/--radius-([\w-]+)\s*:\s*([^;]+);/g)) tokens.radius.push(`${m[1]}=${m[2].trim()}`);
}
tokens.colors = [...new Set(tokens.colors)];

const cfg = {
  generatedAt: new Date().toISOString(),
  root,
  framework,
  packageManager: existsSync(join(root, 'pnpm-lock.yaml')) ? 'pnpm' : existsSync(join(root, 'package-lock.json')) ? 'npm' : 'unknown',
  scripts: { build: pkg.scripts?.build || null, dev: pkg.scripts?.dev || null, preview: pkg.scripts?.['serve:dist'] || pkg.scripts?.preview || null },
  e2e: pkg.devDependencies?.['@playwright/test'] ? 'playwright' : 'none',
  a11y: pkg.devDependencies?.['@axe-core/playwright'] ? 'axe-playwright' : 'none',
  routes: routes.sort(),
  viewports: [[375, 812], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1440, 900]],
  browsers: browsers.length ? browsers : ['chromium(unverified)'],
  tokens: { cssFiles, ...tokens },
  vision,
};
mkdirSync(out(), { recursive: true });
writeFileSync(out('config.json'), JSON.stringify(cfg, null, 2));
console.log(JSON.stringify({ framework, routes: cfg.routes, browsers: cfg.browsers, vision: vision.status, model: vision.selected }, null, 1));
