import { z } from "zod";

export const orderStatusSchema = z.enum(
  ["PENDING", "PROCESSING", "IN_TRANSIT", "DELIVERED", "CANCELLED"],
  { error: "Please select a valid order status." },
);

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export type UpdateOrderStatusFormValues = z.infer<
  typeof updateOrderStatusSchema
>;
