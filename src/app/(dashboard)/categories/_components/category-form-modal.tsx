"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MockCategory } from "@/data/mock-dashboard";

const ICON_OPTIONS = [
  { label: "Flame (Bhorta & Spice)", value: "flame" },
  { label: "Jar (Achar & Chutney)", value: "jar" },
  { label: "Droplet (Ghee & Oil)", value: "droplet" },
  { label: "Sparkles (Gur & Honey)", value: "sparkles" },
  { label: "Package (General)", value: "package" },
  { label: "Gift (Combo Pack)", value: "gift" },
  { label: "Folder (Default)", value: "folder" },
] as const;

const categorySchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters" }),
  slug: z
    .string()
    .trim()
    .min(2, { error: "Slug must be at least 2 characters" })
    .regex(/^[a-z0-9-]+$/, {
      error: "Slug can only contain lowercase letters, numbers, and hyphens",
    }),
  subtitle: z.string().trim().min(4, { error: "Subtitle must be at least 4 characters" }),
  iconName: z.string().min(1, { error: "Please select an icon" }),
  sortOrder: z.number().int().min(1, { error: "Sort order must be at least 1" }),
  isActive: z.boolean(),
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
      iconName: category?.iconName ?? "folder",
      sortOrder: category?.sortOrder ?? 1,
      isActive: category?.isActive ?? true,
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
      iconName: category?.iconName ?? "folder",
      sortOrder: category?.sortOrder ?? 1,
      isActive: category?.isActive ?? true,
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
          name="iconName"
          label="Category Icon"
          type="select"
          placeholder="Select icon"
          options={ICON_OPTIONS}
        />

        <FormInput
          form={form}
          name="subtitle"
          label="Subtitle"
          type="textarea"
          placeholder="Short description shown under the category title"
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
