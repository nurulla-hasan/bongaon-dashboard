import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MOCK_DASHBOARD_STATS, MOCK_ORDERS, type OrderStatus } from "@/data/mock-dashboard";
import { formatCurrencyBDT, formatDate } from "@/lib/utils";
import { OverviewKpis, QuickAttentionBar } from "./_components/overview-kpis";
import { RevenueChartCard } from "./_components/revenue-chart-card";

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

const orderBreakdown = [
  { label: "Pending", count: MOCK_DASHBOARD_STATS.orders.pending, variant: "pending" as const },
  {
    label: "Processing",
    count: MOCK_DASHBOARD_STATS.orders.processing,
    variant: "processing" as const,
  },
  { label: "In Transit", count: MOCK_DASHBOARD_STATS.orders.inTransit, variant: "info" as const },
  { label: "Delivered", count: MOCK_DASHBOARD_STATS.orders.delivered, variant: "accepted" as const },
  { label: "Cancelled", count: MOCK_DASHBOARD_STATS.orders.cancelled, variant: "rejected" as const },
];

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        title="Dashboard Overview"
        description="Monitor Bongaon Bazar orders, inventory, reviews, and customer inquiries."
      >
        <Button render={<Link href="/orders" />}>
          View All Orders
        </Button>
      </SectionHeading>

      <OverviewKpis />

      <QuickAttentionBar />

      <div className="grid gap-4 xl:grid-cols-3">
        <RevenueChartCard />

        <Card>
          <CardHeader>
            <CardTitle>Order Pipeline</CardTitle>
            <CardDescription>Breakdown across all COD order stages</CardDescription>
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
            <CardDescription>Latest incoming customer orders across Bangladesh</CardDescription>
          </div>
          <Button render={<Link href="/orders" />} variant="ghost">
            Manage Orders
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_ORDERS.map((order) => (
              <div
                key={order.id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {order.orderNumber}
                    </span>
                    <Badge variant={statusVariantMap[order.status]}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.receiverName} • {order.district} • {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-heading text-base font-bold text-foreground">
                    {formatCurrencyBDT(order.total)}
                  </span>
                  <Badge variant="outline">COD</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
