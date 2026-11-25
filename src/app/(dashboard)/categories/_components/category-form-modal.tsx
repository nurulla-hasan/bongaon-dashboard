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
import type { MockCategory } from "@/data/mock-dashboard";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const categorySchema = z.object({
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
  subtitle: z.string().trim().max(255, { error: "Subtitle cannot exceed 255 characters." }),
  sortOrder: z.number().int().min(0, { error: "Sort order cannot be negative." }),
  isActive: z.boolean(),
  showOnHome: z.boolean(),
});

interface CategoryFormModalProps {
  category?: MockCategory;
  actionTrigger?: ReactNode;
}

export function CategoryFormModal({
  category,
  actionTrigger,
}: CategoryFormModalProps) {
  const [open, setOpen] = useState(false);
  const isEditing = Boolean(category);

  const form = useForm({
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      subtitle: category?.subtitle ?? "",
      sortOrder: category?.sortOrder ?? 1,
      isActive: category?.isActive ?? true,
      showOnHome: category?.showOnHome ?? false,
    },
    validators: {
      onSubmit: categorySchema,
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
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      subtitle: category?.subtitle ?? "",
      sortOrder: category?.sortOrder ?? 1,
      isActive: category?.isActive ?? true,
      showOnHome: category?.showOnHome ?? false,
    });
  }, [open, category, form]);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      actionTrigger={
        actionTrigger ?? (
          <Button>
            <Plus className="size-4" />
            Add Category
          </Button>
        )
      }
      title={isEditing ? "Edit Category" : "Add New Category"}
      description={
        isEditing
          ? "Update category details and storefront visibility."
          : "Create a new product category for Bongaon Bazar."
      }
      size="default"
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
          label="Category Name"
          placeholder="e.g. Packaged Bhorta & Shutki"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            form={form}
            name="slug"
            label="Slug"
            placeholder="e.g. shutki-bhorta"
          />

          <FormInput
            form={form}
            name="sortOrder"
            label="Sort Order"
            type="number"
            min={1}
          />
        </div>

        <FormInput
          form={form}
          name="subtitle"
          label="Subtitle"
          type="textarea"
          placeholder="Short description shown under the category title"
        />

        <ImageUpload
          id="category-image"
          label="Category Image (Optional)"
          description="PNG, JPG or WebP (uploaded via /categories/:id/image)"
        />

        <form.Field name="isActive">
          {(field) => (
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <div className="space-y-1">
                <Label htmlFor={field.name} className="cursor-pointer">
                  Visible on Storefront
                </Label>
                <p className="text-xs text-muted-foreground">
                  Inactive categories stay hidden from customers.
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

        <form.Field name="showOnHome">
          {(field) => (
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
              <div className="space-y-1">
                <Label htmlFor={field.name} className="cursor-pointer">
                  Show on Home Showcase
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display a dedicated product showcase section on the home page.
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

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Save Changes" : "Create Category"}</Button>
        </div>
      </form>
    </Modal>
  );
}
