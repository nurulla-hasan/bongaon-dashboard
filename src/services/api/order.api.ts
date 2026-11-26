import { apiClient } from "@/lib/api-client";
import type {
  ApiOrder,
  ApiResponse,
  GetOrdersParams,
  UpdateOrderStatusPayload,
} from "@/types";

export function getOrders(params?: GetOrdersParams) {
  return apiClient<ApiResponse<ApiOrder[]>>("/orders", { query: params });
}

export function getOrderById(id: string) {
  return apiClient<ApiResponse<ApiOrder>>(`/orders/${id}`);
}

export function updateOrderStatus(
  id: string,
  payload: UpdateOrderStatusPayload,
) {
  return apiClient<ApiResponse<ApiOrder>>(`/orders/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}
