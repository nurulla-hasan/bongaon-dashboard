"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
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
import { useResetPassword } from "@/services";
import { resetPasswordSchema } from "@/validations";

export function ResetPasswordForm({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const router = useRouter();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      email,
      otp,
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: resetPasswordSchema,
    },
    onSubmit: ({ value }) => {
      resetPassword(
        {
          email: value.email,
          otp: value.otp,
          password: value.password,
        },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Password reset successfully");
            router.push("/login");
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Failed to reset password"));
          },
        },
      );
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Set a new password for your Bongaon Bazar admin account.
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
            name="email"
            label="Email"
            type="email"
            placeholder="admin@bongaonbajar.com"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="otp"
            label="6-Digit OTP"
            placeholder="123456"
            maxLength={6}
            inputMode="numeric"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="password"
            label="New Password"
            type="password"
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            disabled={isPending}
          />

          <FormInput
            form={form}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter new password"
            autoComplete="new-password"
            disabled={isPending}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isPending}
            loadingText="Resetting..."
          >
            Reset Password
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
