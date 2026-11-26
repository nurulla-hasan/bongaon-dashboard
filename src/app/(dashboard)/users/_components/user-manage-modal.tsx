"use client";

import { useState, type ReactNode } from "react";
import { Mail, Phone, Shield } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/common/modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getErrorMessage } from "@/lib/error";
import { formatDate, getInitials } from "@/lib/utils";
import { useUpdateUserRole, useUpdateUserStatus } from "@/services";
import type { ApiUser, UserRole, UserStatus } from "@/types";

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "User", value: "USER" },
  { label: "Admin", value: "ADMIN" },
];

const STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

interface UserManageModalProps {
  user: ApiUser;
  actionTrigger?: ReactNode;
}

export function UserManageModal({ user, actionTrigger }: UserManageModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);

  const { mutate: updateRole, isPending: isUpdatingRole } = useUpdateUserRole();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserStatus();

  const isBusy = isSubmitting || isUpdatingRole || isUpdatingStatus;
  const hasChanges = role !== user.role || status !== user.status;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isBusy) return;
    if (nextOpen) {
      setRole(user.role);
      setStatus(user.status);
    }
    setOpen(nextOpen);
  };

  const handleSave = () => {
    const roleChanged = role !== user.role;
    const statusChanged = status !== user.status;

    if (!roleChanged && !statusChanged) {
      setOpen(false);
      return;
    }

    setIsSubmitting(true);

    const finishSuccess = () => {
      setIsSubmitting(false);
      toast.success(`Updated "${user.name}" successfully`);
      setOpen(false);
    };

    const syncStatus = () => {
      if (!statusChanged) {
        finishSuccess();
        return;
      }

      updateStatus(
        { id: user.id, payload: { status } },
        {
          onSuccess: finishSuccess,
          onError: (err) => {
            setIsSubmitting(false);
            toast.error(getErrorMessage(err, "Failed to update user status"));
          },
        },
      );
    };

    if (roleChanged) {
      updateRole(
        { id: user.id, payload: { role } },
        {
          onSuccess: syncStatus,
          onError: (err) => {
            setIsSubmitting(false);
            toast.error(getErrorMessage(err, "Failed to update user role"));
          },
        },
      );
      return;
    }

    syncStatus();
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      actionTrigger={
        actionTrigger ?? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Manage ${user.name}`}
          >
            <Shield className="size-4" />
          </Button>
        )
      }
      title="Manage User"
      description={`Joined on ${formatDate(user.createdAt)}`}
      size="default"
    >
      <div className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
          <Avatar>
            {user.imageUrl && (
              <AvatarImage src={user.imageUrl} alt={user.name} />
            )}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <Badge variant={user.emailVerified ? "active" : "secondary"}>
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="size-3.5" />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="size-3.5" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`user-role-${user.id}`}>Role</Label>
            <Select
              value={role}
              disabled={isBusy}
              onValueChange={(value) => {
                if (value) setRole(value as UserRole);
              }}
            >
              <SelectTrigger
                id={`user-role-${user.id}`}
                className="w-full cursor-pointer"
              >
                <SelectValue>
                  {(val) =>
                    ROLE_OPTIONS.find((option) => option.value === val)?.label ??
                    String(val ?? "")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`user-status-${user.id}`}>Account Status</Label>
            <Select
              value={status}
              disabled={isBusy}
              onValueChange={(value) => {
                if (value) setStatus(value as UserStatus);
              }}
            >
              <SelectTrigger
                id={`user-status-${user.id}`}
                className="w-full cursor-pointer"
              >
                <SelectValue>
                  {(val) =>
                    STATUS_OPTIONS.find((option) => option.value === val)
                      ?.label ?? String(val ?? "")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isBusy}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            loading={isBusy}
            loadingText="Saving..."
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
