import type { OrderStatus } from "./api.types";

export interface DashboardMonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  receiverName: string;
  district: string;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ApiDashboardOverview {
  orders: {
    total: number;
    pending: number;
    processing: number;
    inTransit: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
    activeOrderValue: number;
  };
  catalog: {
    categories: number;
    activeProducts: number;
    lowStockProducts: number;
  };
  users: {
    total: number;
  };
  contacts: {
    unread: number;
  };
  reviews: {
    pendingApproval: number;
  };
  monthlyRevenue: DashboardMonthlyRevenue[];
  recentOrders: DashboardRecentOrder[];
}
