#!/usr/bin/env node
/**
 * agent-status.mjs — prints a live status summary: active tasks,
 * latest benchmark headline, and known blockers. Prefers this live
 * output over the static .ai/status.md, which can go stale.
 *
 * Usage: node .ai/scripts/agent-status.mjs
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

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

// Latest benchmark — pick the most recently updated report, not a hardcoded
// filename, so this doesn't silently go stale as new reports are added.
const reportsDir = 'benchmarks/reports';
const reportFiles = existsSync(reportsDir)
  ? readdirSync(reportsDir).filter((f) => f.endsWith('.okf.md') && f !== 'BENCHMARK-TEMPLATE.okf.md')
  : [];

// Sort by each file's last git-commit date, not the frontmatter `updated`
// field (often "unknown", a valid OKF value that would wrongly sort first
// as a string) and not filesystem mtime (unreliable — `git checkout` resets
// mtimes to checkout time on a fresh clone, so all files tie).
function lastCommitDate(path) {
  try {
    return execFileSync('git', ['log', '-1', '--format=%aI', '--', path], { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

if (reportFiles.length > 0) {
  const reports = reportFiles.map((f) => {
    const path = `${reportsDir}/${f}`;
    const content = readFileSync(path, 'utf-8');
    const updatedMatch = content.match(/updated: "([^"]+)"/);
    const summaryMatch = content.match(/summary: "([^"]+)"/);
    return {
      file: f,
      commitDate: lastCommitDate(path),
      updated: updatedMatch ? updatedMatch[1] : 'unknown',
      summary: summaryMatch ? summaryMatch[1] : '(not found)',
    };
  });
  reports.sort((a, b) => (a.commitDate < b.commitDate ? 1 : a.commitDate > b.commitDate ? -1 : 0));
  const latest = reports[0];
  console.log(`\nLatest benchmark (${latest.file}, updated ${latest.updated}): ${latest.summary}`);
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
