#!/usr/bin/env node
/**
 * hook-lint.mjs — checks every hook spec in .ai/hooks/ has the required
 * Trigger/Condition/Action/Output/Failure behavior fields.
 *
 * Usage: node .ai/scripts/hook-lint.mjs
 */
import { readdirSync, readFileSync } from 'node:fs';

const REQUIRED_FIELDS = ['Trigger', 'Condition', 'Action', 'Output', 'Failure behavior'];
const hooksDir = '.ai/hooks';
const hookFiles = readdirSync(hooksDir).filter((f) => f.endsWith('.hook.md'));

let failures = 0;

for (const file of hookFiles) {
  const content = readFileSync(`${hooksDir}/${file}`, 'utf-8');
  const missing = REQUIRED_FIELDS.filter((field) => !content.includes(`**${field}**:`));
  if (missing.length > 0) {
    console.log(`FAIL ${file}: missing fields — ${missing.join(', ')}`);
    failures++;
  } else {
    console.log(`OK   ${file}`);
  }
}

console.log(`\n${hookFiles.length - failures}/${hookFiles.length} hooks pass.`);
if (failures > 0) process.exit(1);
