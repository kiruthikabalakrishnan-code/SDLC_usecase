export function resolveMaxPriceInput(value, isNativeValid, products, currentMaxPrice) {
  if (value === "") return null;
  if (!isNativeValid) return currentMaxPrice;

  const nextMaxPrice = Number(value);
  const prices = products.map(({ price }) => price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  if (!Number.isFinite(nextMaxPrice) || nextMaxPrice < minPrice || nextMaxPrice > maxPrice) {
    return currentMaxPrice;
  }

  return nextMaxPrice;
}
