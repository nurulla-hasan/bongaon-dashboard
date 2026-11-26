import { apiClient } from "@/lib/api-client";
import type {
  ApiProduct,
  ApiResponse,
  CreateProductPayload,
  GetProductsParams,
  RemoveGalleryImagePayload,
  UpdateProductPayload,
} from "@/types";

export function getProducts(params?: GetProductsParams) {
  return apiClient<ApiResponse<ApiProduct[]>>("/products", { query: params });
}

export function getProductByIdOrSlug(idOrSlug: string) {
  return apiClient<ApiResponse<ApiProduct>>(`/products/${idOrSlug}`);
}

export function createProduct(payload: CreateProductPayload) {
  return apiClient<ApiResponse<ApiProduct>>("/products", {
    method: "POST",
    body: payload,
  });
}

export function updateProduct(id: string, payload: UpdateProductPayload) {
  return apiClient<ApiResponse<ApiProduct>>(`/products/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function uploadProductImage(id: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return apiClient<ApiResponse<ApiProduct>>(`/products/${id}/image`, {
    method: "PATCH",
    body: formData,
  });
}

export function uploadProductGallery(id: string, files: File[]) {
  const formData = new FormData();
  for (const file of files) {
    formData.append("images", file);
  }
  return apiClient<ApiResponse<ApiProduct>>(`/products/${id}/gallery`, {
    method: "PATCH",
    body: formData,
  });
}

export function removeProductGalleryImage(
  id: string,
  payload: RemoveGalleryImagePayload,
) {
  return apiClient<ApiResponse<ApiProduct>>(`/products/${id}/gallery`, {
    method: "DELETE",
    body: payload,
  });
}

export function deleteProduct(id: string) {
  return apiClient<ApiResponse<null>>(`/products/${id}`, {
    method: "DELETE",
  });
}
