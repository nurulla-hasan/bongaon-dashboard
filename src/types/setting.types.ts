import type { HeroBannerSlide } from "./api.types";

export interface UploadedHeroBannerImage {
  imageUrl: string;
  imagePublicId: string;
}

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
