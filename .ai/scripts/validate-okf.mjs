#!/usr/bin/env node
/**
 * validate-okf.mjs — checks every *.okf.md file has the required OKF
 * frontmatter fields. Dependency-light: parses frontmatter with a plain
 * regex line-scan instead of pulling in a YAML library, since this
 * repo's OKF frontmatter is always flat top-level keys.
 *
 * Usage: node .ai/scripts/validate-okf.mjs
 * Exit code: 0 if all files pass, 1 if any fail.
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const REQUIRED_FIELDS = ['okf_version', 'id', 'type', 'title', 'status', 'summary', 'load_when'];

function findOkfFiles() {
  // Avoid a glob dependency: use `find`, which is available in this
  // repo's dev/CI environments (Linux/macOS). If it's unavailable,
  // fail loudly rather than silently checking nothing.
  try {
    const out = execSync('find . -name "*.okf.md" -not -path "./node_modules/*" -not -path "./.git/*"', {
      encoding: 'utf-8',
    });
    return out.split('\n').filter(Boolean);
  } catch (err) {
    console.error('Could not enumerate *.okf.md files via `find`:', err.message);
    process.exit(1);
  }
}

function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  return match[1];
}

function hasField(frontmatter, field) {
  // Matches "field:" at the start of a line (allowing leading whitespace).
  return new RegExp(`^\\s*${field}\\s*:`, 'm').test(frontmatter);
}

const files = findOkfFiles();
let failCount = 0;

for (const file of files) {
  const content = readFileSync(file, 'utf-8');
  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    console.error(`FAIL ${file}: no frontmatter block found`);
    failCount++;
    continue;
  }

  const missing = REQUIRED_FIELDS.filter((f) => !hasField(frontmatter, f));
  if (missing.length > 0) {
    console.error(`FAIL ${file}: missing field(s): ${missing.join(', ')}`);
    failCount++;
  }
}

console.log(`\nChecked ${files.length} OKF file(s). ${files.length - failCount} passed, ${failCount} failed.`);
process.exit(failCount > 0 ? 1 : 0);
