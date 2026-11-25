"use client";

import { DataTable } from "@/components/common/data-table";
import { MOCK_PRODUCTS } from "@/data/mock-dashboard";
import { productColumns } from "./product-columns";

export function ProductsTable() {
  return <DataTable columns={productColumns} data={MOCK_PRODUCTS} />;
}
