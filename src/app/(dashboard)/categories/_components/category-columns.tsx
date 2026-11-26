"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { FolderTree, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";
import { useDeleteCategory, useUpdateCategory } from "@/services";
import type { ApiCategory } from "@/types";
import { CategoryFormModal } from "./category-form-modal";

function CategoryStatusCell({ category }: { category: ApiCategory }) {
  const { mutate: updateCat, isPending } = useUpdateCategory();

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={category.isActive}
        disabled={isPending}
        onCheckedChange={(checked) => {
          updateCat(
            { id: category.id, payload: { isActive: checked } },
            {
              onSuccess: () => {
                toast.success(
                  `"${category.name}" marked as ${checked ? "active" : "inactive"}`,
                );
              },
              onError: (err) => {
                toast.error(getErrorMessage(err, "Failed to update status"));
              },
            },
          );
        }}
        aria-label={`Toggle ${category.name} visibility`}
      />
      <Badge variant={category.isActive ? "active" : "secondary"}>
        {category.isActive ? "Active" : "Inactive"}
      </Badge>
    </div>
  );
}

function DeleteCategoryCell({ category }: { category: ApiCategory }) {
  const [open, setOpen] = useState(false);
  const { mutate: removeCat, isPending } = useDeleteCategory();

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={setOpen}
      isLoading={isPending}
      title="Delete Category"
      description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
      confirmText="Delete"
      loadingText="Deleting..."
      triggerVariant="ghost"
      triggerSize="icon"
      onConfirm={() => {
        removeCat(category.id, {
          onSuccess: () => {
            toast.success(`Deleted "${category.name}"`);
            setOpen(false);
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to delete category"));
          },
        });
      }}
    />
  );
}

export const categoryColumns: ColumnDef<ApiCategory>[] = [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex items-center gap-3 py-1">
          {category.imageUrl ? (
            <div className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.imageUrl}
                alt={category.name}
                className="size-full object-cover"
              />
            </div>
          ) : (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FolderTree className="size-4" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">
              {category.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {category.subtitle || "—"}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.slug}
      </span>
    ),
  },
  {
    id: "productCount",
    header: "Products",
    cell: ({ row }) => (
      <Badge variant="secondary">
        {row.original._count?.products ?? 0} items
      </Badge>
    ),
  },
  {
    accessorKey: "sortOrder",
    header: "Order",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.sortOrder}
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => <CategoryStatusCell category={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    meta: { headerClassName: "text-right" },
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5 pr-2">
          <CategoryFormModal
            category={category}
            actionTrigger={
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Edit ${category.name}`}
              >
                <Pencil className="size-4" />
              </Button>
            }
          />

          <DeleteCategoryCell category={category} />
        </div>
      );
    },
  },
];
