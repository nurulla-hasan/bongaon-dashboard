"use client";

import { DataTable } from "@/components/common/data-table";
import { MOCK_ORDERS } from "@/data/mock-dashboard";
import { orderColumns } from "./order-columns";

export function OrdersTable() {
  return <DataTable columns={orderColumns} data={MOCK_ORDERS} />;
}
