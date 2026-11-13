import { useMemo, useState } from "react";
import products from "./data/products.json";
import { CATEGORIES, filterProducts, formatPrice } from "./filterProducts.js";
import { resolveMaxPriceInput } from "./priceInput.js";

const PLACEHOLDER_IMAGE = "/placeholder.svg";
const prices = products.map(({ price }) => price);
const MIN_PRICE = Math.min(...prices);
const MAX_PRICE = Math.max(...prices);

function ProductCard({ product }) {
  function usePlaceholderOnError(event) {
    const image = event.currentTarget;
    if (!image.src.endsWith(PLACEHOLDER_IMAGE)) {
      image.onerror = null;
      image.src = PLACEHOLDER_IMAGE;
    }
  }

  return (
    <article className="product-card" aria-label={product.name}>
      <img
        className="product-image"
        src={product.image || PLACEHOLDER_IMAGE}
        alt={product.name}
        onError={usePlaceholderOnError}
      />
      <div className="product-details">
        <h2>{product.name}</h2>
        <p className="product-category">{product.category}</p>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}

export default function ProductSearchApp() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [maxPrice, setMaxPrice] = useState(null);
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const visibleProducts = useMemo(
    () => filterProducts(products, { query, category, maxPrice }),
    [query, category, maxPrice],
  );

  function clearFilters() {
    setQuery("");
    setCategory("All categories");
    setMaxPrice(null);
    setMaxPriceInput("");
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">Find your next favorite</p>
        <h1>Product Search</h1>
        <p className="intro">Browse a curated selection and narrow it down to what you need.</p>
      </header>

      <section className="filter-panel" aria-label="Product filters">
        <div className="filter-field search-field">
          <label htmlFor="product-search">Search by name</label>
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “wireless”"
          />
        </div>
        <div className="filter-field">
          <label htmlFor="product-category">Category</label>
          <select
            id="product-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>All categories</option>
            {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="maximum-price">Maximum price (USD)</label>
          <input
            id="maximum-price"
            type="number"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step="0.01"
            value={maxPriceInput}
            onChange={(event) => {
              const value = event.target.value;
              const isNativeValid = event.currentTarget.validity.valid;
              setMaxPriceInput(value);
              setMaxPrice((currentMaxPrice) =>
                resolveMaxPriceInput(value, isNativeValid, products, currentMaxPrice),
              );
            }}
          />
        </div>
        <button className="clear-button" type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </section>

      <section className="results-section" aria-label="Products">
        <div className="results-heading">
          <h2>Products</h2>
          <span>{visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"}</span>
        </div>
        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <p className="empty-state" role="status">No products found</p>
        )}
      </section>
    </main>
  );
}
