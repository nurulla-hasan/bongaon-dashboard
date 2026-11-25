"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Package, Pencil, Star } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { MockProduct } from "@/data/mock-dashboard";
import { formatCurrencyBDT } from "@/lib/utils";
import { ProductFormModal } from "./product-form-modal";

export const productColumns: ColumnDef<MockProduct>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-3 py-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Package className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-foreground">{product.name}</p>
              {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {product.shortTag} • {product.unit} • {product.deliveryDays}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.categoryName}</span>
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
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <Switch
          defaultChecked={product.isFeatured}
          onCheckedChange={(checked) =>
            toast.success(
              `"${product.name}" ${checked ? "featured" : "unfeatured"} (UI preview)`,
            )
          }
          aria-label={`Toggle ${product.name} featured`}
        />
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <Switch
            defaultChecked={product.isActive}
            onCheckedChange={(checked) =>
              toast.success(
                `"${product.name}" marked as ${checked ? "active" : "inactive"} (UI preview)`,
              )
            }
            aria-label={`Toggle ${product.name} visibility`}
          />
          <Badge variant={product.isActive ? "active" : "secondary"}>
            {product.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
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

          <ConfirmationModal
            title="Delete Product"
            description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
            confirmText="Delete"
            triggerVariant="ghost"
            triggerSize="icon"
            onConfirm={() => {
              toast.success(`Deleted "${product.name}" (UI preview)`);
            }}
          />
        </div>
      );
    },
  },
];
