"use client";

import { DataTable } from "@/components/common/data-table";
import { MOCK_CATEGORIES } from "@/data/mock-dashboard";
import { categoryColumns } from "./category-columns";

export function CategoriesTable() {
  return <DataTable columns={categoryColumns} data={MOCK_CATEGORIES} />;
}
