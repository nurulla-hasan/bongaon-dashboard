import { z } from "zod";

export const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(2, { error: "Store name must be at least 2 characters." })
    .max(120),
  supportPhone: z.string().trim().max(30),
  whatsappNumber: z.string().trim().max(30),
  supportEmail: z
    .string()
    .trim()
    .refine((val) => val === "" || z.email().safeParse(val).success, {
      error: "Invalid support email address.",
    }),
  storeAddress: z.string().trim().max(300),
  defaultDeliveryCharge: z.number().int().min(0).max(5000),
  freeDeliveryMinOrder: z.number().int().min(0).max(100000),
  estimatedDeliveryDays: z.string().trim().max(50),
  orderAlertEmail: z
    .string()
    .trim()
    .refine((val) => val === "" || z.email().safeParse(val).success, {
      error: "Invalid alert email address.",
    }),
  announcementEnabled: z.boolean(),
  announcementText: z.string().trim().max(300),
  isOrderingEnabled: z.boolean(),
});
