"use client";

import { DataTable } from "@/components/common/data-table";
import { useNextFilter } from "@/hooks/useNextFilter";
import { getErrorMessage } from "@/lib/error";
import { useGetUsers } from "@/services";
import type { UserRole, UserSortBy, UserStatus } from "@/types";
import { userColumns } from "./user-columns";

type UserFilterKey = "searchTerm" | "role" | "status" | "sortBy" | "page";

const VALID_ROLES: UserRole[] = ["ADMIN", "USER"];
const VALID_STATUSES: UserStatus[] = ["ACTIVE", "BLOCKED"];
const VALID_SORTS: UserSortBy[] = ["newest", "oldest", "name_asc", "name_desc"];

export function UsersTable() {
  const filters = useNextFilter<UserFilterKey>();

  const page = Math.max(1, Number(filters.getFilter("page", "1")) || 1);
  const searchTerm = filters.getFilter("searchTerm") || undefined;
  const rawRole = filters.getFilter("role");
  const rawStatus = filters.getFilter("status");
  const rawSort = filters.getFilter("sortBy");

  const role = VALID_ROLES.includes(rawRole as UserRole)
    ? (rawRole as UserRole)
    : undefined;
  const status = VALID_STATUSES.includes(rawStatus as UserStatus)
    ? (rawStatus as UserStatus)
    : undefined;
  const sortBy = VALID_SORTS.includes(rawSort as UserSortBy)
    ? (rawSort as UserSortBy)
    : "newest";

  const { data, isPending, isFetching, isError, error, refetch } = useGetUsers({
    page,
    limit: 10,
    searchTerm,
    role,
    status,
    sortBy,
  });

  return (
    <DataTable
      columns={userColumns}
      data={data?.data ?? []}
      meta={data?.meta}
      filter={filters}
      paginationKey="page"
      isLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      errorMessage={getErrorMessage(error, "Failed to load users")}
      onRetry={refetch}
    />
  );
}
