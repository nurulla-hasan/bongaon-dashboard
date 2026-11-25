"use client";

import { DataTable } from "@/components/common/data-table";
import { MOCK_USERS } from "@/data/mock-dashboard";
import { userColumns } from "./user-columns";

export function UsersTable() {
  return <DataTable columns={userColumns} data={MOCK_USERS} />;
}
