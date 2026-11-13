import { expect, test } from "@playwright/test";

test("renders local products with required details and USD prices", async ({ page }) => {
  await page.goto("/");
  const cards = page.getByRole("article");
  await expect(cards).toHaveCount(12);
  await expect(cards.first().getByRole("heading", { name: "Wireless Headphones" })).toBeVisible();
  await expect(cards.first().getByRole("img", { name: "Wireless Headphones" })).toHaveAttribute("src", "/placeholder.svg");
  await expect(cards.first()).toContainText("Electronics");
  await expect(cards.first()).toContainText("$129.99");
  await expect(page.getByRole("spinbutton", { name: "Maximum price (USD)" })).toHaveAttribute("min", "12.5");
  await expect(page.getByRole("spinbutton", { name: "Maximum price (USD)" })).toHaveAttribute("max", "129.99");
  await expect(page.getByRole("combobox", { name: "Category" }).locator("option")).toHaveText([
    "All categories", "Electronics", "Clothing", "Home",
  ]);
});

test("updates on filter changes using AND semantics and clears to unrestricted defaults", async ({ page }) => {
  await page.goto("/");
  const search = page.getByRole("searchbox", { name: "Search by name" });
  const category = page.getByRole("combobox", { name: "Category" });
  const maximum = page.getByRole("spinbutton", { name: "Maximum price (USD)" });

  await search.fill("WIRELESS");
  await expect(page.getByRole("article")).toHaveCount(2);
  await category.selectOption("Electronics");
  await maximum.fill("24.99");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article").filter({ hasText: "Wireless Mouse" })).toHaveCount(1);
  await expect(page.getByRole("article").filter({ hasText: "Wireless Headphones" })).toHaveCount(0);

  await page.getByRole("button", { name: "Clear Filters" }).click();
  await expect(search).toHaveValue("");
  await expect(category).toHaveValue("All categories");
  await expect(maximum).toHaveValue("");
  await expect(page.getByRole("article")).toHaveCount(12);
});

test("keeps the previous valid price filter when below-minimum or above-maximum values are entered", async ({ page }) => {
  await page.goto("/");
  const maximum = page.getByRole("spinbutton", { name: "Maximum price (USD)" });
  const cards = page.getByRole("article");
  const resultCount = page.locator(".results-heading span");

  await maximum.fill("12.50");
  expect(await maximum.evaluate((element) => element.validity.valid)).toBe(true);
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Ceramic Mug");

  await maximum.fill("129.99");
  expect(await maximum.evaluate((element) => element.validity.valid)).toBe(true);
  await expect(cards).toHaveCount(12);

  await maximum.fill("24.99");
  expect(await maximum.evaluate((element) => element.validity.valid)).toBe(true);
  await expect(cards).toHaveCount(6);
  await expect(resultCount).toHaveText("6 items");

  await maximum.fill("12.49");
  expect(await maximum.evaluate((element) => element.validity.valid)).toBe(false);
  await expect(cards).toHaveCount(6);
  await expect(resultCount).toHaveText("6 items");
  await expect(cards.filter({ hasText: "Wireless Mouse" })).toHaveCount(1);

  await maximum.fill("130");
  expect(await maximum.evaluate((element) => element.validity.valid)).toBe(false);
  await expect(cards).toHaveCount(6);
  await expect(resultCount).toHaveText("6 items");
  await expect(cards.filter({ hasText: "Wireless Mouse" })).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveCount(0);

  await page.getByRole("button", { name: "Clear Filters" }).click();
  await expect(maximum).toHaveValue("");
  expect(await maximum.evaluate((element) => element.validity.valid)).toBe(true);
  await expect(cards).toHaveCount(12);
});

test("shows the exact empty-state text for a nonmatching search", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Search by name" }).fill("no matching item");
  await expect(page.getByRole("status")).toHaveText("No products found");
  await expect(page.getByRole("article")).toHaveCount(0);
});

test("uses the same local placeholder when a product image fails", async ({ page }) => {
  await page.goto("/");
  const image = page.getByRole("img", { name: "Wireless Headphones" });
  await image.evaluate((element) => {
    element.src = "/missing-image.svg";
  });
  await expect(image).toHaveAttribute("src", "/placeholder.svg");
});

for (const viewport of [{ width: 375, height: 667 }, { width: 1366, height: 768 }]) {
  test(`reflows without horizontal overflow and keeps controls usable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
    for (const control of [
      page.getByRole("searchbox", { name: "Search by name" }),
      page.getByRole("combobox", { name: "Category" }),
      page.getByRole("spinbutton", { name: "Maximum price (USD)" }),
      page.getByRole("button", { name: "Clear Filters" }),
    ]) {
      await expect(control).toBeVisible();
      await expect(control).toBeEnabled();
      const bounds = await control.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
      expect(bounds.height).toBeGreaterThanOrEqual(40);
    }

    await page.getByRole("searchbox", { name: "Search by name" }).fill("water");
    await page.getByRole("combobox", { name: "Category" }).selectOption("Home");
    await page.getByRole("spinbutton", { name: "Maximum price (USD)" }).fill("16.25");
    await expect(page.getByRole("article")).toHaveCount(1);
    await page.getByRole("button", { name: "Clear Filters" }).click();
    await expect(page.getByRole("article")).toHaveCount(12);
  });
}
