import { apiClient } from "@/lib/api-client";
import type {
  ApiResponse,
  StoreSetting,
  UpdateStoreSettingPayload,
  UploadedHeroBannerImage,
} from "@/types";

export function getSettings() {
  return apiClient<ApiResponse<StoreSetting>>("/settings");
}

export function uploadHeroBannerImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return apiClient<ApiResponse<UploadedHeroBannerImage>>(
    "/settings/hero-banner-image",
    {
      method: "POST",
      body: formData,
    },
  );
}

export function updateSettings(payload: UpdateStoreSettingPayload) {
  return apiClient<ApiResponse<StoreSetting>>("/settings", {
    method: "PATCH",
    body: payload,
  });
}
