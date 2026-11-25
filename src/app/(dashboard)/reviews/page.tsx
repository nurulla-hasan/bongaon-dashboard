import type { Metadata } from "next";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { ReviewsTable } from "./_components/reviews-table";

export const metadata: Metadata = {
  title: "Reviews",
};

const RATING_OPTIONS = [
  { label: "All Ratings", value: "all" },
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  { label: "3 Stars", value: "3" },
  { label: "2 Stars", value: "2" },
  { label: "1 Star", value: "1" },
] as const;

const APPROVAL_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Approved", value: "true" },
  { label: "Pending", value: "false" },
] as const;

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Reviews"
        description="Moderate customer product reviews, ratings, and storefront approval."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search customer, product, or comment..."
          ariaLabel="Search reviews"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FilterSelect
            filterKey="rating"
            placeholder="All Ratings"
            options={RATING_OPTIONS}
            className="w-full sm:w-40"
          />
          <FilterSelect
            filterKey="isApproved"
            placeholder="All Status"
            options={APPROVAL_OPTIONS}
            className="w-full sm:w-40"
          />
        </div>
      </div>

      <ReviewsTable />
    </div>
  );
}
