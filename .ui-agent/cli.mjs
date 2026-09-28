// ui-agent CLI: audit | capture | inspect | fix | verify | baseline | report
// fix prints FIX-READY patch proposals (edit authority stays with the UI Implementer).
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sh = (c) => execSync(c, { cwd: root, stdio: 'inherit' });
const [cmd, ...rest] = process.argv.slice(2);
const lastRun = () => JSON.parse(readFileSync(join(root, '.ui-agent/state/last-run.json'), 'utf8')).runId;

if (cmd === 'audit') sh('node .ui-agent/orchestrator/run.mjs audit');
else if (cmd === 'capture') sh(`node .ui-agent/bin/capture.mjs ${rest.join(' ')}`);
else if (cmd === 'inspect') {
  const id = rest[0] || lastRun();
  sh(`node .ui-agent/bin/analyze.mjs ${id}`);
} else if (cmd === 'fix') {
  const id = rest[0] || lastRun();
  const f = JSON.parse(readFileSync(join(root, '.ui-agent', id, 'findings.json'), 'utf8'));
  console.log(`FIX-READY (${f.count} findings in ${id}) — highest confidence first:`);
  for (const x of [...f.findings].sort((a, b) => b.confidence - a.confidence).slice(0, 10)) {
    console.log(`\n${x.id} [${x.severity}] ${x.route} ${x.viewport} (${x.category})\n  observed: ${x.observed}\n  expected: ${x.expected}\n  source: ${x['source-location']}\n  proposed-fix: ${x['proposed-fix']}`);
  }
  console.log('\nEdit authority: UI Implementer only. Coordinator must serialize edits.');
} else if (cmd === 'verify') {
  const id = rest[0] || lastRun();
  const f = JSON.parse(readFileSync(join(root, '.ui-agent', id, 'findings.json'), 'utf8'));
  const high = f.findings.filter((x) => x.severity === 'high');
  console.log(`verify ${id}: ${f.count} findings, ${high.length} high`);
  for (const x of high) console.log(`  HOLD ${x.id} ${x.route} ${x.viewport}: ${x.observed}`);
  process.exit(high.length ? 1 : 0);
} else if (cmd === 'baseline') sh(`node .ui-agent/orchestrator/run.mjs baseline ${rest.join(' ')}`);
else if (cmd === 'report') {
  const st = JSON.parse(readFileSync(join(root, '.ui-agent/state/last-run.json'), 'utf8'));
  const f = JSON.parse(readFileSync(join(root, '.ui-agent', st.runId, 'findings.json'), 'utf8'));
  console.log(JSON.stringify({ runId: st.runId, gates: st.gates, findings: f.count, vision: JSON.parse(readFileSync(join(root, '.ui-agent/config.json'), 'utf8')).vision.status }, null, 1));
} else { console.error('usage: ui-agent audit|capture|inspect|fix|verify|baseline|report'); process.exit(2); }
