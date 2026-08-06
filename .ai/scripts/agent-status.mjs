#!/usr/bin/env node
/**
 * agent-status.mjs — prints a live status summary: active tasks,
 * latest benchmark headline, and known blockers. Prefers this live
 * output over the static .ai/status.md, which can go stale.
 *
 * Usage: node .ai/scripts/agent-status.mjs
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';

console.log('=== Agent Status (live) ===\n');

// Active tasks
const activeDir = '.ai/tasks/active';
const activeTasks = readdirSync(activeDir).filter((f) => f.endsWith('.okf.md'));
console.log(`Active tasks: ${activeTasks.length === 0 ? 'none' : activeTasks.join(', ')}`);

// Backlog count
const backlogDir = '.ai/tasks/backlog';
const backlogReadme = readFileSync(`${backlogDir}/README.md`, 'utf-8');
const backlogItems = (backlogReadme.match(/^- \*\*/gm) || []).length;
console.log(`Backlog items (known follow-ups): ${backlogItems}`);

// Latest benchmark
const benchReportPath = 'benchmarks/reports/PERF-POST-MIGRATION.okf.md';
if (existsSync(benchReportPath)) {
  const report = readFileSync(benchReportPath, 'utf-8');
  const summaryMatch = report.match(/summary: "([^"]+)"/);
  console.log(`\nLatest benchmark summary: ${summaryMatch ? summaryMatch[1] : '(not found)'}`);
} else {
  console.log('\nLatest benchmark: none collected yet.');
}

// Known blockers, pulled from .ai/status.md's "Current blockers" section if present
const statusPath = '.ai/status.md';
if (existsSync(statusPath)) {
  const status = readFileSync(statusPath, 'utf-8');
  const blockersMatch = status.match(/## Current blockers\n([\s\S]*?)\n##/);
  if (blockersMatch) {
    console.log('\nKnown blockers (from .ai/status.md, may be stale — verify before relying on this):');
    console.log(blockersMatch[1].trim());
  }
}

console.log('\nNote: this is a live-computed summary of active tasks + latest benchmark;\nblockers are read from the static .ai/status.md and may be stale.');
