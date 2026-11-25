import { AlertTriangle, Mail, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_DASHBOARD_STATS } from "@/data/mock-dashboard";
import { formatCurrencyBDT } from "@/lib/utils";

const kpiCards = [
  {
    title: "Delivered Revenue",
    value: formatCurrencyBDT(MOCK_DASHBOARD_STATS.orders.totalRevenue),
    subtitle: `${formatCurrencyBDT(MOCK_DASHBOARD_STATS.orders.activeOrderValue)} in active pipeline`,
    icon: TrendingUp,
  },
  {
    title: "Total Orders",
    value: String(MOCK_DASHBOARD_STATS.orders.total),
    subtitle: `${MOCK_DASHBOARD_STATS.orders.pending} pending • ${MOCK_DASHBOARD_STATS.orders.inTransit} in transit`,
    icon: ShoppingBag,
  },
  {
    title: "Active Products",
    value: String(MOCK_DASHBOARD_STATS.catalog.activeProducts),
    subtitle: `${MOCK_DASHBOARD_STATS.catalog.categories} categories • ${MOCK_DASHBOARD_STATS.catalog.lowStockProducts} low stock`,
    icon: Package,
  },
  {
    title: "Customers & Inbox",
    value: String(MOCK_DASHBOARD_STATS.users.total),
    subtitle: `${MOCK_DASHBOARD_STATS.contacts.unread} unread messages • ${MOCK_DASHBOARD_STATS.reviews.pendingApproval} pending reviews`,
    icon: Users,
  },
];

export function OverviewKpis() {
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
            <div className="font-heading text-2xl font-bold text-foreground">{item.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function QuickAttentionBar() {
  const alerts = [
    {
      label: `${MOCK_DASHBOARD_STATS.orders.pending} Pending COD Orders`,
      icon: ShoppingBag,
    },
    {
      label: `${MOCK_DASHBOARD_STATS.catalog.lowStockProducts} Low Stock Products (≤ 5)`,
      icon: AlertTriangle,
    },
    {
      label: `${MOCK_DASHBOARD_STATS.contacts.unread} Unread Contact Messages`,
      icon: Mail,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {alerts.map((alert) => (
        <div
          key={alert.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <alert.icon className="size-4" />
          </span>
          <span className="font-medium text-foreground">{alert.label}</span>
        </div>
      ))}
    </div>
  );
}
