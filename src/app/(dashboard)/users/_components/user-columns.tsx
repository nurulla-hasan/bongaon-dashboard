"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { getErrorMessage } from "@/lib/error";
import { formatDate, getInitials } from "@/lib/utils";
import { useDeleteUser, useUpdateUserStatus } from "@/services";
import type { ApiUser } from "@/types";
import { UserManageModal } from "./user-manage-modal";

function UserStatusCell({ user }: { user: ApiUser }) {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();
  const isActive = user.status === "ACTIVE";

  return (
    <div className="flex items-center gap-2.5">
      <Switch
        checked={isActive}
        disabled={isPending}
        onCheckedChange={(checked) => {
          const nextStatus = checked ? "ACTIVE" : "BLOCKED";
          updateStatus(
            { id: user.id, payload: { status: nextStatus } },
            {
              onSuccess: () => {
                toast.success(
                  `"${user.name}" ${checked ? "activated" : "blocked"}`,
                );
              },
              onError: (err) => {
                toast.error(getErrorMessage(err, "Failed to update status"));
              },
            },
          );
        }}
        aria-label={`Toggle ${user.name} status`}
      />
      <Badge variant={isActive ? "active" : "blocked"}>
        {isActive ? "Active" : "Blocked"}
      </Badge>
    </div>
  );
}

function DeleteUserCell({ user }: { user: ApiUser }) {
  const [open, setOpen] = useState(false);
  const { mutate: removeUser, isPending } = useDeleteUser();

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={setOpen}
      isLoading={isPending}
      title="Delete User"
      description={`Are you sure you want to delete "${user.name}"? This action cannot be undone.`}
      confirmText="Delete"
      loadingText="Deleting..."
      triggerVariant="ghost"
      triggerSize="icon"
      onConfirm={() => {
        removeUser(user.id, {
          onSuccess: () => {
            toast.success(`Deleted "${user.name}"`);
            setOpen(false);
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to delete user"));
          },
        });
      }}
    />
  );
}

export const userColumns: ColumnDef<ApiUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar>
            {user.imageUrl && (
              <AvatarImage src={user.imageUrl} alt={user.name} />
            )}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.phone || "—"}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant={role === "ADMIN" ? "admin" : "member"}>{role}</Badge>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email",
    cell: ({ row }) => (
      <Badge variant={row.original.emailVerified ? "active" : "secondary"}>
        {row.original.emailVerified ? "Verified" : "Unverified"}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UserStatusCell user={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
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
      const user = row.original;
      return (
        <div className="flex items-center justify-end gap-1.5 pr-2">
          <UserManageModal user={user} />
          <DeleteUserCell user={user} />
        </div>
      );
    },
  },
];
