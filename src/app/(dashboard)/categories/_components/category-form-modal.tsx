"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FormInput } from "@/components/common/form-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Modal } from "@/components/common/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import {
  useCreateCategory,
  useUpdateCategory,
  useUploadCategoryImage,
} from "@/services";
import type { ApiCategory } from "@/types";
import { categorySchema } from "@/validations";

interface CategoryFormModalProps {
  category?: ApiCategory;
  actionTrigger?: ReactNode;
}

export function CategoryFormModal({
  category,
  actionTrigger,
}: CategoryFormModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isEditing = Boolean(category);

  const { mutate: createCat, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCat, isPending: isUpdating } = useUpdateCategory();
  const { mutate: uploadImage, isPending: isUploading } =
    useUploadCategoryImage();
  const isPending = isCreating || isUpdating || isUploading;

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
      onChange: categorySchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name.trim(),
        slug: value.slug.trim() || undefined,
        subtitle: value.subtitle.trim(),
        sortOrder: value.sortOrder,
        isActive: value.isActive,
        showOnHome: value.showOnHome,
      };

      const handleImageOrClose = (id: string, successMessage: string) => {
        if (!selectedFile) {
          toast.success(successMessage);
          setOpen(false);
          return;
        }

        uploadImage(
          { id, file: selectedFile },
          {
            onSuccess: () => {
              toast.success(successMessage);
              setOpen(false);
            },
            onError: (err) => {
              toast.error(
                getErrorMessage(
                  err,
                  "Category saved, but image upload failed",
                ),
              );
            },
          },
        );
      };

      if (isEditing && category) {
        updateCat(
          { id: category.id, payload },
          {
            onSuccess: (res) => {
              handleImageOrClose(
                res.data.id,
                `Updated "${value.name.trim()}"`,
              );
            },
            onError: (err) => {
              toast.error(getErrorMessage(err, "Failed to update category"));
            },
          },
        );
        return;
      }

      createCat(payload, {
        onSuccess: (res) => {
          handleImageOrClose(res.data.id, `Created "${value.name.trim()}"`);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Failed to create category"));
        },
      });
    },
  });

  useEffect(() => {
    if (!open) return;
    setSelectedFile(null);
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
          placeholder="e.g. Dry Fish & Bhorta"
          disabled={isPending}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            form={form}
            name="slug"
            label="Slug"
            placeholder="e.g. shutki-bhorta"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="sortOrder"
            label="Sort Order"
            type="number"
            min={0}
            disabled={isPending}
          />
        </div>

        <FormInput
          form={form}
          name="subtitle"
          label="Subtitle"
          type="textarea"
          placeholder="Short description shown under the category title"
          disabled={isPending}
        />

        <ImageUpload
          key={category?.id ?? "new-category"}
          id="category-image"
          label="Category Image (Optional)"
          description="PNG, JPG or WebP (uploaded via /categories/:id/image)"
          initialUrls={category?.imageUrl ? [category.imageUrl] : []}
          disabled={isPending}
          onFilesChange={(files) => setSelectedFile(files[0] ?? null)}
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
                disabled={isPending}
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
                disabled={isPending}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
            </div>
          )}
        </form.Field>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isPending}
            loadingText={isEditing ? "Saving..." : "Creating..."}
          >
            {isEditing ? "Save Changes" : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
