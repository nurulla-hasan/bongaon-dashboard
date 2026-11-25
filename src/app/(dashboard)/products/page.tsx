import type { Metadata } from "next";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { MOCK_CATEGORIES } from "@/data/mock-dashboard";
import { ProductFormModal } from "./_components/product-form-modal";
import { ProductsTable } from "./_components/products-table";

export const metadata: Metadata = {
  title: "Products",
};

const CATEGORY_OPTIONS = [
  { label: "All Categories", value: "all" },
  ...MOCK_CATEGORIES.map((category) => ({
    label: category.name,
    value: category.id,
  })),
];

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
] as const;

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Products"
        description="Manage storefront catalog, pricing, stock levels, and visibility."
      >
        <ProductFormModal />
      </SectionHeading>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search products..."
          ariaLabel="Search products"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FilterSelect
            filterKey="categoryId"
            placeholder="All Categories"
            options={CATEGORY_OPTIONS}
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

      <ProductsTable />
    </div>
  );
}
