import { apiClient } from "@/lib/api-client";
import type { ApiResponse, HeroBannerSlide, StoreSetting } from "@/types";

export interface UpdateStoreSettingPayload {
  storeName?: string;
  supportPhone?: string;
  whatsappNumber?: string;
  supportEmail?: string;
  storeAddress?: string;
  defaultDeliveryCharge?: number;
  freeDeliveryMinOrder?: number;
  estimatedDeliveryDays?: string;
  announcementEnabled?: boolean;
  announcementText?: string;
  heroBanners?: HeroBannerSlide[];
  isOrderingEnabled?: boolean;
  orderAlertEmail?: string;
}

export const settingApi = {
  getSettings: () => apiClient<ApiResponse<StoreSetting>>("/settings"),

  updateSettings: (payload: UpdateStoreSettingPayload) =>
    apiClient<ApiResponse<StoreSetting>>("/settings", {
      method: "PATCH",
      body: payload,
    }),
};
