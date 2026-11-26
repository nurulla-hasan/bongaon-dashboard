"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Package, Pencil, Star } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { formatCurrencyBDT } from "@/lib/utils";
import { useDeleteProduct, useUpdateProduct } from "@/services";
import type { ApiProduct } from "@/types";
import { ProductFormModal } from "./product-form-modal";

function ProductFeaturedCell({ product }: { product: ApiProduct }) {
  const { mutate: updateProd, isPending } = useUpdateProduct();

  return (
    <Switch
      checked={product.isFeatured}
      disabled={isPending}
      onCheckedChange={(checked) => {
        updateProd(
          { id: product.id, payload: { isFeatured: checked } },
          {
            onSuccess: () => {
              toast.success(
                `"${product.name}" ${checked ? "featured" : "unfeatured"}`,
              );
            },
            onError: (err) => {
              toast.error(getErrorMessage(err, "Failed to update featured flag"));
            },
          },
        );
      }}
      aria-label={`Toggle ${product.name} featured`}
    />
  );
}

function ProductStatusCell({ product }: { product: ApiProduct }) {
  const { mutate: updateProd, isPending } = useUpdateProduct();

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={product.isActive}
        disabled={isPending}
        onCheckedChange={(checked) => {
          updateProd(
            { id: product.id, payload: { isActive: checked } },
            {
              onSuccess: () => {
                toast.success(
                  `"${product.name}" marked as ${checked ? "active" : "inactive"}`,
                );
              },
              onError: (err) => {
                toast.error(getErrorMessage(err, "Failed to update status"));
              },
            },
          );
        }}
        aria-label={`Toggle ${product.name} visibility`}
      />
      <Badge variant={product.isActive ? "active" : "secondary"}>
        {product.isActive ? "Active" : "Inactive"}
      </Badge>
    </div>
  );
}

function DeleteProductCell({ product }: { product: ApiProduct }) {
  const [open, setOpen] = useState(false);
  const { mutate: removeProd, isPending } = useDeleteProduct();

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={setOpen}
      isLoading={isPending}
      title="Delete Product"
      description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
      confirmText="Delete"
      loadingText="Deleting..."
      triggerVariant="ghost"
      triggerSize="icon"
      onConfirm={() => {
        removeProd(product.id, {
          onSuccess: () => {
            toast.success(`Deleted "${product.name}"`);
            setOpen(false);
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to delete product"));
          },
        });
      }}
    />
  );
}

export const productColumns: ColumnDef<ApiProduct>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      const metaText = [product.shortTag, product.unit, product.deliveryDays]
        .filter(Boolean)
        .join(" • ");

      return (
        <div className="flex items-center gap-3 py-1">
          {product.imageUrl ? (
            <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Package className="size-4" />
            </span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-foreground">
                {product.name}
              </p>
              {product.badge && (
                <Badge variant="secondary">{product.badge}</Badge>
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {metaText || "—"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.category?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-heading font-semibold text-foreground">
            {formatCurrencyBDT(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatCurrencyBDT(product.originalPrice)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.original.stock;
      return (
        <Badge variant={stock <= 5 ? "warning" : "active"}>
          {stock} in stock
        </Badge>
      );
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Star className="size-3.5 fill-gold text-gold" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => <ProductFeaturedCell product={row.original} />,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <ProductStatusCell product={row.original} />,
  },
  {
    id: "actions",
    header: "Actions",
    meta: { headerClassName: "text-right" },
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5 pr-2">
          <ProductFormModal
            product={product}
            actionTrigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${product.name}`}
              >
                <Pencil className="size-4" />
              </Button>
            }
          />

          <DeleteProductCell product={product} />
        </div>
      );
    },
  },
];
