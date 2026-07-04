import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/axios";
import type { ApiResponse } from "../auth/auth.types";
import type {
  AssignableRole,
  BackendRole,
  BackendStaffMember,
  CreateRolePayload,
  CreateStaffPayload,
  UpdateRolePayload,
  UserStore,
} from "./staff.types";

export async function getUserStores(userId: string): Promise<UserStore[]> {
  const response = await apiClient.get<ApiResponse<UserStore[]>>(
    `/stores/by-user/${userId}`,
  );
  return response.data.data;
}

export async function getAssignableRoles(
  storeId: string,
): Promise<AssignableRole[]> {
  const response = await apiClient.get<ApiResponse<AssignableRole[]>>(
    "/users/roles",
    { params: { storeId } },
  );
  return response.data.data;
}

export async function createStaff(
  payload: CreateStaffPayload,
): Promise<void> {
  await apiClient.post("/users/staff", payload);
}

// ── Role management ─────────────────────────────────────────────────────────

export async function getRoles(storeId: string): Promise<BackendRole[]> {
  const response = await apiClient.get<ApiResponse<BackendRole[]>>(
    "/users/roles",
    { params: { storeId } },
  );
  return response.data.data;
}

export async function createRole(payload: CreateRolePayload): Promise<BackendRole> {
  const response = await apiClient.post<ApiResponse<BackendRole>>(
    "/roles",
    payload,
  );
  return response.data.data;
}

export async function updateRole(
  roleId: string,
  payload: UpdateRolePayload,
): Promise<BackendRole> {
  const response = await apiClient.patch<ApiResponse<BackendRole>>(
    `/roles/${roleId}`,
    payload,
  );
  return response.data.data;
}

export async function deleteRole(roleId: string): Promise<void> {
  await apiClient.delete(`/roles/${roleId}`);
}

// ── OTP verification ────────────────────────────────────────────────────────

export async function verifyOtp(phone: string, otp: string): Promise<void> {
  await apiClient.post("/auth/verify-otp", { phone, otp });
}

// ── Fetch staff list ────────────────────────────────────────────────────────

export async function fetchStaff(storeId: string): Promise<BackendStaffMember[]> {
  const response = await apiClient.get<ApiResponse<BackendStaffMember[]>>(
    "/users/staff",
    { params: { storeId } },
  );
  return response.data.data;
}

// ── React Query hooks ─────────────────────────────────────────────────────

export function useStaffListQuery(storeId: string) {
  return useQuery({
    queryKey: ["staff", storeId],
    queryFn: () => fetchStaff(storeId),
    enabled: !!storeId,
  });
}
