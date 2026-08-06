#!/usr/bin/env node
/**
 * command-lint.mjs — checks every command in .ai/commands/README.md's
 * registry has a spec file with all 8 required fields.
 * Spec: evals/ai/agent-commands.json.
 *
 * Usage: node .ai/scripts/command-lint.mjs
 */
import { readFileSync, existsSync } from 'node:fs';

const spec = JSON.parse(readFileSync('evals/ai/agent-commands.json', 'utf-8'));
const { required_fields, commands_to_check } = spec;

let failures = 0;

for (const name of commands_to_check) {
  const path = `.ai/commands/${name}.md`;
  if (!existsSync(path)) {
    console.log(`FAIL ${name}: missing file ${path}`);
    failures++;
    continue;
  }
  const content = readFileSync(path, 'utf-8');
  const missing = required_fields.filter((field) => !content.includes(`**${field}**:`));
  if (missing.length > 0) {
    console.log(`FAIL ${name}: missing fields — ${missing.join(', ')}`);
    failures++;
  } else {
    console.log(`OK   ${name}`);
  }
}

console.log(`\n${commands_to_check.length - failures}/${commands_to_check.length} commands pass.`);
if (failures > 0) process.exit(1);
