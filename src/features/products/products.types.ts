// storeId comes from the authenticated user — injected at submit time, not in the form
export type CreateProductPayload = {
  storeId: string;
  name: string;
  category: string;
  description: string;
  serial: string;
  barcode: string;
  buyingPrice: number;
  sellingPrice: number;
  startingStock: number;
  lowStockThreshold: number;
  createdDate: string; // ISO string
  photoUrl: string;
};

export type ProductFormValues = Omit<
  CreateProductPayload,
  "storeId" | "photoUrl" | "serial"
>;

// Full product shape returned from the API / used in the UI
export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  barcode: string;
  buyingPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  photoUrl: string;
  expiryDate: string;
  createdDate: string;
};

// Response from GET /inventory/products/:productId
export type ProductDetail = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  category: string;
  barcode: string;
  photoUrl: string;
  expiryDate: string;
  itemsInStock: number;
  lowStockThreshold: number;
  sellingPrice: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
  categoryRef?: { id: string; name: string };
};

// Response from GET /inventory/items
export type InventoryItemResponse = {
  id: string;
  storeId: string;
  name: string;
  description: string;
  category: string;
  barcode: string;
  photoUrl: string;
  expiryDate: string;
  itemsInStock: number;
  lowStockThreshold: number;
  sellingPrice: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
  categoryRef?: { id: string; name: string };
};

export type Category = {
  id: string;
  name: string;
};

export type CategoryApiResponse = {
  id: string;
  name: string;
  createdAt: string;
  _count?: { products: number };
};

export type AvailabilityFilter =
  | "all"
  | "in_stock"
  | "low_stock"
  | "out_of_stock";
