#!/usr/bin/env node
/**
 * memory-append.mjs — appends a new learning entry to the correct
 * .ai/memory/*.md file, using the format in
 * .ai/memory/templates/learning-entry.md.
 *
 * Usage: node .ai/scripts/memory-append.mjs <type> "<insight>" "<evidence>" "<recommended-behavior>"
 *   type: constraint | anti-pattern | recurring-failure | preference | approval
 */
import { appendFileSync, existsSync } from 'node:fs';

const TYPE_TO_FILE = {
  constraint: '.ai/memory/learned-constraints.md',
  'anti-pattern': '.ai/memory/anti-patterns.md',
  'recurring-failure': '.ai/memory/recurring-failures.md',
  preference: '.ai/memory/human-preferences.md',
  approval: '.ai/memory/human-approvals.md',
};

const [, , type, insight, evidence, recommended] = process.argv;

if (!type || !insight || !evidence || !recommended) {
  console.error(
    'Usage: node .ai/scripts/memory-append.mjs <type> "<insight>" "<evidence>" "<recommended-behavior>"'
  );
  console.error(`Valid types: ${Object.keys(TYPE_TO_FILE).join(', ')}`);
  process.exit(1);
}

const targetFile = TYPE_TO_FILE[type];
if (!targetFile) {
  console.error(`Unknown type "${type}". Valid types: ${Object.keys(TYPE_TO_FILE).join(', ')}`);
  process.exit(1);
}
if (!existsSync(targetFile)) {
  console.error(`Target file ${targetFile} does not exist — not creating it automatically.`);
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const entry = `
- **Date**: ${date}
- **Source**: manual entry via memory-append.mjs
- **Type**: ${type}
- **Insight**: ${insight}
- **Evidence**: ${evidence}
- **Recommended behavior**: ${recommended}
- **Status**: active
`;

appendFileSync(targetFile, entry);
console.log(`Appended new ${type} entry to ${targetFile}.`);
