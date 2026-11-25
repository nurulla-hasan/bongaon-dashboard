"use client";

import { DataTable } from "@/components/common/data-table";
import { MOCK_REVIEWS } from "@/data/mock-dashboard";
import { reviewColumns } from "./review-columns";

export function ReviewsTable() {
  return <DataTable columns={reviewColumns} data={MOCK_REVIEWS} />;
}
