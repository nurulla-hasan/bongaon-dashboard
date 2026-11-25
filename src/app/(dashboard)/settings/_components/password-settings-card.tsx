"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormInput } from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { error: "Current password is required." }),
    newPassword: z
      .string()
      .min(6, { error: "New password must be at least 6 characters." }),
    confirmPassword: z.string().min(1, { error: "Please confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

export function PasswordSettingsCard() {
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async () => {
      toast.success("Password updated (UI preview)");
      form.reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
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
          />

          <FormInput
            form={form}
            name="newPassword"
            label="New Password"
            type="password"
            placeholder="Minimum 6 characters"
          />

          <FormInput
            form={form}
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
          />

          <div className="flex justify-end pt-2">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
