"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error";
import { useChangePassword } from "@/services";
import { changePasswordSchema } from "@/validations";

export function PasswordSettingsCard() {
  const { mutate: changePwd, isPending } = useChangePassword();

  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onChange: changePasswordSchema,
    },
    onSubmit: ({ value }) => {
      changePwd(
        {
          oldPassword: value.oldPassword,
          newPassword: value.newPassword,
        },
        {
          onSuccess: () => {
            toast.success("Password updated successfully");
            form.reset({
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to update password"));
          },
        },
      );
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Keep your admin account secure with a strong password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FormInput
            form={form}
            name="oldPassword"
            label="Current Password"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="Minimum 6 characters"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            disabled={isPending}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={isPending} loadingText="Updating...">
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
