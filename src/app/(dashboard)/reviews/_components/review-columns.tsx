"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { MockReview } from "@/data/mock-dashboard";
import { formatDate } from "@/lib/utils";
import { ReviewDetailsModal } from "./review-details-modal";

export const reviewColumns: ColumnDef<MockReview>[] = [
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="py-1">
          <p className="font-medium text-foreground">{review.customerName}</p>
          <p className="text-xs text-muted-foreground">
            {review.location || "Bangladesh"}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => (
      <span className="max-w-52 truncate text-sm text-foreground">
        {row.original.productName}
      </span>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="size-3.5 fill-gold text-gold" />
        <span className="font-medium text-foreground">{row.original.rating}/5</span>
      </div>
    ),
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <p className="max-w-72 truncate text-sm text-muted-foreground">
        {row.original.comment}
      </p>
    ),
  },
  {
    accessorKey: "isApproved",
    header: "Status",
    cell: ({ row }) => {
      const review = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <Switch
            defaultChecked={review.isApproved}
            onCheckedChange={(checked) =>
              toast.success(
                `Review by "${review.customerName}" ${checked ? "approved" : "hidden"} (UI preview)`,
              )
            }
            aria-label={`Toggle approval for ${review.customerName}`}
          />
          <Badge variant={review.isApproved ? "active" : "pending"}>
            {review.isApproved ? "Approved" : "Pending"}
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
      const review = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5 pr-2">
          <ReviewDetailsModal review={review} />

          <ConfirmationModal
            title="Delete Review"
            description={`Are you sure you want to delete the review by "${review.customerName}"? This action cannot be undone.`}
            confirmText="Delete"
            triggerVariant="ghost"
            triggerSize="icon"
            onConfirm={() => {
              toast.success(`Deleted review by "${review.customerName}" (UI preview)`);
            }}
          />
        </div>
      );
    },
  },
];
