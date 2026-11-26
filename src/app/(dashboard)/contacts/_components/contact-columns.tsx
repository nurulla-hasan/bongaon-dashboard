"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage } from "@/lib/error";
import { formatDate } from "@/lib/utils";
import { useDeleteContact } from "@/services";
import type { ApiContactMessage, ContactStatus } from "@/types";
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

function DeleteContactCell({ contact }: { contact: ApiContactMessage }) {
  const [open, setOpen] = useState(false);
  const { mutate: removeContact, isPending } = useDeleteContact();

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={setOpen}
      isLoading={isPending}
      title="Delete Message"
      description={`Are you sure you want to delete the inquiry from "${contact.name}"? This action cannot be undone.`}
      confirmText="Delete"
      loadingText="Deleting..."
      triggerVariant="ghost"
      triggerSize="icon"
      onConfirm={() => {
        removeContact(contact.id, {
          onSuccess: () => {
            toast.success(`Deleted message from "${contact.name}"`);
            setOpen(false);
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to delete message"));
          },
        });
      }}
    />
  );
}

export const contactColumns: ColumnDef<ApiContactMessage>[] = [
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
          <DeleteContactCell contact={contact} />
        </div>
      );
    },
  },
];
