import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Category name must be at least 2 characters." })
    .max(100, { error: "Category name cannot exceed 100 characters." }),
  slug: z
    .string()
    .trim()
    .refine((val) => val === "" || (val.length >= 2 && slugRegex.test(val)), {
      error: "Slug must be lowercase alphanumeric with hyphens.",
    }),
  subtitle: z
    .string()
    .trim()
    .max(255, { error: "Subtitle cannot exceed 255 characters." }),
  sortOrder: z
    .number()
    .int()
    .min(0, { error: "Sort order cannot be negative." }),
  isActive: z.boolean(),
  showOnHome: z.boolean(),
});
