// storeId comes from the authenticated user — injected at submit time, not in the form
export type CreateProductPayload = {
  storeId: string;
  name: string;
  category: string;
  serial: string;
  barcode: string;
  buyingPrice: number;
  sellingPrice: number;
  startingStock: number;
  lowStockThreshold: number;
  createdDate: string; // ISO string
  photoUrl: string; // ImageKit URL — handled separately
};

// serial is excluded from the form — barcode value is used for both at submit time
export type ProductFormValues = Omit<
  CreateProductPayload,
  "storeId" | "photoUrl" | "serial"
>;

// Full product shape returned from the API / used in the UI
export type Product = {
  id: string;
  name: string;
  category: string;
  barcode: string;
  buyingPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  photoUrl: string;
  createdDate: string;
};

export type Category = {
  id: string;
  name: string;
};

export type AvailabilityFilter =
  | "all"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";
