"use client";

import { useState, type ReactNode } from "react";
import { Eye, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/common/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { MockReview } from "@/data/mock-dashboard";
import { formatDate } from "@/lib/utils";

interface ReviewDetailsModalProps {
  review: MockReview;
  actionTrigger?: ReactNode;
}

export function ReviewDetailsModal({
  review,
  actionTrigger,
}: ReviewDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(review.isApproved);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setIsApproved(review.isApproved);
    setOpen(nextOpen);
  };

  const handleSaveModeration = () => {
    toast.success(
      `Review by "${review.customerName}" ${isApproved ? "approved" : "hidden"} (UI preview)`,
    );
    setOpen(false);
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
      description={`${review.productName} • ${formatDate(review.createdAt)}`}
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
            <Label htmlFor={`review-approve-${review.id}`} className="cursor-pointer">
              Approved on Storefront
            </Label>
            <p className="text-xs text-muted-foreground">
              Only approved reviews are visible to customers.
            </p>
          </div>
          <Switch
            id={`review-approve-${review.id}`}
            checked={isApproved}
            onCheckedChange={setIsApproved}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button type="button" onClick={handleSaveModeration}>
            Save Status
          </Button>
        </div>
      </div>
    </Modal>
  );
}
