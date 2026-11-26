"use client";

import { DataTable } from "@/components/common/data-table";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useGetCategories } from "@/services";
import { categoryColumns } from "./category-columns";

type CategoryFilterKey = "searchTerm" | "isActive" | "page";

export function CategoriesTable() {
  const filters = useNextFilter<CategoryFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const searchTerm = filters.getFilter("searchTerm") || undefined;
  const rawIsActive = filters.getFilter("isActive");
  const isActive =
    rawIsActive === "true"
      ? true
      : rawIsActive === "false"
        ? false
        : undefined;

  const { data, isPending, isFetching, isError, error, refetch } =
    useGetCategories({
      page,
      limit: 10,
      searchTerm,
      isActive,
    });

  return (
    <DataTable
      columns={categoryColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filter={filters}
      paginationKey="page"
      isLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      errorMessage={getErrorMessage(error, "Failed to load categories")}
      onRetry={refetch}
    />
  );
}
