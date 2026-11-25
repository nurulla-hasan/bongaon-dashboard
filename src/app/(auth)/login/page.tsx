"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(6, { error: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "admin@bongaonbajar.com",
      password: "11111111",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async () => {
      toast.success("Logged in (mock preview)");
      router.push("/dashboard");
    },
  });

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="mb-6">
        <Logo size="lg" href="/login" />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Admin Sign In</CardTitle>
          <CardDescription>
            Sign in to manage Bongaon Bazar products, orders, and customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field name="email">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="admin@bongaonbajar.com"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">
                      {String(field.state.meta.errors[0].message ?? field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Password</Label>
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="••••••••"
                  />
                  {field.state.meta.errors[0] && (
                    <p className="text-xs text-destructive">
                      {String(field.state.meta.errors[0].message ?? field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Button type="submit" size="lg" className="w-full">
              Sign In to Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
