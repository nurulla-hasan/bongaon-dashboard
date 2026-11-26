"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";
import { useDeleteReview, useUpdateReview } from "@/services";
import type { ApiReview } from "@/types";
import { ReviewDetailsModal } from "./review-details-modal";

function ReviewStatusCell({ review }: { review: ApiReview }) {
  const { mutate: updateRev, isPending } = useUpdateReview();

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={review.isApproved}
        disabled={isPending}
        onCheckedChange={(checked) => {
          updateRev(
            { id: review.id, payload: { isApproved: checked } },
            {
              onSuccess: () => {
                toast.success(
                  `Review by "${review.customerName}" ${checked ? "approved" : "hidden"}`,
                );
              },
              onError: (err) => {
                toast.error(
                  getErrorMessage(err, "Failed to update review status"),
                );
              },
            },
          );
        }}
        aria-label={`Toggle approval for ${review.customerName}`}
      />
      <Badge variant={review.isApproved ? "active" : "pending"}>
        {review.isApproved ? "Approved" : "Pending"}
      </Badge>
    </div>
  );
}

function DeleteReviewCell({ review }: { review: ApiReview }) {
  const [open, setOpen] = useState(false);
  const { mutate: removeRev, isPending } = useDeleteReview();

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={setOpen}
      isLoading={isPending}
      title="Delete Review"
      description={`Are you sure you want to delete the review by "${review.customerName}"? This action cannot be undone.`}
      confirmText="Delete"
      loadingText="Deleting..."
      triggerVariant="ghost"
      triggerSize="icon"
      onConfirm={() => {
        removeRev(review.id, {
          onSuccess: () => {
            toast.success(`Deleted review by "${review.customerName}"`);
            setOpen(false);
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to delete review"));
          },
        });
      }}
    />
  );
}

export const reviewColumns: ColumnDef<ApiReview>[] = [
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
    id: "product",
    header: "Product",
    cell: ({ row }) => (
      <span className="block max-w-52 truncate text-sm text-foreground">
        {row.original.product?.name ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="size-3.5 fill-gold text-gold" />
        <span className="font-medium text-foreground">
          {row.original.rating}/5
        </span>
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
    cell: ({ row }) => <ReviewStatusCell review={row.original} />,
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
          <DeleteReviewCell review={review} />
        </div>
      );
    },
  },
];
