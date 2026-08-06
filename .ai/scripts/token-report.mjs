#!/usr/bin/env node
/**
 * token-report.mjs — estimates token size of key agent docs using a
 * simple chars/4 heuristic (roughly accurate for English/German prose
 * and code; not a real tokenizer, deliberately dependency-light per
 * this repo's "no heavy deps for tooling" convention).
 *
 * Usage: node .ai/scripts/token-report.mjs
 * Exit code: 0 always informational, 1 if AGENTS.md exceeds its budget.
 */
import { readFileSync, existsSync } from 'node:fs';

const CHARS_PER_TOKEN = 4; // rough heuristic, not exact

function estimateTokens(filePath) {
  if (!existsSync(filePath)) return null;
  const content = readFileSync(filePath, 'utf-8');
  return Math.ceil(content.length / CHARS_PER_TOKEN);
}

const AGENTS_MD_BUDGET = 1500;

const files = [
  { path: 'AGENTS.md', budget: AGENTS_MD_BUDGET },
  { path: '.ai/INDEX.md', budget: null },
  { path: '.ai/packs/outcome-operator.okf.md', budget: 2800 },
  { path: '.ai/packs/repo-overview.okf.md', budget: 500 },
  { path: '.ai/packs/architecture.okf.md', budget: 500 },
  { path: '.ai/packs/design-system.okf.md', budget: 500 },
  { path: '.ai/packs/content-cms.okf.md', budget: 500 },
  { path: '.ai/packs/components.okf.md', budget: 500 },
  { path: '.ai/packs/accessibility.okf.md', budget: 500 },
  { path: '.ai/packs/performance.okf.md', budget: 500 },
  { path: '.ai/packs/security.okf.md', budget: 500 },
  { path: '.ai/packs/testing.okf.md', budget: 500 },
  { path: '.ai/packs/react-islands.okf.md', budget: 500 },
  { path: '.ai/packs/prebuilt-components.okf.md', budget: 500 },
  { path: '.ai/packs/visual-outcomes.okf.md', budget: 500 },
  { path: '.ai/packs/seo.okf.md', budget: 500 },
];

let exitCode = 0;
console.log('Doc'.padEnd(45), 'Est. tokens'.padEnd(14), 'Budget', 'Status');
console.log('-'.repeat(80));

for (const { path, budget } of files) {
  const tokens = estimateTokens(path);
  if (tokens === null) {
    console.log(path.padEnd(45), 'MISSING');
    continue;
  }
  const status = budget && tokens > budget ? 'OVER BUDGET' : 'ok';
  if (path === 'AGENTS.md' && status === 'OVER BUDGET') exitCode = 1;
  console.log(
    path.padEnd(45),
    String(tokens).padEnd(14),
    (budget ?? '—').toString().padEnd(6),
    status
  );
}

console.log('\nNote: this is a chars/4 heuristic, not an exact tokenizer count. Treat "OVER BUDGET" as a signal to review, not a hard failure by itself.');
process.exit(exitCode);
