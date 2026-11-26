import { Suspense } from "react";
import type { Metadata } from "next";
import { FilterSelect } from "@/components/common/filter-select";
import { SearchInput } from "@/components/common/search-input";
import { SectionHeading } from "@/components/common/section-heading";
import { ContactsTable } from "./_components/contacts-table";

export const metadata: Metadata = {
  title: "Contacts",
};

const STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "New", value: "NEW" },
  { label: "Read", value: "READ" },
  { label: "Replied", value: "REPLIED" },
  { label: "Archived", value: "ARCHIVED" },
] as const;

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
] as const;

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Contacts"
        description="Read customer inquiries, update status, and send email replies."
      />

      <Suspense fallback={null}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            placeholder="Search name, phone, email, or subject..."
            ariaLabel="Search contacts"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <FilterSelect
              filterKey="status"
              placeholder="All Status"
              options={STATUS_OPTIONS}
              className="w-full sm:w-40"
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

        <ContactsTable />
      </Suspense>
    </div>
  );
}
