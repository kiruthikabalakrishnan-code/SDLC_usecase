import { describe, expect, it } from "vitest";
import products from "./data/products.json";
import { CATEGORIES, filterProducts, formatPrice } from "./filterProducts.js";

const sample = [
  { id: "a", name: "Wireless Headphones", category: "Electronics", price: 129.99 },
  { id: "b", name: "Wireless Mouse", category: "Electronics", price: 24.99 },
  { id: "c", name: "Linen Shirt", category: "Clothing", price: 34 },
  { id: "d", name: "Ceramic Mug", category: "Home", price: 12.5 },
];

describe("filterProducts", () => {
  it("matches case-insensitive name substrings and leaves an empty query unrestricted", () => {
    expect(filterProducts(sample, { query: "wIrElEsS" }).map(({ id }) => id)).toEqual(["a", "b"]);
    expect(filterProducts(sample, { query: "not-in-catalog" })).toEqual([]);
    expect(filterProducts(sample, { query: "" })).toHaveLength(sample.length);
  });

  it("supports each approved category and unrestricted All categories", () => {
    expect(CATEGORIES).toEqual(["Electronics", "Clothing", "Home"]);
    for (const category of CATEGORIES) {
      expect(filterProducts(sample, { category }).every((item) => item.category === category)).toBe(true);
    }
    expect(filterProducts(sample, { category: "All categories" })).toHaveLength(sample.length);
  });

  it("includes the maximum-price boundary and excludes prices above it", () => {
    expect(filterProducts(sample, { maxPrice: 24.99 }).map(({ id }) => id)).toEqual(["b", "d"]);
  });

  it("keeps an absent maximum unrestricted, including products at the data maximum", () => {
    expect(filterProducts(sample, { maxPrice: null })).toHaveLength(sample.length);
    expect(filterProducts(sample, { maxPrice: undefined })).toHaveLength(sample.length);
    expect(filterProducts(sample, { maxPrice: 129.99 })).toHaveLength(sample.length);
  });

  it("combines active filters with AND and returns an empty result when no item satisfies all", () => {
    expect(filterProducts(sample, { query: "WIRELESS", category: "Electronics", maxPrice: 25 }).map(({ id }) => id))
      .toEqual(["b"]);
    expect(filterProducts(sample, { query: "wireless", category: "Clothing", maxPrice: 25 })).toEqual([]);
  });
});

describe("local product fixture and formatting", () => {
  it("contains at least ten products with valid fields, categories, and local images", () => {
    expect(products.length).toBeGreaterThanOrEqual(10);
    for (const product of products) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(CATEGORIES).toContain(product.category);
      expect(Number.isFinite(product.price)).toBe(true);
      expect(product.image).toMatch(/^\/[a-z0-9-]+\.svg$/i);
    }
  });

  it("formats USD values with exactly two fraction digits", () => {
    expect(formatPrice(12.5)).toBe("$12.50");
    expect(formatPrice(0)).toBe("$0.00");
  });
});
