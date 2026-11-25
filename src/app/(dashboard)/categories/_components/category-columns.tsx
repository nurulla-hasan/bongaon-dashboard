"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FolderTree, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { MockCategory } from "@/data/mock-dashboard";
import { formatDate } from "@/lib/utils";
import { CategoryFormModal } from "./category-form-modal";

export const categoryColumns: ColumnDef<MockCategory>[] = [
  {
    accessorKey: "name",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex items-center gap-3 py-1">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FolderTree className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{category.name}</p>
            <p className="truncate text-xs text-muted-foreground">{category.subtitle}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>
    ),
  },
  {
    accessorKey: "productCount",
    header: "Products",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.productCount} items</Badge>
    ),
  },
  {
    accessorKey: "sortOrder",
    header: "Order",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.sortOrder}</span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <Switch
            defaultChecked={category.isActive}
            onCheckedChange={(checked) =>
              toast.success(
                `"${category.name}" marked as ${checked ? "active" : "inactive"} (UI preview)`,
              )
            }
            aria-label={`Toggle ${category.name} visibility`}
          />
          <Badge variant={category.isActive ? "active" : "secondary"}>
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
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

          <ConfirmationModal
            title="Delete Category"
            description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
            confirmText="Delete"
            triggerVariant="ghost"
            triggerSize="icon"
            onConfirm={() => {
              toast.success(`Deleted "${category.name}" (UI preview)`);
            }}
          />
        </div>
      );
    },
  },
];
