#!/usr/bin/env node
/**
 * verify-format.mjs — pins `src/lib/format.ts` price output.
 *
 * Menu prices are legal/commercial content: a formatter regression that
 * turns €8,90 into €8.9 (or drops the currency) would ship wrong prices
 * to every menu card. These assertions pin the exact de-AT strings.
 *
 * Usage: pnpm check:format
 * (imports a .ts module, so it needs Node's --experimental-strip-types)
 */
import { formatPrice, formatDualPrice } from '../../src/lib/format.ts';

const cases = [
  [formatPrice(890), '€ 8,90', 'single price'],
  [formatPrice(1250), '€ 12,50', 'two-digit euros'],
  [formatPrice(0), '€ 0,00', 'zero'],
  [formatDualPrice({ nonAlcoholic: 450, alcoholic: 690 }), '€ 4,50 / € 6,90', 'dual price'],
  [formatDualPrice({ nonAlcoholic: 450 }), null, 'partial variants fall back'],
  [formatDualPrice(undefined), null, 'missing variants fall back'],
];

let failed = 0;
for (const [actual, expected, label] of cases) {
  if (actual !== expected) {
    console.error(`FAIL ${label}: got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`${failed} format assertion(s) failed.`);
  process.exit(1);
}
console.log(`PASS: all ${cases.length} price-format assertions hold.`);
