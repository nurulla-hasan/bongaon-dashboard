import type { OrderStatus } from "./api.types";

export type OrderSortBy = "newest" | "oldest" | "total_asc" | "total_desc";

export interface ApiOrderItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  selectedPack: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  userId: string | null;
  receiverName: string;
  receiverPhone: string;
  district: string;
  fullAddress: string;
  whatsappNumber: string;
  orderNote: string;
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
}

export interface GetOrdersParams {
  searchTerm?: string;
  status?: OrderStatus;
  district?: string;
  page?: number;
  limit?: number;
  sortBy?: OrderSortBy;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
