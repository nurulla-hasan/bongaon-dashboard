"use client";

import { DataTable } from "@/components/common/data-table";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useGetContacts } from "@/services";
import type { ContactSortBy, ContactStatus } from "@/types";
import { contactColumns } from "./contact-columns";

type ContactFilterKey = "searchTerm" | "status" | "sortBy" | "page";

const VALID_CONTACT_STATUSES = new Set<ContactStatus>([
  "NEW",
  "READ",
  "REPLIED",
  "ARCHIVED",
]);

const VALID_CONTACT_SORTS = new Set<ContactSortBy>(["newest", "oldest"]);

export function ContactsTable() {
  const filters = useNextFilter<ContactFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const searchTerm = filters.getFilter("searchTerm") || undefined;

  const rawStatus = filters.getFilter("status");
  const status =
    rawStatus &&
    rawStatus !== "all" &&
    VALID_CONTACT_STATUSES.has(rawStatus as ContactStatus)
      ? (rawStatus as ContactStatus)
      : undefined;

  const rawSortBy = filters.getFilter("sortBy", "newest");
  const sortBy = VALID_CONTACT_SORTS.has(rawSortBy as ContactSortBy)
    ? (rawSortBy as ContactSortBy)
    : "newest";

  const { data, isPending, isFetching, isError, error, refetch } =
    useGetContacts({
      page,
      limit: 10,
      searchTerm,
      status,
      sortBy,
    });

  return (
    <DataTable
      columns={contactColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filter={filters}
      paginationKey="page"
      isLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      errorMessage={getErrorMessage(error, "Failed to load contact messages")}
      onRetry={refetch}
    />
  );
}
