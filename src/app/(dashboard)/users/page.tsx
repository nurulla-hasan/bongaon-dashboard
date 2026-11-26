import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { CreateAdminModal } from "./_components/create-admin-modal";
import { UsersTable } from "./_components/users-table";

export const metadata: Metadata = {
  title: "Users",
};

const ROLE_OPTIONS = [
  { label: "All Roles", value: "all" },
  { label: "Admin", value: "ADMIN" },
  { label: "User", value: "USER" },
] as const;

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
] as const;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Name (A–Z)", value: "name_asc" },
  { label: "Name (Z–A)", value: "name_desc" },
] as const;

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Users"
        description="Manage customer accounts, admin roles, and account status."
      >
        <CreateAdminModal />
      </SectionHeading>

      <Suspense fallback={null}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            placeholder="Search name, email, or phone..."
            ariaLabel="Search users"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FilterSelect
              filterKey="role"
              placeholder="All Roles"
              options={ROLE_OPTIONS}
              className="w-full sm:w-36"
            />
            <FilterSelect
              filterKey="status"
              placeholder="All Status"
              options={STATUS_OPTIONS}
              className="w-full sm:w-36"
            />
            <FilterSelect
              filterKey="sortBy"
              placeholder="Sort By"
              defaultValue="newest"
              options={SORT_OPTIONS}
              className="w-full sm:w-40"
            />
          </div>
        </div>

        <UsersTable />
      </Suspense>
    </div>
  );
}
