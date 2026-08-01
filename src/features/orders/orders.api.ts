import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import type { Order, OrderDetailResponse, OrdersListResponse, OrderStatus } from "./orders.types";

const ordersKeys = {
  all: ["orders"] as const,
  list: (storeId: string, status?: string) =>
    ["orders", storeId, status] as const,
  detail: (orderId: string) => ["orders", orderId] as const,
};

export function useOrdersQuery(storeId: string, status?: string, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: [...ordersKeys.list(storeId, status), page, pageSize],
    queryFn: async () => {
      const params: Record<string, string | number> = { storeId, page, pageSize };
      if (status && status !== "ALL") params.status = status;
      const res = await apiClient.get<OrdersListResponse>(
        "/public/orders/all",
        { params },
      );
      return res.data;
    },
    enabled: !!storeId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useOrderDetailQuery(orderId: string) {
  return useQuery({
    queryKey: ordersKeys.detail(orderId),
    queryFn: async () => {
      const res = await apiClient.get<OrderDetailResponse>(
        `/orders/${orderId}`,
      );
      return res.data.data;
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const res = await apiClient.patch<Order>(
        `/orders/${orderId}`,
        { status },
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ordersKeys.all });
    },
  });
}
