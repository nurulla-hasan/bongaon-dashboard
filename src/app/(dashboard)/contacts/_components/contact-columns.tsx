"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import type { ContactStatus, MockContactMessage } from "@/data/mock-dashboard";
import { formatDate } from "@/lib/utils";
import { ContactDetailsModal } from "./contact-details-modal";

const statusVariantMap: Record<
  ContactStatus,
  "pending" | "info" | "accepted" | "secondary"
> = {
  NEW: "pending",
  READ: "info",
  REPLIED: "accepted",
  ARCHIVED: "secondary",
};

const statusLabelMap: Record<ContactStatus, string> = {
  NEW: "New",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};

export const contactColumns: ColumnDef<MockContactMessage>[] = [
  {
    accessorKey: "name",
    header: "Sender",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="py-1">
          <p className="font-medium text-foreground">{contact.name}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {contact.phone}
            {contact.email ? ` • ${contact.email}` : ""}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: "Message",
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="max-w-80 min-w-0">
          <p className="truncate font-medium text-foreground">
            {contact.subject || "General Inquiry"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {contact.message}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={statusVariantMap[status]}>
          {statusLabelMap[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Received",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    meta: { headerClassName: "text-right" },
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5 pr-2">
          <ContactDetailsModal contact={contact} />

          <ConfirmationModal
            title="Delete Message"
            description={`Are you sure you want to delete the inquiry from "${contact.name}"? This action cannot be undone.`}
            confirmText="Delete"
            triggerVariant="ghost"
            triggerSize="icon"
            onConfirm={() => {
              toast.success(`Deleted message from "${contact.name}" (UI preview)`);
            }}
          />
        </div>
      );
    },
  },
];
