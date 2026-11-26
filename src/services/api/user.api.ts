import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiUser,
  CreateAdminPayload,
  GetUsersParams,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "@/types";

export function getUsers(params?: GetUsersParams) {
  return apiClient<ApiResponse<ApiUser[]>>("/users", { query: params });
}

export function getUserById(id: string) {
  return apiClient<ApiResponse<ApiUser>>(`/users/${id}`);
}

export function createAdmin(payload: CreateAdminPayload) {
  return apiClient<ApiResponse<ApiUser>>("/users/create-admin", {
    method: "POST",
    body: payload,
  });
}

export function updateUserStatus(id: string, payload: UpdateUserStatusPayload) {
  return apiClient<ApiResponse<ApiUser>>(`/users/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateUserRole(id: string, payload: UpdateUserRolePayload) {
  return apiClient<ApiResponse<ApiUser>>(`/users/${id}/role`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteUser(id: string) {
  return apiClient<ApiResponse<null>>(`/users/${id}`, {
    method: "DELETE",
  });
}
