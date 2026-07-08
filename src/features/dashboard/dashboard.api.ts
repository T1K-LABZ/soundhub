import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";

export type DashboardMovement = {
  id: string;
  type: string;
  quantity: number;
  stockAfter: number;
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

export type DashboardData = {
  totalProducts: number;
  totalItemsInStock: number;
  lowStockItems: number;
  totalSalesToday: number;
  todayRevenue: number;
  totalJobsToday: number;
  recentMovements: DashboardMovement[];
};

export type DashboardResponse = {
  success: boolean;
  data: DashboardData;
  message: string;
};

const dashboardKeys = {
  all: ["dashboard"] as const,
  summary: (storeId: string) => ["dashboard", "summary", storeId] as const,
};

export function getDashboard(storeId: string): Promise<DashboardResponse> {
  return apiClient
    .get("/jobs/dashboard", { params: { storeId } })
    .then((res) => res.data);
}

export function useDashboardQuery(storeId: string) {
  return useQuery({
    queryKey: dashboardKeys.summary(storeId),
    queryFn: () => getDashboard(storeId),
    enabled: !!storeId,
  });
}
