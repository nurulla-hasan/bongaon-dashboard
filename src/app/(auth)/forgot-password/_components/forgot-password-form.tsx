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
import { useForgotPassword } from "@/services";
import { forgotPasswordSchema } from "@/validations";

export function ForgotPasswordForm() {
  const router = useRouter();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: forgotPasswordSchema,
    },
    onSubmit: ({ value }) => {
      forgotPassword(value, {
        onSuccess: (res) => {
          toast.success(res.message || "Reset OTP sent to your email");
          router.push(
            `/verify-reset-otp?email=${encodeURIComponent(value.email)}`,
          );
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Failed to send reset OTP"));
        },
      });
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your admin email to receive a 6-digit password reset OTP.
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
            label="Admin Email"
            type="email"
            placeholder="admin@bongaonbajar.com"
            autoComplete="email"
            disabled={isPending}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isPending}
            loadingText="Sending OTP..."
          >
            Send Reset OTP
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
