import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import type { CustomerLookupItem, Job, ServiceDefinition } from "./sales.types";

export type CreateServicePayload = {
  storeId: string;
  name: string;
  code: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  skillLevel: string;
};

export type UpdateServicePayload = Partial<CreateServicePayload>;

const serviceKeys = {
  all: ["services"] as const,
  list: (storeId: string) => ["services", storeId] as const,
};

const customerKeys = {
  lookup: (storeId: string, phone: string) => ["customers", storeId, phone] as const,
};

export function useCustomerLookupQuery(storeId: string, phone: string) {
  const sanitized = phone.replace(/\s/g, "");
  return useQuery({
    queryKey: customerKeys.lookup(storeId, sanitized),
    queryFn: async () => {
      const res = await apiClient.get<{ data: CustomerLookupItem[] }>(
        "/customers",
        { params: { storeId, search: sanitized } },
      );
      const items = res.data.data;
      return items.length > 0 ? items[0] : null;
    },
    enabled: !!storeId && sanitized.length >= 10,
  });
}

export function useServicesQuery(storeId: string, search?: string) {
  return useQuery({
    queryKey: [...serviceKeys.list(storeId), search],
    queryFn: async () => {
      const params: Record<string, string> = { storeId };
      if (search) params.search = search;
      const res = await apiClient.get<{ data: ServiceDefinition[] }>(
        "/service-catalog",
        { params },
      );
      return res.data.data;
    },
    enabled: !!storeId,
  });
}

export function useCreateService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      const res = await apiClient.post<{ data: ServiceDefinition }>(
        "/service-catalog",
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useUpdateService(serviceId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateServicePayload) => {
      const res = await apiClient.patch<{ data: ServiceDefinition }>(
        `/service-catalog/${serviceId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, storeId }: { serviceId: string; storeId: string }) => {
      await apiClient.delete(`/service-catalog/${serviceId}`, {
        params: { storeId },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: serviceKeys.all });
    },
  });
}

// ── Jobs ──────────────────────────────────────────────────────────────────

export type SalesStats = {
  totalSalesThisMonth: number;
  totalJobs: number;
  totalSales: number;
  paidJobs: number;
  unpaidJobs: number;
  totalDeposits: number;
  pendingJobs: number;
  completedJobs: number;
  inProgressJobs: number;
};

const jobKeys = {
  all: ["jobs"] as const,
  list: (storeId: string) => ["jobs", storeId] as const,
  stats: (storeId: string) => ["jobs", "stats", storeId] as const,
};

export function useSalesStatsQuery(storeId: string) {
  return useQuery({
    queryKey: jobKeys.stats(storeId),
    queryFn: async () => {
      const res = await apiClient.get<{ data: SalesStats }>("/jobs/stats", {
        params: { storeId },
      });
      return res.data.data;
    },
    enabled: !!storeId,
  });
}

export function useJobsQuery(storeId: string, params?: Record<string, string>) {
  return useQuery({
    queryKey: [...jobKeys.list(storeId), params],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Record<string, unknown>[] }>("/jobs/all", {
        params: { storeId, ...params },
      });
      return (res.data.data || []).map(normalizeJob).filter(Boolean) as Job[];
    },
    enabled: !!storeId,
  });
}

function normalizeJob(rec: Record<string, unknown>): Job | null {
  if (rec.jobRef) return rec as unknown as Job;
  return null;
}

// ── Counter sales ──────────────────────────────────────────────────────────

export type CounterSalePayload = {
  storeId: string;
  customerName: string;
  customerPhone: string;
  products: { productId: string; productName: string; quantity: number; unitPrice: number; lineTotal: number }[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentReference?: string;
  servedBy: string;
  notes?: string;
};

export type CounterSaleResponse = {
  id: string;
  jobRef: string;
  customerName: string;
  customerPhone: string;
  customer: { id: string; name: string; phone: string };
  serviceType: string;
  products: { productId: string; productName: string; quantity: number; unitPrice: number; lineTotal: number }[];
  productsSubtotal: number;
  servicesSubtotal: number;
  grandTotal: number;
  paymentStatus: string;
  paymentMethod: string;
  servedBy: string;
  jobStatus: string;
  createdAt: string;
};

export function useCreateCounterSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CounterSalePayload) => {
      const res = await apiClient.post<{ data: CounterSaleResponse }>(
        "/counter-sales",
        payload,
      );
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

// ── Jobs (create) ──────────────────────────────────────────────────────────

export type CreateJobPayload = {
  storeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  carPlate: string;
  carMake: string;
  carModel: string;
  carVariant: string;
  carYear: number;
  serviceType: string;
  services: ServiceDefinition[];
  products: { productId: string; productName: string; quantity: number; unitPrice: number; lineTotal: number }[];
  productsSubtotal: number;
  servicesSubtotal: number;
  discount: number;
  grandTotal: number;
  paymentStatus: string;
  depositAmount?: number;
  balanceRemaining?: number;
  paymentMethod: string;
  mpesaRef?: string;
  paymentDate: string;
  technicianName: string;
  jobStatus: string;
  installationNotes: string;
  issuesEncountered?: string;
  issuesResolution?: string;
  difficultyRating: string;
  followUpNeeded: boolean;
  followUpNotes?: string;
};

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const res = await apiClient.post<{ data: Job }>("/jobs", payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, payload }: { jobId: string; payload: Partial<CreateJobPayload> }) => {
      const res = await apiClient.patch<{ data: Job }>(`/jobs/${jobId}`, payload);
      return res.data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.all });
    },
  });
}
