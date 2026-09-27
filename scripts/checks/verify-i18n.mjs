#!/usr/bin/env node
/**
 * verify-i18n.mjs — turns "no locale ships until it's fully translated" from
 * a policy into a red build.
 *
 * `LIVE_LOCALES` (src/lib/i18n/locales.ts) is the single gate that decides
 * whether a locale is live. This script is what makes that gate trustworthy:
 * for every live locale other than the default, it requires a dictionary file
 * with 100% `UIKey` coverage — a live locale one key short of complete would
 * otherwise silently fall back to German for that one string in production,
 * with no build signal at all.
 *
 * It also asserts the registry itself is internally consistent (no duplicate
 * locale codes, DEFAULT_LOCALE is actually live), since those are exactly the
 * kind of copy-paste mistakes a hand-edited registry invites.
 *
 * Usage: pnpm check:i18n
 * (imports .ts modules, so it needs Node's --experimental-strip-types)
 */
import { existsSync, readFileSync } from 'node:fs';
import { DEFAULT_LOCALE, LIVE_LOCALES, LOCALE_REGISTRY } from '../../src/lib/i18n/locales.ts';
import { deAT } from '../../src/lib/i18n/messages/de-AT.ts';

const problems = [];
const REQUIRED_KEYS = Object.keys(deAT);
const VALID_STATUSES = ['live', 'planned', 'translation_ready', 'qa_ready'];
// Legal pages stay German-only permanently (business/legal decision) — a
// locale must NEVER gain these siblings, or hreflang/sitemap pairing breaks.
const NON_LEGAL_PAGES = ['index', 'menu', 'about', 'catering', 'contact'];
const LEGAL_PAGES = ['impressum', 'datenschutz'];

const codes = LOCALE_REGISTRY.map((l) => l.code);
const duplicates = codes.filter((c, i) => codes.indexOf(c) !== i);
if (duplicates.length > 0) {
  problems.push(
    `LOCALE_REGISTRY has duplicate locale code(s): ${[...new Set(duplicates)].join(', ')}`,
  );
}

if (!LIVE_LOCALES.includes(DEFAULT_LOCALE)) {
  problems.push(
    `DEFAULT_LOCALE ("${DEFAULT_LOCALE}") is not in LIVE_LOCALES — the default locale must be live.`,
  );
}

for (const entry of LOCALE_REGISTRY) {
  if (!VALID_STATUSES.includes(entry.status)) {
    problems.push(
      `"${entry.code}" has unknown status "${entry.status}" — must be one of ${VALID_STATUSES.join(', ')}.`,
    );
  }
  if (entry.status !== 'live' && !entry.blockedBy?.trim()) {
    problems.push(`"${entry.code}" is "${entry.status}" but has no blockedBy reason.`);
  }
}

// No `i18n.fallback` — it would fill /<locale>/* with German prose the moment
// a locale becomes routable, which is exactly what must never ship.
const astroConfig = readFileSync('astro.config.mjs', 'utf8');
if (/fallback\s*:/.test(astroConfig)) {
  problems.push('astro.config.mjs contains an i18n `fallback` — forbidden (would ship German prose under foreign URLs).');
}

for (const locale of LIVE_LOCALES) {
  if (locale === DEFAULT_LOCALE) continue; // de-AT.ts IS the type source; trivially complete.

  const path = `src/lib/i18n/messages/${locale}.ts`;
  if (!existsSync(path)) {
    problems.push(`"${locale}" is in LIVE_LOCALES but ${path} does not exist.`);
    continue;
  }
  const mod = await import(`../../${path}`);
  const dict = mod[locale.replace(/[^a-zA-Z0-9]/g, '')] ?? mod.default;
  if (!dict || typeof dict !== 'object') {
    problems.push(`${path} exists but doesn't export a recognizable dictionary object.`);
    continue;
  }

  const missing = REQUIRED_KEYS.filter((k) => !(k in dict) || String(dict[k]).trim() === '');
  if (missing.length > 0) {
    problems.push(
      `"${locale}" is in LIVE_LOCALES but ${path} is missing ${missing.length}/${REQUIRED_KEYS.length} key(s): ${missing.join(', ')}`,
    );
  }

  // A live locale needs its 5 real pages (subdirectory /<locale>/*.astro) and
  // must NOT have legal siblings (German-only, permanently).
  for (const page of NON_LEGAL_PAGES) {
    if (!existsSync(`src/pages/${locale}/${page}.astro`)) {
      problems.push(`"${locale}" is in LIVE_LOCALES but src/pages/${locale}/${page}.astro does not exist.`);
    }
  }
  for (const page of LEGAL_PAGES) {
    if (existsSync(`src/pages/${locale}/${page}.astro`)) {
      problems.push(`src/pages/${locale}/${page}.astro must not exist — legal pages stay German-only.`);
    }
  }
}

console.log(
  `Checked ${LOCALE_REGISTRY.length} registry entr${LOCALE_REGISTRY.length === 1 ? 'y' : 'ies'}, ${LIVE_LOCALES.length} live (${LIVE_LOCALES.join(', ')}).`,
);

if (problems.length > 0) {
  console.log(`\nFAIL: ${problems.length} i18n problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}

console.log('\nPASS: every live locale has complete UI-string coverage.');
