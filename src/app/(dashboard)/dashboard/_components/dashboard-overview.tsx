"use client";

import Link from "next/link";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { formatCurrencyBDT, formatDate } from "@/lib/utils";
import { useGetDashboardOverview } from "@/services";
import type { OrderStatus } from "@/types";
import { OverviewKpis, QuickAttentionBar } from "./overview-kpis";
import { RevenueChartCard } from "./revenue-chart-card";

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

function DashboardOverviewSkeleton() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard overview"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-14 rounded-xl" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-96 rounded-xl xl:col-span-2" />
        <Skeleton className="h-96 rounded-xl" />
      </div>

      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export function DashboardOverview() {
  const { data, isPending, isError, error, refetch } =
    useGetDashboardOverview();

  if (isPending) {
    return <DashboardOverviewSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="size-5" />
          </span>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              Failed to load dashboard overview
            </p>
            <p className="text-sm text-muted-foreground">
              {getErrorMessage(error, "Could not fetch overview statistics.")}
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const overview = data.data;

  const orderBreakdown = [
    {
      label: "Pending",
      count: overview.orders.pending,
      variant: "pending" as const,
    },
    {
      label: "Processing",
      count: overview.orders.processing,
      variant: "processing" as const,
    },
    {
      label: "In Transit",
      count: overview.orders.inTransit,
      variant: "info" as const,
    },
    {
      label: "Delivered",
      count: overview.orders.delivered,
      variant: "accepted" as const,
    },
    {
      label: "Cancelled",
      count: overview.orders.cancelled,
      variant: "rejected" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <OverviewKpis stats={overview} />

      <QuickAttentionBar stats={overview} />

      <div className="grid gap-4 xl:grid-cols-3">
        <RevenueChartCard data={overview.monthlyRevenue} />

        <Card>
          <CardHeader>
            <CardTitle>Order Pipeline</CardTitle>
            <CardDescription>
              Breakdown across all COD order stages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {orderBreakdown.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
              >
                <Badge variant={row.variant}>{row.label}</Badge>
                <span className="font-heading text-sm font-semibold text-foreground">
                  {row.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent COD Orders</CardTitle>
            <CardDescription>
              Latest incoming customer orders across Bangladesh
            </CardDescription>
          </div>
          <Button render={<Link href="/orders" />} variant="ghost">
            Manage Orders
          </Button>
        </CardHeader>
        <CardContent>
          {overview.recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-10 text-center">
              <ShoppingBag className="size-8 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium text-foreground">
                No orders placed yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Recent Cash on Delivery orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {overview.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {order.orderNumber}
                      </span>
                      <Badge variant={statusVariantMap[order.status]}>
                        {statusLabelMap[order.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.receiverName} • {order.district} •{" "}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-heading text-base font-bold text-foreground">
                      {formatCurrencyBDT(order.total)}
                    </span>
                    <Badge variant="outline">{order.paymentMethod}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
