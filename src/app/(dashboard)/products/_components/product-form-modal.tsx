"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MOCK_CATEGORIES, type MockProduct } from "@/data/mock-dashboard";

const CATEGORY_OPTIONS = MOCK_CATEGORIES.map((category) => ({
  label: category.name,
  value: category.id,
}));

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const productSchema = z.object({
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
  unit: z.string().trim().min(1, { error: "Unit is required." }).max(50),
  price: z.number().int().positive({ error: "Price must be a positive integer." }),
  originalPrice: z.union([z.number().int().positive(), z.literal("")]),
  stock: z.number().int().min(0, { error: "Stock cannot be negative." }),
  deliveryDays: z.string().trim().max(50),
  shelfLife: z.string().trim().max(150),
  origin: z.string().trim().max(150),
  description: z
    .string()
    .trim()
    .min(10, { error: "Description must be at least 10 characters." }),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

interface ProductFormModalProps {
  product?: MockProduct;
  actionTrigger?: ReactNode;
}

export function ProductFormModal({
  product,
  actionTrigger,
}: ProductFormModalProps) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(product);

  const form = useForm({
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      categoryId: product?.categoryId ?? "",
      shortTag: product?.shortTag ?? "",
      badge: product?.badge ?? "",
      unit: product?.unit ?? "250g",
      price: product?.price ?? 0,
      originalPrice: (product?.originalPrice ?? "") as number | "",
      stock: product?.stock ?? 0,
      deliveryDays: product?.deliveryDays ?? "4-7 Days",
      shelfLife: "",
      origin: "",
      description: "",
      isFeatured: product?.isFeatured ?? false,
      isActive: product?.isActive ?? true,
    },
    validators: {
      onSubmit: productSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success(
        isEditing
          ? `Updated "${value.name}" (UI preview)`
          : `Created "${value.name}" (UI preview)`,
      );
      setOpen(false);
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      categoryId: product?.categoryId ?? "",
      shortTag: product?.shortTag ?? "",
      badge: product?.badge ?? "",
      unit: product?.unit ?? "250g",
      price: product?.price ?? 0,
      originalPrice: (product?.originalPrice ?? "") as number | "",
      stock: product?.stock ?? 0,
      deliveryDays: product?.deliveryDays ?? "4-7 Days",
      shelfLife: "",
      origin: "",
      description: "",
      isFeatured: product?.isFeatured ?? false,
      isActive: product?.isActive ?? true,
    });
  }, [open, product, form]);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      actionTrigger={
        actionTrigger ?? (
          <Button>
            <Plus className="size-4" />
            Add Product
          </Button>
        )
      }
      title={isEditing ? "Edit Product" : "Add New Product"}
      description={
        isEditing
          ? "Update product pricing, stock, and storefront visibility."
          : "Add a new product to the Bongaon Bazar catalog."
      }
      size="lg"
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FormInput
          form={form}
          name="name"
          label="Product Name"
          placeholder="e.g. Special Churi Shutki Bhorta (Ready Pack)"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            form={form}
            name="slug"
            label="Slug (Optional)"
            placeholder="Auto-generated if left empty"
          />

          <FormInput
            form={form}
            name="categoryId"
            label="Category"
            type="select"
            placeholder="Select category"
            options={CATEGORY_OPTIONS}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput
            form={form}
            name="shortTag"
            label="Short Tag"
            placeholder="e.g. Best Seller"
          />

          <FormInput
            form={form}
            name="badge"
            label="Badge (Optional)"
            placeholder="e.g. 100% Pure"
          />

          <FormInput
            form={form}
            name="deliveryDays"
            label="Delivery Days"
            placeholder="e.g. 4-7 Days"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <FormInput
            form={form}
            name="price"
            label="Price (BDT)"
            type="number"
            min={1}
          />

          <FormInput
            form={form}
            name="originalPrice"
            label="Original Price"
            type="number"
            min={1}
            placeholder="Optional"
          />

          <FormInput
            form={form}
            name="unit"
            label="Unit"
            placeholder="e.g. 250g"
          />

          <FormInput
            form={form}
            name="stock"
            label="Stock"
            type="number"
            min={0}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            form={form}
            name="origin"
            label="Origin (Optional)"
            placeholder="e.g. Cox's Bazar / Jashore"
          />

          <FormInput
            form={form}
            name="shelfLife"
            label="Shelf Life (Optional)"
            placeholder="e.g. 6 months in cool dry place"
          />
        </div>

        <FormInput
          form={form}
          name="description"
          label="Description"
          type="textarea"
          placeholder="Detailed product description (minimum 10 characters)"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload
            id="product-image"
            label="Main Image (Optional)"
            description="Single cover image (/products/:id/image)"
          />

          <ImageUpload
            id="product-gallery"
            label="Gallery Images (Optional)"
            description="Up to 5 images (/products/:id/gallery)"
            multiple
            maxFiles={5}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <form.Field name="isFeatured">
            {(field) => (
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="cursor-pointer">
                    Featured Product
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Highlight on storefront homepage.
                  </p>
                </div>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="isActive">
            {(field) => (
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                <div className="space-y-1">
                  <Label htmlFor={field.name} className="cursor-pointer">
                    Visible on Storefront
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Inactive products stay hidden.
                  </p>
                </div>
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Save Changes" : "Create Product"}</Button>
        </div>
      </form>
    </Modal>
  );
}
