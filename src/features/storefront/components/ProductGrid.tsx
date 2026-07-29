import { CircularProgress } from "@mui/material";
import { useStorefront } from "../hooks/useStorefront";
import type { StorefrontProduct } from "../storefront.types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  isLoading,
}: {
  products: StorefrontProduct[];
  isLoading: boolean;
}) {
  const { addToCart, comparison, toggleCompare } = useStorefront();
  if (isLoading)
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  if (!products.length)
    return (
      <div className="empty-state">
        <h3>No matching products yet</h3>
        <p>Try another search or category.</p>
      </div>
    );
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selected={comparison.some((item) => item.id === product.id)}
          onAdd={addToCart}
          onCompare={toggleCompare}
        />
      ))}
    </div>
  );
}
