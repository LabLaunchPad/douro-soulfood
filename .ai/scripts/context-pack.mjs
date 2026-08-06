#!/usr/bin/env node
/**
 * context-pack.mjs — accepts a task type and prints the recommended
 * context files to load, per .ai/routing.md. Keeps the routing table in
 * one place (this file) so it can't silently drift from .ai/routing.md's
 * prose version — if you edit one, edit both.
 *
 * Usage: node .ai/scripts/context-pack.mjs <task-type>
 * Example: node .ai/scripts/context-pack.mjs ui
 * Run with no argument to list available task types.
 */

const ROUTES = {
  ui: ['.ai/packs/design-system.okf.md', '.ai/packs/components.okf.md', '.ai/packs/visual-outcomes.okf.md'],
  cms: ['.ai/packs/content-cms.okf.md', '.ai/packs/architecture.okf.md'],
  performance: ['.ai/packs/performance.okf.md', 'benchmarks/README.md'],
  accessibility: ['.ai/packs/accessibility.okf.md', '.ai/packs/testing.okf.md'],
  security: ['.ai/packs/security.okf.md'],
  'react-island': [
    '.ai/packs/react-islands.okf.md',
    '.ai/packs/performance.okf.md',
    '.ai/packs/components.okf.md',
    '.ai/decisions/no-global-react.okf.md',
  ],
  prebuilt: ['.ai/packs/prebuilt-components.okf.md', '.ai/packs/design-system.okf.md', '.ai/packs/visual-outcomes.okf.md'],
  benchmark: ['.ai/packs/performance.okf.md', 'benchmarks/README.md', 'evals/README.md'],
  seo: ['.ai/packs/seo.okf.md', '.ai/packs/architecture.okf.md'],
  docs: ['(the specific docs/*.md file being changed, plus its pack if one exists — nothing else)'],
  'first-task': ['.ai/packs/repo-overview.okf.md', 'okf/audit/current-state.okf.md'],
};

const taskType = process.argv[2];

if (!taskType) {
  console.log('Usage: node .ai/scripts/context-pack.mjs <task-type>\n');
  console.log('Available task types:');
  for (const key of Object.keys(ROUTES)) console.log(`  - ${key}`);
  process.exit(0);
}

const files = ROUTES[taskType];
if (!files) {
  console.error(`Unknown task type: "${taskType}"`);
  console.error(`Available: ${Object.keys(ROUTES).join(', ')}`);
  process.exit(1);
}

console.log(`Recommended context for task type "${taskType}":\n`);
for (const f of files) console.log(`  - ${f}`);
console.log('\nAlways also read AGENTS.md and .ai/INDEX.md first if this is a new session.');
