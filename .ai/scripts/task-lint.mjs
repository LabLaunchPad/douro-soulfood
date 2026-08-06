#!/usr/bin/env node
/**
 * task-lint.mjs — checks every task file in .ai/tasks/active/ has the
 * required sections: Outcome, Acceptance criteria, Evidence required.
 * A task missing any of these is under-specified per the task templates
 * in .ai/tasks/templates/.
 *
 * Usage: node .ai/scripts/task-lint.mjs
 * Exit code: 0 if all active tasks pass, 1 otherwise. Exits 0 with a
 * note if .ai/tasks/active/ has no task files (only README.md) — an
 * empty active-task list is not a lint failure.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ACTIVE_DIR = '.ai/tasks/active';
const REQUIRED_SECTIONS = ['## Outcome', '## Acceptance criteria', '## Evidence required'];

const entries = readdirSync(ACTIVE_DIR).filter((f) => f.endsWith('.okf.md'));

if (entries.length === 0) {
  console.log('No active task files found (only README.md, if present) — nothing to lint.');
  process.exit(0);
}

let failCount = 0;

for (const entry of entries) {
  const full = path.join(ACTIVE_DIR, entry);
  const content = readFileSync(full, 'utf-8');
  const missing = REQUIRED_SECTIONS.filter((section) => !content.includes(section));
  if (missing.length > 0) {
    console.error(`FAIL ${entry}: missing section(s): ${missing.join(', ')}`);
    failCount++;
  } else {
    console.log(`PASS ${entry}`);
  }
}

console.log(`\n${entries.length - failCount}/${entries.length} active task(s) passed.`);
process.exit(failCount > 0 ? 1 : 0);
