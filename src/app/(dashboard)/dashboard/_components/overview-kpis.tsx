import Link from "next/link";
import {
  AlertTriangle,
  Mail,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyBDT } from "@/lib/utils";
import type { ApiDashboardOverview } from "@/types";

export function OverviewKpis({ stats }: { stats: ApiDashboardOverview }) {
  const kpiCards = [
    {
      title: "Delivered Revenue",
      value: formatCurrencyBDT(stats.orders.totalRevenue),
      subtitle: `${formatCurrencyBDT(stats.orders.activeOrderValue)} in active pipeline`,
      icon: TrendingUp,
    },
    {
      title: "Total Orders",
      value: String(stats.orders.total),
      subtitle: `${stats.orders.pending} pending • ${stats.orders.inTransit} in transit`,
      icon: ShoppingBag,
    },
    {
      title: "Active Products",
      value: String(stats.catalog.activeProducts),
      subtitle: `${stats.catalog.categories} categories • ${stats.catalog.lowStockProducts} low stock`,
      icon: Package,
    },
    {
      title: "Customers & Inbox",
      value: String(stats.users.total),
      subtitle: `${stats.contacts.unread} unread messages • ${stats.reviews.pendingApproval} pending reviews`,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpiCards.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <item.icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-heading text-2xl font-bold text-foreground">
              {item.value}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function QuickAttentionBar({ stats }: { stats: ApiDashboardOverview }) {
  const alerts = [
    {
      href: "/orders?status=PENDING",
      label: `${stats.orders.pending} Pending COD Orders`,
      icon: ShoppingBag,
    },
    {
      href: "/products",
      label: `${stats.catalog.lowStockProducts} Low Stock Products (≤ 5)`,
      icon: AlertTriangle,
    },
    {
      href: "/contacts?status=NEW",
      label: `${stats.contacts.unread} Unread Contact Messages`,
      icon: Mail,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {alerts.map((alert) => (
        <Link
          key={alert.label}
          href={alert.href}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-muted/30"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <alert.icon className="size-4" />
          </span>
          <span className="font-medium text-foreground">{alert.label}</span>
        </Link>
      ))}
    </div>
  );
}
