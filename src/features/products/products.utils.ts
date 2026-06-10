import type { AvailabilityFilter, Product } from "./products.types";

export function getStockStatus(
  product: Product,
): "in_stock" | "low_stock" | "out_of_stock" {
  if (product.stockQuantity === 0) return "out_of_stock";
  if (product.stockQuantity <= product.lowStockThreshold) return "low_stock";
  return "in_stock";
}

export function getStockLabel(product: Product): string {
  const status = getStockStatus(product);
  if (status === "out_of_stock") return "Out of Stock";
  if (status === "low_stock") return "Low Stock";
  return "In Stock";
}

type FilterOptions = {
  search: string;
  category: string;
  availability: AvailabilityFilter;
  priceMin: number;
  priceMax: number;
};

export function filterProducts(
  products: Product[],
  filters: FilterOptions,
): Product[] {
  return products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesCategory =
      filters.category === "all" || product.category === filters.category;
    const matchesAvailability =
      filters.availability === "all" ||
      getStockStatus(product) === filters.availability;
    const matchesPrice =
      product.sellingPrice >= filters.priceMin &&
      product.sellingPrice <= filters.priceMax;

    return (
      matchesSearch && matchesCategory && matchesAvailability && matchesPrice
    );
  });
}
