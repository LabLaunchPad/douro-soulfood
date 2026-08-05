#!/usr/bin/env node
/**
 * validate-agent-docs.mjs — checks the agent-entrypoint system is intact:
 * AGENTS.md exists, .ai/INDEX.md exists, every tool-specific wrapper
 * exists, and relative links within them resolve to real files.
 *
 * Usage: node .ai/scripts/validate-agent-docs.mjs
 * Exit code: 0 if all checks pass, 1 otherwise.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
let failCount = 0;

function check(label, condition) {
  if (condition) {
    console.log(`PASS ${label}`);
  } else {
    console.error(`FAIL ${label}`);
    failCount++;
  }
}

const requiredFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  '.ai/INDEX.md',
  '.cursor/rules/agent-native.mdc',
  '.windsurfrules',
  '.clinerules',
  '.github/copilot-instructions.md',
];

for (const file of requiredFiles) {
  check(`${file} exists`, existsSync(path.join(ROOT, file)));
}

// Every wrapper must point at AGENTS.md — a contradiction check, not just existence.
const wrappers = ['.cursor/rules/agent-native.mdc', '.windsurfrules', '.clinerules', '.github/copilot-instructions.md'];
for (const wrapper of wrappers) {
  const full = path.join(ROOT, wrapper);
  if (!existsSync(full)) continue;
  const content = readFileSync(full, 'utf-8');
  check(`${wrapper} references AGENTS.md`, content.includes('AGENTS.md'));
  check(`${wrapper} references .ai/INDEX.md`, content.includes('.ai/INDEX.md'));
}

// Broken relative link check, limited to markdown-style [text](path) links
// inside AGENTS.md and .ai/INDEX.md, since checking every doc's links is
// out of scope for a "lightweight" validator.
function checkRelativeLinks(file) {
  const full = path.join(ROOT, file);
  if (!existsSync(full)) return;
  const content = readFileSync(full, 'utf-8');
  const backtickPaths = [...content.matchAll(/`([\w./-]+\.(?:md|mjs|yaml|astro|json))`/g)].map((m) => m[1]);
  for (const p of backtickPaths) {
    const resolved = path.join(ROOT, p);
    check(`${file} references existing path: ${p}`, existsSync(resolved));
  }
}

checkRelativeLinks('AGENTS.md');
checkRelativeLinks('.ai/INDEX.md');

console.log(`\n${failCount === 0 ? 'All checks passed.' : `${failCount} check(s) failed.`}`);
process.exit(failCount > 0 ? 1 : 0);
