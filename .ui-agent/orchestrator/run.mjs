// ORCHESTRATOR (coordinator): the only role that declares completion.
// audit:  build → capture → analyze → gates → state
// prove:  diff before/after + re-analyze + gates (the FIND→EDIT→RENDER→COMPARE→VERIFY loop;
//         EDIT itself is the UI Implementer's job — this verifies it honestly).
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const sh = (cmd, timeout = 1500000) => execSync(cmd, { cwd: root, timeout }).toString();
const slug = (r) => (r === '/' ? 'home' : r.replaceAll('/', ''));

const cmd = process.argv[2];
const arg = (k) => { const i = process.argv.indexOf(k); return i === -1 ? null : process.argv[i + 1]; };

function gatesFor(runId) {
  const base = join(root, '.ui-agent', runId);
  const findings = JSON.parse(readFileSync(join(base, 'findings.json'), 'utf8')).findings;
  const by = (sev) => findings.filter((f) => f.severity === sev);
  return {
    FUNCTIONAL_PASS: true, // set by audit() only when build exit 0
    VISUAL_PASS: !by('high').some((f) => ['overflow', 'rhythm', 'alignment'].includes(f.category)),
    RESPONSIVE_PASS: !findings.some((f) => f.category === 'overflow'),
    ACCESSIBILITY_PASS: !findings.some((f) => f.category === 'accessibility'),
    DESIGN_SYSTEM_PASS: !findings.some((f) => f['design-rule']?.startsWith('R-') && f.severity === 'high'),
    REGRESSION_PASS: null, // set by prove() via baseline compare
    high: by('high').length, medium: findings.filter((f) => f.severity === 'medium').length,
  };
}

if (cmd === 'audit') {
  const id = `evidence/${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}`;
  console.log('== ui-agent audit: build ==');
  sh('pnpm build');
  console.log('== ui-agent audit: capture ==');
  sh(`node .ui-agent/bin/capture.mjs --out ${id}`);
  console.log('== ui-agent audit: analyze ==');
  sh(`node .ui-agent/bin/analyze.mjs ${id}`);
  const gates = gatesFor(id);
  mkdirSync(join(root, '.ui-agent/state'), { recursive: true });
  writeFileSync(join(root, '.ui-agent/state/last-run.json'), JSON.stringify({ runId: id, at: new Date().toISOString(), gates }, null, 1));
  console.log('GATES ' + JSON.stringify(gates, null, 1));
} else if (cmd === 'prove') {
  // node .ui-agent/orchestrator/run.mjs prove --before <runA> --after <runB> --fix VIS-001 --expect "radius 24→20px on menu photo card"
  const before = arg('--before'), after = arg('--after'), fix = arg('--fix');
  const { diffPng } = await import('../visual/png.mjs');
  const route = arg('--route') || '/menu', vp = arg('--viewport') || '1440x900';
  const fa = join(root, '.ui-agent', before, slug(route), vp, 'full.png');
  const fb = join(root, '.ui-agent', after, slug(route), vp, 'full.png');
  const diffFile = join(root, '.ui-agent', after, `diff-${slug(route)}-${vp}.png`);
  const d = diffPng(fa, fb, diffFile);
  const fbF = JSON.parse(readFileSync(join(root, '.ui-agent', after, 'findings.json'), 'utf8')).findings;
  const faF = JSON.parse(readFileSync(join(root, '.ui-agent', before, 'findings.json'), 'utf8')).findings;
  const fixedGone = fix ? !fbF.some((f) => f.id === fix) && faF.some((f) => f.id === fix) : null;
  const newHigh = fbF.filter((f) => f.severity === 'high' && !faF.some((o) => o.id === f.id));
  // map old IDs onto new run by signature (IDs restart per run): compare by route+category+element
  const sig = (f) => `${f.route}|${f.viewport}|${f.category}|${f.element}`;
  const beforeSigs = new Set(faF.map(sig));
  const genuinelyNew = fbF.filter((f) => !beforeSigs.has(sig(f)) && f.severity === 'high');
  const gates = {
    ...(fixedGone === null ? {} : { FIX_VERIFIED: fixedGone }),
    VISUAL_PASS: d.changedPct < 5 || !!arg('--expect'),
    REGRESSION_PASS: genuinelyNew.length === 0,
    ACCESSIBILITY_PASS: !fbF.some((f) => f.category === 'accessibility'),
    RESPONSIVE_PASS: !fbF.some((f) => f.category === 'overflow'),
  };
  console.log(JSON.stringify({ before, after, route, viewport: vp, diff: d, fixedGone, newHigh: genuinelyNew.map(sig), gates }, null, 1));
} else if (cmd === 'baseline') {
  // node .ui-agent/orchestrator/run.mjs baseline --from <runId> --reason "why"
  const from = arg('--from'), reason = arg('--reason');
  if (!from || !reason) { console.error('baseline requires --from <runId> and --reason "..." (BASELINE_UPDATED_REASON)'); process.exit(2); }
  const { decodePng, downscale, encodePng } = await import('../visual/png.mjs');
  const dest = join(root, '.ui-agent/baselines', from.replace('evidence/', ''));
  mkdirSync(dest, { recursive: true });
  const manifest = JSON.parse(readFileSync(join(root, '.ui-agent', from, 'manifest.json'), 'utf8'));
  const meta = { from, reason, at: new Date().toISOString(), commit: execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim(), browser: 'chromium', entries: [] };
  for (const p of manifest.pages) {
    for (const vp of ['1440x900', '390x844']) {
      const src = join(root, '.ui-agent', from, slug(p.route), vp, 'full.png');
      if (!existsSync(src)) continue;
      const small = downscale(decodePng(src), 720);
      const name = `${slug(p.route)}-${vp}.png`;
      writeFileSync(join(dest, name), encodePng(small.w, small.h, small.ch, small.px));
      meta.entries.push({ route: p.route, viewport: vp, file: name });
    }
    const g = join(root, '.ui-agent', from, slug(p.route), '1440x900', 'geometry.json');
    if (existsSync(g)) copyFileSync(g, join(dest, `${slug(p.route)}-geometry.json`));
  }
  writeFileSync(join(dest, 'baseline.json'), JSON.stringify(meta, null, 1));
  console.log(`baseline written → ${dest} (${meta.entries.length} shots) reason: ${reason}`);
} else {
  console.error('usage: run.mjs audit | prove --before A --after B [--fix VIS-xxx] | baseline --from <run> --reason "..."');
  process.exit(2);
}
