import { z } from "zod";

export const updateReviewSchema = z.object({
  isApproved: z.boolean(),
});

export type UpdateReviewFormValues = z.infer<typeof updateReviewSchema>;
