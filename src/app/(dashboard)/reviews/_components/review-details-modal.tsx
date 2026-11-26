"use client";

import { useState, type ReactNode } from "react";
import { Eye, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/common/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";
import { useUpdateReview } from "@/services";
import type { ApiReview } from "@/types";

interface ReviewDetailsModalProps {
  review: ApiReview;
  actionTrigger?: ReactNode;
}

export function ReviewDetailsModal({
  review,
  actionTrigger,
}: ReviewDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(review.isApproved);

  const { mutate: updateRev, isPending } = useUpdateReview();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    if (nextOpen) setIsApproved(review.isApproved);
    setOpen(nextOpen);
  };

  const handleSaveModeration = () => {
    if (isApproved === review.isApproved) return;

    updateRev(
      { id: review.id, payload: { isApproved } },
      {
        onSuccess: () => {
          toast.success(
            `Review by "${review.customerName}" ${isApproved ? "approved" : "hidden"}`,
          );
          setOpen(false);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Failed to update review status"));
        },
      },
    );
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      actionTrigger={
        actionTrigger ?? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`View review by ${review.customerName}`}
          >
            <Eye className="size-4" />
          </Button>
        )
      }
      title="Review Details"
      description={`${review.product?.name ?? "Product"} • ${formatDate(review.createdAt)}`}
      size="default"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <div className="space-y-1">
            <p className="font-medium text-foreground">{review.customerName}</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {review.location || "Bangladesh"}
            </p>
          </div>

          <Badge variant="secondary" className="gap-1">
            <Star className="size-3.5 fill-gold text-gold" />
            {review.rating}/5
          </Badge>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase">
            Customer Comment
          </p>
          <p className="rounded-xl border border-border p-4 text-sm leading-6 text-foreground">
            {review.comment}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
          <div className="space-y-1">
            <Label
              htmlFor={`review-approve-${review.id}`}
              className="cursor-pointer"
            >
              Approved on Storefront
            </Label>
            <p className="text-xs text-muted-foreground">
              Only approved reviews are visible to customers.
            </p>
          </div>
          <Switch
            id={`review-approve-${review.id}`}
            disabled={isPending}
            checked={isApproved}
            onCheckedChange={setIsApproved}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            loading={isPending}
            loadingText="Saving..."
            disabled={isApproved === review.isApproved}
            onClick={handleSaveModeration}
          >
            Save Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
