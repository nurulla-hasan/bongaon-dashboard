"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { USER_HOME } from "@/constants/auth";
import { getErrorMessage } from "@/lib/error";
import { useLogin } from "@/services";
import { loginSchema } from "@/validations";

function getSafeRedirect(callbackUrl?: string): string {
  if (!callbackUrl) return USER_HOME;
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return USER_HOME;
  }
  return callbackUrl;
}

export function LoginForm({
  callbackUrl,
  error,
}: {
  callbackUrl?: string;
  error?: string;
}) {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: () => {
          toast.success("Signed in successfully");
          router.push(getSafeRedirect(callbackUrl));
          router.refresh();
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Invalid email or password"));
        },
      });
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Admin Sign In</CardTitle>
        <CardDescription>
          Sign in to manage Bongaon Bazar products, orders, and customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error === "forbidden" && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-center text-xs font-medium text-destructive">
            Only administrator accounts can access the dashboard.
          </div>
        )}

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
            autoComplete="email"
            disabled={isPending}
          />

          <div className="space-y-1.5">
            <FormInput
              form={form}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isPending}
            />
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isPending}
            loadingText="Signing in..."
          >
            Sign In to Dashboard
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
