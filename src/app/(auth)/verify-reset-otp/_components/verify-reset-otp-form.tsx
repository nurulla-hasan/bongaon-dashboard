"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useCountdown } from "@/hooks/useUtilityHooks";
import { getErrorMessage } from "@/lib/error";
import { useResendResetOtp, useVerifyResetOtp } from "@/services";
import { verifyResetOtpSchema } from "@/validations";

export function VerifyResetOtpForm({ email }: { email: string }) {
  const router = useRouter();
  const { secondsLeft, isRunning, start } = useCountdown(60, "admin-reset-otp");
  const { mutate: verifyOtp, isPending } = useVerifyResetOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendResetOtp();

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onChange: verifyResetOtpSchema,
    },
    onSubmit: ({ value }) => {
      if (!email) {
        toast.error("Email is missing. Please restart from Forgot Password.");
        router.push("/forgot-password");
        return;
      }

      verifyOtp(
        { email, otp: value.otp },
        {
          onSuccess: (res) => {
            toast.success(res.message || "OTP verified");
            router.push(
              `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(value.otp)}`,
            );
          },
          onError: (err) => {
            toast.error(getErrorMessage(err, "Invalid or expired OTP"));
          },
        },
      );
    },
  });

  const handleResend = () => {
    if (!email) {
      toast.error("Email is missing. Please go back and enter your email.");
      return;
    }

    resendOtp(
      { email },
      {
        onSuccess: (res) => {
          start();
          toast.success(res.message || `Reset OTP resent to ${email}`);
        },
        onError: (err) => {
          toast.error(getErrorMessage(err, "Failed to resend OTP"));
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Verify Reset OTP</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">
            {email || "your email"}
          </span>
          .
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
          className="space-y-5"
        >
          <form.Field name="otp">
            {(field) => {
              const rawError = field.state.meta.errors[0];
              const errors = rawError
                ? [
                    {
                      message: String(
                        (rawError as { message?: string })?.message ?? rawError,
                      ),
                    },
                  ]
                : undefined;

              return (
                <Field
                  data-invalid={Boolean(errors)}
                  className="items-center text-center"
                >
                  <FieldLabel htmlFor="reset-otp-input" className="justify-center">
                    6-Digit Verification Code
                  </FieldLabel>
                  <div className="flex justify-center">
                    <InputOTP
                      id="reset-otp-input"
                      maxLength={6}
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      disabled={isPending}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {errors && <FieldError errors={errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isPending}
            loadingText="Verifying..."
          >
            Verify OTP
          </Button>

          <div className="flex items-center justify-between text-xs">
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Change Email
            </Link>

            <button
              type="button"
              disabled={isRunning || isResending}
              onClick={handleResend}
              className="cursor-pointer font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isResending
                ? "Sending..."
                : isRunning
                  ? `Resend in ${secondsLeft}`
                  : "Resend OTP"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
