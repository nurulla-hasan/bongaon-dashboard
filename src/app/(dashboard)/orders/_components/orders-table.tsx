"use client";

import { DataTable } from "@/components/common/data-table";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useGetOrders } from "@/services";
import type { OrderSortBy, OrderStatus } from "@/types";
import { orderColumns } from "./order-columns";

type OrderFilterKey = "searchTerm" | "status" | "sortBy" | "page";

const VALID_ORDER_STATUSES = new Set<OrderStatus>([
  "PENDING",
  "PROCESSING",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
]);

const VALID_ORDER_SORTS = new Set<OrderSortBy>([
  "newest",
  "oldest",
  "total_asc",
  "total_desc",
]);

export function OrdersTable() {
  const filters = useNextFilter<OrderFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const searchTerm = filters.getFilter("searchTerm") || undefined;

  const rawStatus = filters.getFilter("status");
  const status =
    rawStatus &&
    rawStatus !== "all" &&
    VALID_ORDER_STATUSES.has(rawStatus as OrderStatus)
      ? (rawStatus as OrderStatus)
      : undefined;

  const rawSortBy = filters.getFilter("sortBy", "newest");
  const sortBy = VALID_ORDER_SORTS.has(rawSortBy as OrderSortBy)
    ? (rawSortBy as OrderSortBy)
    : "newest";

  const { data, isPending, isFetching, isError, error, refetch } =
    useGetOrders({
      page,
      limit: 10,
      searchTerm,
      status,
      sortBy,
    });

  return (
    <DataTable
      columns={orderColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filter={filters}
      paginationKey="page"
      isLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      errorMessage={getErrorMessage(error, "Failed to load orders")}
      onRetry={refetch}
    />
  );
}
