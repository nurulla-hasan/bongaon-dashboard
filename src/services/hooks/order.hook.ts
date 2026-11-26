"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getOrderById,
  getOrders,
  updateOrderStatus,
} from "../api/order.api";
import type { GetOrdersParams, UpdateOrderStatusPayload } from "@/types";

export function useGetOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => getOrders(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetOrderById(id: string, enabled = true) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id) && enabled,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateOrderStatusPayload;
    }) => updateOrderStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
