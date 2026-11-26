import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { OrdersTable } from "./_components/orders-table";

export const metadata: Metadata = {
  title: "Orders",
};

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "In Transit", value: "IN_TRANSIT" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
] as const;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Total: Low to High", value: "total_asc" },
  { label: "Total: High to Low", value: "total_desc" },
] as const;

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Orders"
        description="Review incoming Cash on Delivery orders and update fulfillment status."
      />

      <Suspense fallback={null}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            placeholder="Search order #, phone, or name..."
            ariaLabel="Search orders"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FilterSelect
              filterKey="status"
              placeholder="All Status"
              options={STATUS_OPTIONS}
              className="w-full sm:w-44"
            />
            <FilterSelect
              filterKey="sortBy"
              placeholder="Sort By"
              defaultValue="newest"
              options={SORT_OPTIONS}
              className="w-full sm:w-44"
            />
          </div>
        </div>

        <OrdersTable />
      </Suspense>
    </div>
  );
}
