"use client";

import { useState, type ReactNode } from "react";
import { Eye, MapPin, Phone, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/common/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { MockOrder, OrderStatus } from "@/data/mock-dashboard";
import { formatCurrencyBDT, formatDate } from "@/lib/utils";

const ORDER_STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

interface OrderDetailsModalProps {
  order: MockOrder;
  actionTrigger?: ReactNode;
}

export function OrderDetailsModal({
  order,
  actionTrigger,
}: OrderDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) setStatus(order.status);
    setOpen(nextOpen);
  };

  const handleStatusUpdate = () => {
    toast.success(`Order ${order.orderNumber} updated to ${status} (UI preview)`);
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
            aria-label={`View order ${order.orderNumber}`}
          >
            <Eye className="size-4" />
          </Button>
        )
      }
      title={`Order ${order.orderNumber}`}
      description={`Placed on ${formatDate(order.createdAt)} • ${order.paymentMethod}`}
      size="lg"
    >
      <div className="space-y-5">
        <div className="grid gap-3 rounded-xl border border-border bg-muted/30 p-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Receiver
            </p>
            <p className="font-medium text-foreground">{order.receiverName}</p>
            <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Phone className="size-3.5" />
              {order.receiverPhone}
            </p>
            {order.whatsappNumber && (
              <p className="font-mono text-xs text-muted-foreground">
                WhatsApp: {order.whatsappNumber}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Delivery Address
            </p>
            <p className="font-medium text-foreground">{order.district}</p>
            <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span>{order.fullAddress}</span>
            </p>
          </div>

          {order.orderNote && (
            <div className="flex items-start gap-2 border-t border-border pt-3 text-xs text-muted-foreground sm:col-span-2">
              <StickyNote className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>Note: {order.orderNote}</span>
            </div>
          )}
        </div>

        <div className="space-y-2.5">
          <p className="text-sm font-semibold text-foreground">Order Items</p>
          <div className="divide-y divide-border rounded-xl border border-border">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pack: {item.selectedPack} • {item.quantity} ×{" "}
                    {formatCurrencyBDT(item.unitPrice)}
                  </p>
                </div>
                <span className="font-heading font-semibold text-foreground">
                  {formatCurrencyBDT(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-border p-4 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatCurrencyBDT(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Delivery Charge</span>
            <span>{formatCurrencyBDT(order.deliveryCharge)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between font-heading text-base font-bold text-foreground">
            <span className="flex items-center gap-2">
              Total <Badge variant="outline">{order.paymentMethod}</Badge>
            </span>
            <span>{formatCurrencyBDT(order.total)}</span>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-border p-4">
          <Label htmlFor={`order-status-${order.id}`}>Order Status</Label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={status}
              onValueChange={(value) => {
                if (value) setStatus(value as OrderStatus);
              }}
            >
              <SelectTrigger
                id={`order-status-${order.id}`}
                className="w-full cursor-pointer sm:flex-1"
              >
                <SelectValue>
                  {(val) =>
                    ORDER_STATUS_OPTIONS.find((option) => option.value === val)
                      ?.label ?? String(val ?? "")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button type="button" onClick={handleStatusUpdate}>
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
