"use client";

import { DataTable } from "@/components/common/data-table";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useGetReviews } from "@/services";
import { reviewColumns } from "./review-columns";

type ReviewFilterKey = "searchTerm" | "rating" | "isApproved" | "page";

export function ReviewsTable() {
  const filters = useNextFilter<ReviewFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const searchTerm = filters.getFilter("searchTerm") || undefined;

  const rawRating = filters.getFilter("rating");
  const parsedRating =
    rawRating && rawRating !== "all" ? Number(rawRating) : undefined;
  const rating =
    parsedRating &&
    Number.isInteger(parsedRating) &&
    parsedRating >= 1 &&
    parsedRating <= 5
      ? parsedRating
      : undefined;

  const rawIsApproved = filters.getFilter("isApproved");
  const isApproved =
    rawIsApproved === "true"
      ? true
      : rawIsApproved === "false"
        ? false
        : undefined;

  const { data, isPending, isFetching, isError, error, refetch } =
    useGetReviews({
      page,
      limit: 10,
      searchTerm,
      rating,
      isApproved,
    });

  return (
    <DataTable
      columns={reviewColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filter={filters}
      paginationKey="page"
      isLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      errorMessage={getErrorMessage(error, "Failed to load reviews")}
      onRetry={refetch}
    />
  );
}
