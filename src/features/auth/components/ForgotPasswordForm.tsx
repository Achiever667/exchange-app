"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRequestPasswordOtp } from "../hooks/useAuth";
import { UiField, UiFieldError } from "@/components/ui/field";
import { UiButton } from "@/components/ui/button/UiButton";
import { useToast } from "@/components/ui/toast";
import { STORAGE_KEYS, OTP_TYPES } from "@/constants";

import { Mail, ArrowBack } from "@mui/icons-material";
import { forgotPasswordSchema, ForgotPasswordCredentials } from "../schemas/forgotPasswordSchema";

interface ForgotPasswordFormProps {
  onSuccess?: (email: string) => void;
}

export function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const requestOtpMutation = useRequestPasswordOtp();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordCredentials>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

const onSubmit = async (data: ForgotPasswordCredentials) => {
    try {
      await requestOtpMutation.mutateAsync(data);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.OTP_TYPE, OTP_TYPES.PASSWORD_RESET);
        localStorage.setItem(STORAGE_KEYS.OTP_EMAIL, data.email);
      }
      
      addToast({
        type: "success",
        message: "OTP sent to your email. Please check your inbox.",
      });
      onSuccess?.(data.email);
    } catch (error: any) {
      const message = error.message || "Failed to send OTP";
      addToast({ type: "error", message });
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <UiField
              {...field}
              label="Email Address"
              placeholder="you@example.com"
              type="email"
              disabled={requestOtpMutation.isPending}
              error={!!errors.email}
              errorMessage={errors.email?.message}
              startIcon={<Mail sx={{ color: "text.secondary", fontSize: 20 }} />}
            />
          )}
        />

        {errors.root && (
          <UiFieldError>{errors.root.message}</UiFieldError>
        )}

        <UiButton
          type="submit"
          disabled={requestOtpMutation.isPending || !isValid}
          fullWidth
        >
          {requestOtpMutation.isPending ? "Sending..." : "Send Verification Code"}
        </UiButton>
      </form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowBack sx={{ fontSize: 18 }} />
          Back to Login
        </Link>
      </div>
    </div>
  );
}
