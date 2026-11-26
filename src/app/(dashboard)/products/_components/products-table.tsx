"use client";

import { DataTable } from "@/components/common/data-table";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useGetProducts } from "@/services";
import { productColumns } from "./product-columns";

type ProductFilterKey = "searchTerm" | "categoryId" | "isActive" | "page";

export function ProductsTable() {
  const filters = useNextFilter<ProductFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const searchTerm = filters.getFilter("searchTerm") || undefined;
  const rawCategoryId = filters.getFilter("categoryId");
  const categoryId =
    rawCategoryId && rawCategoryId !== "all" ? rawCategoryId : undefined;
  const rawIsActive = filters.getFilter("isActive");
  const isActive =
    rawIsActive === "true"
      ? true
      : rawIsActive === "false"
        ? false
        : undefined;

  const { data, isPending, isFetching, isError, error, refetch } =
    useGetProducts({
      page,
      limit: 10,
      searchTerm,
      categoryId,
      isActive,
    });

  return (
    <DataTable
      columns={productColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filter={filters}
      paginationKey="page"
      isLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      errorMessage={getErrorMessage(error, "Failed to load products")}
      onRetry={refetch}
    />
  );
}
