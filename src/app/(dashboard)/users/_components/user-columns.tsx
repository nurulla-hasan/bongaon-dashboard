"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/common/confirmation-modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import type { MockUser } from "@/data/mock-dashboard";
import { formatDate, getInitials } from "@/lib/utils";
import { UserManageModal } from "./user-manage-modal";

export const userColumns: ColumnDef<MockUser>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3 py-1">
          <Avatar>
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
    cell: ({ row }) => {
      const user = row.original;
      const isActive = user.status === "ACTIVE";
      return (
        <div className="flex items-center gap-2.5">
          <Switch
            defaultChecked={isActive}
            onCheckedChange={(checked) =>
              toast.success(
                `"${user.name}" ${checked ? "activated" : "blocked"} (UI preview)`,
              )
            }
            aria-label={`Toggle ${user.name} status`}
          />
          <Badge variant={isActive ? "active" : "blocked"}>
            {isActive ? "Active" : "Blocked"}
          </Badge>
        </div>
      );
    },
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

          <ConfirmationModal
            title="Delete User"
            description={`Are you sure you want to delete "${user.name}"? This action cannot be undone.`}
            confirmText="Delete"
            triggerVariant="ghost"
            triggerSize="icon"
            onConfirm={() => {
              toast.success(`Deleted "${user.name}" (UI preview)`);
            }}
          />
        </div>
      );
    },
  },
];
