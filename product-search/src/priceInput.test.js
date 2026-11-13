import { describe, expect, it } from "vitest";
import products from "./data/products.json";
import { resolveMaxPriceInput } from "./priceInput.js";

describe("resolveMaxPriceInput", () => {
  it("accepts inclusive data-derived boundaries, clears to unrestricted, and retains the prior filter for invalid values", () => {
    expect(resolveMaxPriceInput("12.5", true, products, null)).toBe(12.5);
    expect(resolveMaxPriceInput("129.99", true, products, 34)).toBe(129.99);
    expect(resolveMaxPriceInput("", true, products, 24.99)).toBeNull();

    expect(resolveMaxPriceInput("12.49", false, products, 24.99)).toBe(24.99);
    expect(resolveMaxPriceInput("130", false, products, 24.99)).toBe(24.99);
    // Data bounds remain authoritative even if a caller reports native validity incorrectly.
    expect(resolveMaxPriceInput("12.49", true, products, 24.99)).toBe(24.99);
    expect(resolveMaxPriceInput("130", true, products, 24.99)).toBe(24.99);
  });
});
