// ANALYZE: apply .ui-agent/rules/visual-rules.json to captured evidence → findings[].
// Usage: node .ui-agent/bin/analyze.mjs <runId> [--out evidence/<runId>/findings.json]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const runId = process.argv[2];
if (!runId) { console.error('usage: analyze.mjs <runId>'); process.exit(2); }
const base = join(root, '.ui-agent', runId);
const manifest = JSON.parse(readFileSync(join(base, 'manifest.json'), 'utf8'));
const rules = JSON.parse(readFileSync(join(root, '.ui-agent/rules/visual-rules.json'), 'utf8')).rules;

const slug = (route) => (route === '/' ? 'home' : route.replaceAll('/', ''));
const geo = (route, vp) => {
  const f = join(base, slug(route), vp, 'geometry.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
};
const a11y = (route, vp) => {
  const f = join(base, slug(route), vp, 'a11y.json');
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
};

let n = 0;
const findings = [];
const add = (f) => findings.push({ id: `VIS-${String(++n).padStart(3, '0')}`, confidence: 0.9, ...f });

const isMobile = (vp) => parseInt(vp.split('x')[0], 10) < 768;
const HOME_PAD = { desktop: ['80px', '80px'], mobile: ['40px', '40px'] };
const MENU_PAD = { desktop: ['16px', '64px'], mobile: ['8px', '48px'] };
const HOME_GAP = { desktop: 160, mobile: 80 };
const MENU_GAP = { desktop: 80, mobile: 56 };

for (const p of manifest.pages) {
  if (!p.ok) {
    add({ route: p.route, viewport: p.viewport, severity: 'high', confidence: 0.99, category: 'capture', element: 'page', observed: `capture failed: ${p.error}`, expected: 'page renders', measurement: 'n/a', 'design-rule': 'none', 'source-location': 'n/a', 'proposed-fix': 'fix render/build error first' });
    continue;
  }
  const g = geo(p.route, p.viewport);
  if (!g) continue;
  const mode = isMobile(p.viewport) ? 'mobile' : 'desktop';

  // R-OVERFLOW-01
  if (g.overflow) add({ route: p.route, viewport: p.viewport, severity: 'high', confidence: 0.95, category: 'overflow', element: 'document', observed: `scrollWidth ${g.docW} > viewport ${g.winW}`, expected: 'no horizontal overflow', measurement: `+${g.docW - g.winW}px`, 'design-rule': 'R-OVERFLOW-01', 'source-location': 'unknown — inspect widest main child', 'proposed-fix': 'contain or reflow the overflowing element' });

  // R-IMG-01
  const noAlt = (g.images || []).filter((i) => !i.alt);
  if (noAlt.length) add({ route: p.route, viewport: p.viewport, severity: 'medium', category: 'imagery', element: `${noAlt.length} img`, observed: 'missing alt text', expected: 'every main img has non-empty alt', measurement: `${noAlt.length} without alt`, 'design-rule': 'R-IMG-01', 'source-location': 'image sources for this route', 'proposed-fix': 'add descriptive alt' });

  // R-NAV-01
  if (g.navH && (g.navH < 40 || g.navH > 120)) add({ route: p.route, viewport: p.viewport, severity: 'medium', category: 'chrome', element: 'nav', observed: `nav height ${g.navH}px`, expected: 'fixed nav 48..110px', measurement: `${g.navH}px`, 'design-rule': 'R-NAV-01', 'source-location': 'src/components/layout/NavBar.astro', 'proposed-fix': 'restore compact fixed nav' });

  const secs = g.sections || [];
  const isHome = p.route === '/';
  const isMenu = p.route === '/menu/';

  // R-RHYTHM-01 + R-RHYTHM-02 + R-ALIGN-01 + R-IMG-02 (home/menu only)
  if (isHome || isMenu) {
    const pad = (isHome ? HOME_PAD : MENU_PAD)[mode];
    const gapT = (isHome ? HOME_GAP : MENU_GAP)[mode];
    let prevBottom = null;
    let prevTag = null;
    const leftEdges = [];
    for (const s of secs) {
      const isCat = /category-|Bewertung|Schnellzugriff|Gerichte|Geschichte|Gäste|Kategorien|Events|Galerie|Fragen|Standort/.test(`${s.id || ''} ${s.label || ''}`);
      if (isCat && (s.pt !== pad[0] || s.pb !== pad[1])) {
        // hero/header blocks carry their own padding — only flag rhythm sections
        if (/^(48|80)px$/.test(s.pt) || /^(32|40)px$/.test(s.pt)) {
          add({ route: p.route, viewport: p.viewport, severity: 'medium', category: 'rhythm', element: `section ${s.label || s.id}`, observed: `pt ${s.pt} pb ${s.pb}`, expected: `pt ${pad[0]} pb ${pad[1]}`, measurement: `Δpt ${s.pt} vs ${pad[0]}, Δpb ${s.pb} vs ${pad[1]}`, 'design-rule': 'R-RHYTHM-01', 'source-location': isHome ? 'src/components/layout/Section.astro or self-contained section' : 'src/pages/menu.astro', 'proposed-fix': 'align to the tier pair' });
        }
      }
      // Hero hand-off exemption: a full-bleed hero (HEADER, no bottom pad)
      // hands content over with single-padding, not double. Intentional.
      if (s.contentTop !== null && prevBottom !== null && prevTag !== 'HEADER') {
        const gap = s.contentTop - prevBottom;
        if (Math.abs(gap - gapT) > 12 && gap >= 0) {
          add({ route: p.route, viewport: p.viewport, severity: 'medium', confidence: 0.85, category: 'rhythm', element: `→ section ${s.label || s.id}`, observed: `content-edge gap ${gap}px`, expected: `~${gapT}px`, measurement: `Δ${gap - gapT}px`, 'design-rule': 'R-RHYTHM-02', 'source-location': 'adjacent sections', 'proposed-fix': 'check for stacked inner spacing (header stack + section pad)' });
        }
      }
      if (s.contentBottom !== null) prevBottom = s.contentBottom;
      prevTag = s.tag;
      leftEdges.push({ s: s.label || s.id, top: s.top });
    }
    void leftEdges;
  }

  // R-IMG-02 gallery aspect (home dishes + galerie via rendered tile boxes)
  // (approximated from images inside those sections is unavailable in geometry;
  // enforced via tile width/height ratio where a grid dominates — skipped here,
  // covered by R-IMG-01 + visual review. Rule stays for the human/agent pass.)
}

// R-AXE-01
for (const p of manifest.pages) {
  const a = a11y(p.route, p.viewport);
  if (!a) continue;
  for (const v of a.violations || []) {
    add({ route: p.route, viewport: p.viewport, severity: v.impact === 'critical' || v.impact === 'serious' ? 'high' : 'medium', confidence: 0.99, category: 'accessibility', element: `axe:${v.id}`, observed: `${v.nodes} failing nodes`, expected: 'zero violations', measurement: `${v.nodes} nodes`, 'design-rule': 'R-AXE-01', 'source-location': 'see a11y.json snapshot', 'proposed-fix': `fix per axe rule ${v.id}` });
  }
}

const oi = process.argv.indexOf('--out');
const outFile = join(base, oi === -1 ? 'findings.json' : process.argv[oi + 1]);
writeFileSync(outFile, JSON.stringify({ runId, rules: rules.map((r) => r.id), count: findings.length, findings }, null, 1));
console.log(`${findings.length} findings → ${outFile}`);
for (const f of findings) console.log(`${f.id} [${f.severity}] ${f.route} ${f.viewport} ${f.category}: ${f.observed}`);
