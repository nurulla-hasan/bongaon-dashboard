import type { Metadata } from "next";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { CategoriesTable } from "./_components/categories-table";
import { CategoryFormModal } from "./_components/category-form-modal";

export const metadata: Metadata = {
  title: "Categories",
};

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Categories"
        description="Manage storefront product categories, display order, and visibility."
      >
        <CategoryFormModal />
      </SectionHeading>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search categories..."
          ariaLabel="Search categories"
        />

        <FilterSelect
          filterKey="status"
          placeholder="All Status"
          options={STATUS_OPTIONS}
          className="w-full sm:w-44"
        />
      </div>

      <CategoriesTable />
    </div>
  );
}
