export const CATEGORIES = ["Electronics", "Clothing", "Home"];

export function filterProducts(products, { query = "", category = "All categories", maxPrice = null } = {}) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return products.filter((product) => {
    const matchesName = !normalizedQuery || product.name.toLocaleLowerCase().includes(normalizedQuery);
    const matchesCategory = category === "All categories" || product.category === category;
    const matchesPrice = maxPrice === null || maxPrice === undefined || product.price <= maxPrice;
    return matchesName && matchesCategory && matchesPrice;
  });
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
