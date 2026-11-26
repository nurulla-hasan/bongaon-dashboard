import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  ApiReview,
  GetReviewsParams,
  UpdateReviewPayload,
} from "@/types";

export function getReviews(params?: GetReviewsParams) {
  return apiClient<ApiResponse<ApiReview[]>>("/reviews", { query: params });
}

export function updateReview(id: string, payload: UpdateReviewPayload) {
  return apiClient<ApiResponse<ApiReview>>(`/reviews/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteReview(id: string) {
  return apiClient<ApiResponse<null>>(`/reviews/${id}`, {
    method: "DELETE",
  });
}
