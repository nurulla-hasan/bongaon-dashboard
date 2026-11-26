import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  StoreSetting,
  UpdateStoreSettingPayload,
} from "@/types";

export function getSettings() {
  return apiClient<ApiResponse<StoreSetting>>("/settings");
}

export function updateSettings(payload: UpdateStoreSettingPayload) {
  return apiClient<ApiResponse<StoreSetting>>("/settings", {
    method: "PATCH",
    body: payload,
  });
}
