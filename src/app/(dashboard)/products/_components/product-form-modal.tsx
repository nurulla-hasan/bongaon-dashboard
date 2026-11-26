"use client";

import { useState, type ReactNode } from "react";
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
  useCreateProduct,
  useGetCategories,
  useRemoveProductGalleryImage,
  useUpdateProduct,
  useUploadProductGallery,
  useUploadProductImage,
} from "@/services";
import type { ApiProduct } from "@/types";
import { productSchema } from "@/validations";

interface ProductFormModalProps {
  product?: ApiProduct;
  actionTrigger?: ReactNode;
}

export function ProductFormModal({
  product,
  actionTrigger,
}: ProductFormModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [removedGalleryPublicIds, setRemovedGalleryPublicIds] = useState<
    string[]
  >([]);
  const isEditing = Boolean(product);

  const { data: categoriesData } = useGetCategories({ limit: 100 });
  const categoryOptions = (categoriesData?.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const { mutate: createProd, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProd, isPending: isUpdating } = useUpdateProduct();
  const { mutate: uploadMainImage, isPending: isUploadingImage } =
    useUploadProductImage();
  const { mutate: uploadGallery, isPending: isUploadingGallery } =
    useUploadProductGallery();
  const { mutate: removeGalleryImage, isPending: isRemovingGallery } =
    useRemoveProductGalleryImage();

  const isPending =
    isCreating ||
    isUpdating ||
    isUploadingImage ||
    isUploadingGallery ||
    isRemovingGallery;
  const isBusy = isSubmitting || isPending;

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
      shelfLife: product?.shelfLife ?? "",
      origin: product?.origin ?? "",
      description: product?.description ?? "",
      isFeatured: product?.isFeatured ?? false,
      isActive: product?.isActive ?? true,
    },
    validators: {
      onChange: productSchema,
    },
    onSubmit: ({ value }) => {
      setIsSubmitting(true);

      const payload = {
        name: value.name.trim(),
        slug: value.slug.trim() || undefined,
        categoryId: value.categoryId,
        shortTag: value.shortTag.trim(),
        badge: value.badge.trim() || null,
        unit: value.unit.trim(),
        price: value.price,
        originalPrice:
          value.originalPrice === "" ? null : Number(value.originalPrice),
        stock: value.stock,
        deliveryDays: value.deliveryDays.trim(),
        shelfLife: value.shelfLife.trim(),
        origin: value.origin.trim(),
        description: value.description.trim(),
        isFeatured: value.isFeatured,
        isActive: value.isActive,
      };

      const finishSuccess = (successMessage: string) => {
        toast.success(successMessage);
        setIsSubmitting(false);
        setOpen(false);
      };

      const handleMediaError = (err: unknown, fallbackMessage: string) => {
        toast.error(getErrorMessage(err, fallbackMessage));
        setIsSubmitting(false);
        if (!isEditing) {
          setOpen(false);
        }
      };

      const syncRemovedGallery = (
        id: string,
        index: number,
        successMessage: string,
      ) => {
        if (index >= removedGalleryPublicIds.length) {
          finishSuccess(successMessage);
          return;
        }

        const publicId = removedGalleryPublicIds[index];
        removeGalleryImage(
          { id, payload: { publicId } },
          {
            onSuccess: () => syncRemovedGallery(id, index + 1, successMessage),
            onError: (err) =>
              handleMediaError(
                err,
                "Product saved, but removing gallery image failed",
              ),
          },
        );
      };

      const syncGalleryUpload = (id: string, successMessage: string) => {
        if (galleryFiles.length === 0) {
          syncRemovedGallery(id, 0, successMessage);
          return;
        }

        uploadGallery(
          { id, files: galleryFiles },
          {
            onSuccess: () => syncRemovedGallery(id, 0, successMessage),
            onError: (err) =>
              handleMediaError(
                err,
                "Product saved, but gallery image upload failed",
              ),
          },
        );
      };

      const syncMedia = (id: string, successMessage: string) => {
        if (!mainImageFile) {
          syncGalleryUpload(id, successMessage);
          return;
        }

        uploadMainImage(
          { id, file: mainImageFile },
          {
            onSuccess: () => syncGalleryUpload(id, successMessage),
            onError: (err) =>
              handleMediaError(
                err,
                "Product saved, but main image upload failed",
              ),
          },
        );
      };

      if (isEditing && product) {
        updateProd(
          { id: product.id, payload },
          {
            onSuccess: (res) => {
              syncMedia(res.data.id, `Updated "${value.name.trim()}"`);
            },
            onError: (err) => {
              setIsSubmitting(false);
              toast.error(getErrorMessage(err, "Failed to update product"));
            },
          },
        );
        return;
      }

      createProd(payload, {
        onSuccess: (res) => {
          syncMedia(res.data.id, `Created "${value.name.trim()}"`);
        },
        onError: (err) => {
          setIsSubmitting(false);
          toast.error(getErrorMessage(err, "Failed to create product"));
        },
      });
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isBusy) return;
    if (nextOpen) {
      setMainImageFile(null);
      setGalleryFiles([]);
      setRemovedGalleryPublicIds([]);
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
        shelfLife: product?.shelfLife ?? "",
        origin: product?.origin ?? "",
        description: product?.description ?? "",
        isFeatured: product?.isFeatured ?? false,
        isActive: product?.isActive ?? true,
      });
    }
    setOpen(nextOpen);
  };

  const handleRemoveInitialGalleryUrl = (url: string) => {
    const matched = product?.gallery?.find((item) => item.url === url);
    if (!matched) return;
    setRemovedGalleryPublicIds((prev) =>
      prev.includes(matched.publicId) ? prev : [...prev, matched.publicId],
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
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
          disabled={isBusy}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            form={form}
            name="slug"
            label="Slug (Optional)"
            placeholder="Auto-generated if left empty"
            disabled={isBusy}
          />

          <FormInput
            form={form}
            name="categoryId"
            label="Category"
            type="select"
            placeholder="Select category"
            options={categoryOptions}
            disabled={isBusy}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormInput
            form={form}
            name="shortTag"
            label="Short Tag"
            placeholder="e.g. Best Seller"
            disabled={isBusy}
          />

          <FormInput
            form={form}
            name="badge"
            label="Badge (Optional)"
            placeholder="e.g. 100% Pure"
            disabled={isBusy}
          />

          <FormInput
            form={form}
            name="deliveryDays"
            label="Delivery Days"
            placeholder="e.g. 4-7 Days"
            disabled={isBusy}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <FormInput
            form={form}
            name="price"
            label="Price (BDT)"
            type="number"
            min={1}
            disabled={isBusy}
          />

          <FormInput
            form={form}
            name="originalPrice"
            label="Original Price"
            type="number"
            min={1}
            placeholder="Optional"
            disabled={isBusy}
          />

          <FormInput
            form={form}
            name="unit"
            label="Unit"
            placeholder="e.g. 250g"
            disabled={isBusy}
          />

          <FormInput
            form={form}
            name="stock"
            label="Stock"
            type="number"
            min={0}
            disabled={isBusy}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            form={form}
            name="origin"
            label="Origin (Optional)"
            placeholder="e.g. Cox's Bazar / Jashore"
            disabled={isBusy}
          />

          <FormInput
            form={form}
            name="shelfLife"
            label="Shelf Life (Optional)"
            placeholder="e.g. 6 months in cool dry place"
            disabled={isBusy}
          />
        </div>

        <FormInput
          form={form}
          name="description"
          label="Description"
          type="textarea"
          placeholder="Detailed product description (minimum 10 characters)"
          disabled={isBusy}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload
            key={`${product?.id ?? "new-product"}-main-${open}`}
            id="product-image"
            label="Main Image (Optional)"
            description="Single cover image (/products/:id/image)"
            initialUrls={product?.imageUrl ? [product.imageUrl] : []}
            disabled={isBusy}
            onFilesChange={(files) => setMainImageFile(files[0] ?? null)}
          />

          <ImageUpload
            key={`${product?.id ?? "new-product"}-gallery-${open}`}
            id="product-gallery"
            label="Gallery Images (Optional)"
            description="Up to 5 images (/products/:id/gallery)"
            multiple
            maxFiles={5}
            initialUrls={product?.gallery?.map((item) => item.url) ?? []}
            disabled={isBusy}
            onFilesChange={setGalleryFiles}
            onRemoveInitialUrl={handleRemoveInitialGalleryUrl}
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
                  disabled={isBusy}
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
                  disabled={isBusy}
                  checked={field.state.value}
                  onCheckedChange={(checked) => field.handleChange(checked)}
                />
              </div>
            )}
          </form.Field>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isBusy}
            loadingText={isEditing ? "Saving..." : "Creating..."}
          >
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
