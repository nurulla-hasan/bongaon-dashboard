import { apiClient } from "@/lib/api-client";
import type {
  ApiCategory,
  ApiResponse,
  CreateCategoryPayload,
  GetCategoriesParams,
  UpdateCategoryPayload,
} from "@/types";

export function getCategories(params?: GetCategoriesParams) {
  return apiClient<ApiResponse<ApiCategory[]>>("/categories", { query: params });
}

export function getCategoryByIdOrSlug(idOrSlug: string) {
  return apiClient<ApiResponse<ApiCategory>>(`/categories/${idOrSlug}`);
}

export function createCategory(payload: CreateCategoryPayload) {
  return apiClient<ApiResponse<ApiCategory>>("/categories", {
    method: "POST",
    body: payload,
  });
}

export function updateCategory(id: string, payload: UpdateCategoryPayload) {
  return apiClient<ApiResponse<ApiCategory>>(`/categories/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function uploadCategoryImage(id: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return apiClient<ApiResponse<ApiCategory>>(`/categories/${id}/image`, {
    method: "PATCH",
    body: formData,
  });
}

export function deleteCategory(id: string) {
  return apiClient<ApiResponse<null>>(`/categories/${id}`, {
    method: "DELETE",
  });
}
