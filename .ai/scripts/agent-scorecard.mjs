#!/usr/bin/env node
/**
 * agent-scorecard.mjs — prints the current agent-efficiency scorecard
 * from .ai/dashboards/agent-scorecard.okf.md (a static file, not
 * recomputed — no automated instrumentation exists yet to collect
 * these metrics live).
 *
 * Usage: node .ai/scripts/agent-scorecard.mjs
 */
import { readFileSync } from 'node:fs';

const path = '.ai/dashboards/agent-scorecard.okf.md';
const content = readFileSync(path, 'utf-8');

const tableStart = content.indexOf('| Metric |');
const tableEnd = content.indexOf('\n\n', tableStart);
const table = content.slice(tableStart, tableEnd === -1 ? undefined : tableEnd);

console.log('=== Agent Scorecard (static, see .ai/dashboards/agent-scorecard.okf.md) ===\n');
console.log(table.trim());

const summaryStart = content.indexOf('## Honest summary');
if (summaryStart !== -1) {
  console.log('\n' + content.slice(summaryStart).trim());
}
