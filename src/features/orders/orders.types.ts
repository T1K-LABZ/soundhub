export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

export type OrderProduct = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  products: OrderProduct[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type OrdersListResponse = {
  success: boolean;
  data: Order[];
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export type OrderDetailResponse = {
  success: boolean;
  data: Order;
  message: string;
};
