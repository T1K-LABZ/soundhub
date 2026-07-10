import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import type { InventoryItemResponse } from "../products/products.types";

export type Category = {
  id: string;
  name: string;
  storeId: string;
};

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
  createdDate: string;
  photoUrl: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type BatchStatus = "IN_TRANSIT" | "PENDING" | "ACTIVE";

export type ReceiveStockPayload = {
  storeId: string;
  supplier: string;
  expectedDate: string;
  trackingRef: string;
  notes: string;
  createdBy: string;
  items: {
    productId: string;
    quantity: number;
    buyingPrice: number;
    sellingPrice: number;
    status: BatchStatus;
  }[];
};

export type ReceiveStockResponse = {
  batchId: string;
  itemsReceived: number;
  supplier: string;
  receivedAt: string;
};

export type BatchItem = {
  id: string;
  storeId: string;
  productId: string;
  receiptId: string | null;
  quantityReceived: number;
  quantityRemaining: number;
  buyingPrice: string;
  sellingPrice: string;
  status: BatchStatus;
  supplier: string;
  trackingRef: string;
  notes: string;
  expectedDate: string;
  receivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    barcode: string;
    photoUrl: string;
  };
};

export type UpdateBatchPayload = {
  storeId?: string;
  buyingPrice?: number;
  sellingPrice?: number;
  quantity?: number;
  notes?: string;
  status?: BatchStatus;
};

export type StockMovement = {
  id: string;
  storeId: string;
  productId: string;
  userId: string;
  type: string;
  quantity: number;
  unitCost: string;
  totalCost: string;
  stockAfter: number;
  metadata: Record<string, unknown>;
  reason: string | null;
  barcode: string;
  photoUrl: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    barcode: string;
  };
  user: {
    id: string;
    fullName: string;
  };
};

const inventoryKeys = {
  all: ["inventory"] as const,
  items: (storeId: string) => ["inventory", "items", storeId] as const,
  categories: (storeId: string) => ["inventory", "categories", storeId] as const,
  batches: (storeId: string, status?: string) =>
    ["inventory", "batches", storeId, status] as const,
  movements: (storeId: string, productId: string) =>
    ["inventory", "movements", storeId, productId] as const,
};

export function useItemsQuery(storeId: string) {
  return useQuery({
    queryKey: inventoryKeys.items(storeId),
    queryFn: async () => {
      const res = await apiClient.get<{ data: InventoryItemResponse[] }>(
        "/inventory/items",
        { params: { storeId } },
      );
      return res.data.data;
    },
    enabled: !!storeId,
  });
}

export function useProductSearchQuery(storeId: string, search: string) {
  return useQuery({
    queryKey: [...inventoryKeys.items(storeId), "search", search],
    queryFn: async () => {
      const res = await apiClient.get<{ data: InventoryItemResponse[] }>(
        "/inventory/items",
        { params: { storeId, search } },
      );
      return res.data.data;
    },
    enabled: !!storeId && search.length > 0,
  });
}

export function useCategoriesQuery(storeId: string) {
  return useQuery({
    queryKey: inventoryKeys.categories(storeId),
    queryFn: async () => {
      const res = await apiClient.get<{ data: Category[] }>(
        "/inventory/categories",
        { params: { storeId } },
      );
      return res.data.data;
    },
    enabled: !!storeId,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const res = await apiClient.post<InventoryItemResponse>(
        "/inventory/products",
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useUpdateProduct(productId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProductPayload) => {
      const res = await apiClient.patch<InventoryItemResponse>(
        `/inventory/products/${productId}`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useReceiveStock() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReceiveStockPayload) => {
      const res = await apiClient.post<ReceiveStockResponse>(
        "/inventory/receive-stock",
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useBatchesQuery(storeId: string, status?: BatchStatus) {
  return useQuery({
    queryKey: inventoryKeys.batches(storeId, status),
    queryFn: async () => {
      const params: Record<string, string> = { storeId, page: "1", pageSize: "50" };
      if (status) params.status = status;
      const res = await apiClient.get<{ data: BatchItem[]; meta: { total: number } }>(
        "/inventory/batches",
        { params },
      );
      return { items: res.data.data, total: res.data.meta?.total ?? res.data.data.length };
    },
    enabled: !!storeId,
  });
}

export function useUpdateBatch(batchId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateBatchPayload) => {
      const res = await apiClient.patch<BatchItem>(
        `/inventory/batches/${batchId}`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      // Invalidate all inventory queries (batches with any status filter, items, etc.)
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useActivateBatch(batchId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (status: BatchStatus) => {
      const res = await apiClient.post<BatchItem>(
        `/inventory/batches/${batchId}/activate`,
        { status },
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useStockMovementsQuery(storeId: string, productId: string) {
  return useQuery({
    queryKey: inventoryKeys.movements(storeId, productId),
    queryFn: async () => {
      const res = await apiClient.get<{ data: StockMovement[]; meta: { total: number } }>(
        "/inventory/movements",
        { params: { storeId, productId, page: 1, pageSize: 50 } },
      );
      return { movements: res.data.data, total: res.data.meta?.total ?? res.data.data.length };
    },
    enabled: !!storeId && !!productId,
  });
}
