import { z } from "zod";

export const replyContactSchema = z.object({
  subject: z
    .string()
    .trim()
    .max(150, { error: "Subject cannot exceed 150 characters." })
    .refine((val) => val === "" || val.length >= 2, {
      error: "Subject must be at least 2 characters.",
    }),
  replyMessage: z
    .string()
    .trim()
    .min(2, { error: "Reply message must be at least 2 characters." })
    .max(3000, { error: "Reply message cannot exceed 3000 characters." }),
});

export type ReplyContactFormValues = z.infer<typeof replyContactSchema>;
