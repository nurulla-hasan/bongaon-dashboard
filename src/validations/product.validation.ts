import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Product name must be at least 2 characters." })
    .max(150, { error: "Product name cannot exceed 150 characters." }),
  slug: z
    .string()
    .trim()
    .refine((val) => val === "" || (val.length >= 2 && slugRegex.test(val)), {
      error: "Slug must be lowercase alphanumeric with hyphens.",
    }),
  categoryId: z.string().min(1, { error: "Please select a category." }),
  shortTag: z.string().trim().max(80, { error: "Max 80 characters." }),
  badge: z.string().trim().max(50, { error: "Max 50 characters." }),
  unit: z
    .string()
    .trim()
    .min(1, { error: "Unit is required." })
    .max(50, { error: "Unit cannot exceed 50 characters." }),
  price: z
    .number({ error: "Price must be a positive integer." })
    .int({ error: "Price must be a whole number." })
    .positive({ error: "Price must be a positive integer." }),
  originalPrice: z.union([
    z
      .number({ error: "Original price must be a positive integer." })
      .int({ error: "Original price must be a whole number." })
      .positive({ error: "Original price must be a positive integer." }),
    z.literal(""),
  ]),
  stock: z
    .number({ error: "Stock must be 0 or greater." })
    .int({ error: "Stock must be a whole number." })
    .min(0, { error: "Stock cannot be negative." }),
  deliveryDays: z.string().trim().max(50, { error: "Max 50 characters." }),
  shelfLife: z.string().trim().max(150, { error: "Max 150 characters." }),
  origin: z.string().trim().max(150, { error: "Max 150 characters." }),
  description: z
    .string()
    .trim()
    .min(10, { error: "Description must be at least 10 characters." }),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
