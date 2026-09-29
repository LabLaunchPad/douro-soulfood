/**
 * format.ts — price formatting for menu cards.
 *
 * Single home for the de-AT EUR formatter previously copy-pasted in
 * MenuItemCard.astro and MenuBistroCard.astro. Covered by
 * `scripts/checks/verify-format.mjs` (`pnpm check:format`).
 */

/** Format cents to a de-AT EUR display string, e.g. 890 → "€ 8,90". */
export function formatPrice(cents: number): string {
  const euros = cents / 100;
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(euros);
}

/**
 * Dual-price display (e.g. non-alcoholic / alcoholic drink variants).
 * Returns the joined string only when BOTH variants are present,
 * otherwise null — the caller falls back to `formatPrice(priceInCents)`.
 */
export function formatDualPrice(
  priceVariants?: { nonAlcoholic?: number; alcoholic?: number },
): string | null {
  if (
    priceVariants?.nonAlcoholic === undefined ||
    priceVariants?.alcoholic === undefined
  ) {
    return null;
  }
  return `${formatPrice(priceVariants.nonAlcoholic)} / ${formatPrice(priceVariants.alcoholic)}`;
}
