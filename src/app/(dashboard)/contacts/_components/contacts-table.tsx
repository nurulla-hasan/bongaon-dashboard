"use client";

import { DataTable } from "@/components/common/data-table";
import { MOCK_CONTACTS } from "@/data/mock-dashboard";
import { contactColumns } from "./contact-columns";

export function ContactsTable() {
  return <DataTable columns={contactColumns} data={MOCK_CONTACTS} />;
}
