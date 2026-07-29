export type ProductSpecification = {
  label: string;
  value: string;
};

export type StorefrontProduct = {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  categoryRef?: { id: string; name: string };
  barcode?: string;
  photoUrl?: string;
  images?: string[];
  specifications?: ProductSpecification[];
  sellingPrice: number | string;
  itemsInStock: number | string;
};

export type StorefrontCategory = {
  id: string;
  name: string;
};

export type GalleryProduct = {
  id: string;
  name: string;
  photoUrl: string;
  category: string;
};

export type CartItem = StorefrontProduct & { quantity: number };

export type Notice = {
  message: string;
  severity: "success" | "error";
} | null;

export type CheckoutPayload = {
  customer: {
    name: string;
    phone: string;
    email?: string;
    deliveryAddress: string;
  };
  items: Array<{ productId: string; quantity: number }>;
  storeId: string;
  paymentMethod: "MPESA";
};

export type CheckoutResponse = {
  orderId: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
};
