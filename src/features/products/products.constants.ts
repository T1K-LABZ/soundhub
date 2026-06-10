import type { AvailabilityFilter } from "./products.types";

// UI-only — these labels and chip colours will never come from the API
export const AVAILABILITY_OPTIONS: {
  value: AvailabilityFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "in_stock", label: "In Stock" },
  { value: "low_stock", label: "Low Stock" },
  { value: "out_of_stock", label: "Out of Stock" },
];

export const STOCK_STATUS_COLOR: Record<
  string,
  "success" | "warning" | "error"
> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "error",
};

export const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under KSh 10,000", min: 0, max: 10000 },
  { label: "KSh 10,000 – 50,000", min: 10000, max: 50000 },
  { label: "KSh 50,000 – 100,000", min: 50000, max: 100000 },
  { label: "Over KSh 100,000", min: 100000, max: Infinity },
];
