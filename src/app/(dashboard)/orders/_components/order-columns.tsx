"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { MockOrder, OrderStatus } from "@/data/mock-dashboard";
import { formatCurrencyBDT, formatDate } from "@/lib/utils";
import { OrderDetailsModal } from "./order-details-modal";

const statusVariantMap: Record<
  OrderStatus,
  "pending" | "processing" | "info" | "accepted" | "rejected"
> = {
  PENDING: "pending",
  PROCESSING: "processing",
  IN_TRANSIT: "info",
  DELIVERED: "accepted",
  CANCELLED: "rejected",
};

const statusLabelMap: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const orderColumns: ColumnDef<MockOrder>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="py-1">
          <p className="font-mono text-sm font-semibold text-foreground">
            {order.orderNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "receiverName",
    header: "Customer",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">{order.receiverName}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {order.receiverPhone}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "district",
    header: "Delivery Address",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="max-w-64 min-w-0">
          <p className="font-medium text-foreground">{order.district}</p>
          <p className="truncate text-xs text-muted-foreground">
            {order.fullAddress}
          </p>
        </div>
      );
    },
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const count = row.original.items.reduce((sum, item) => sum + item.quantity, 0);
      return (
        <Badge variant="secondary">
          {count} {count === 1 ? "item" : "items"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="flex items-center gap-2">
          <span className="font-heading font-semibold text-foreground">
            {formatCurrencyBDT(order.total)}
          </span>
          <Badge variant="outline">{order.paymentMethod}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusVariantMap[status]}>
          {statusLabelMap[status]}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    meta: { headerClassName: "text-right" },
    cell: ({ row }) => (
      <div className="flex items-center justify-end pr-2">
        <OrderDetailsModal order={row.original} />
      </div>
    ),
  },
];
