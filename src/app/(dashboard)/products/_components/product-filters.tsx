"use client";

import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { useGetCategories } from "@/services";

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
] as const;

export function ProductFilters() {
  const { data } = useGetCategories({ limit: 100 });

  const categoryOptions = [
    { label: "All Categories", value: "all" },
    ...(data?.data ?? []).map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <SearchInput
        placeholder="Search products..."
        ariaLabel="Search products"
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <FilterSelect
          filterKey="categoryId"
          placeholder="All Categories"
          options={categoryOptions}
          className="w-full sm:w-52"
        />
        <FilterSelect
          filterKey="isActive"
          placeholder="All Status"
          options={STATUS_OPTIONS}
          className="w-full sm:w-40"
        />
      </div>
    </div>
  );
}
