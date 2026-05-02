"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useVerifyPasswordOtp, useResetPassword } from "../hooks/useAuth";
import { UiField, UiFieldError, DEFAULT_PASSWORD_RULES } from "@/components/ui/field";
import { UiButton } from "@/components/ui/button/UiButton";
import { UiPinInput } from "@/components/ui/pin-input/UiPinInput";
import { useToast } from "@/components/ui/toast";

import { Mail, Lock, ArrowBack, CheckCircle } from "@mui/icons-material";
import { resetPasswordSchema, ResetPasswordCredentials } from "../schemas/resetPasswordSchema";

interface ResetPasswordFormProps {
  email: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

type PasswordResetStep = "verify" | "reset" | "success";

export function ResetPasswordForm({ email, onBack, onSuccess }: ResetPasswordFormProps) {
  const [step, setStep] = useState<PasswordResetStep>("verify");
  const [otp, setOtp] = useState("");
  
  const verifyOtpMutation = useVerifyPasswordOtp();
  const resetPasswordMutation = useResetPassword();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<ResetPasswordCredentials>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email },
    mode: "onChange",
  });

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      addToast({ type: "error", message: "Please enter the 6-digit OTP" });
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ email, otp });
      setStep("reset");
    } catch (error: any) {
      const message = error.message || "Invalid OTP";
      addToast({ type: "error", message });
    }
  };

  const onSubmit = async (data: ResetPasswordCredentials) => {
    try {
      await resetPasswordMutation.mutateAsync({
        ...data,
        otp,
      });
      setStep("success");
      addToast({
        type: "success",
        message: "Password reset successfully!",
      });
      onSuccess?.();
    } catch (error: any) {
      const message = error.message || "Failed to reset password";
      addToast({ type: "error", message });
    }
  };

  // Success Step
  if (step === "success") {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle sx={{ fontSize: 64, color: "success.main" }} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Password Reset!</h2>
        <p className="text-sm text-gray-600">
          Your password has been reset successfully. You can now login with your new password.
        </p>
        <UiButton fullWidth onClick={onSuccess}>
          Go to Login
        </UiButton>
      </div>
    );
  }

  // Reset Password Step
  if (step === "reset") {
    return (
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Password</h2>
          <p className="text-sm text-gray-600 mt-1">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="New Password"
                placeholder="••••••••"
                type="password"
                disabled={resetPasswordMutation.isPending}
                showPasswordToggle
                validationRules={DEFAULT_PASSWORD_RULES}
                error={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
                startIcon={<Lock sx={{ color: "text.secondary", fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="newPasswordConfirmation"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                disabled={resetPasswordMutation.isPending}
                showPasswordToggle
                error={!!errors.newPasswordConfirmation}
                errorMessage={errors.newPasswordConfirmation?.message}
                startIcon={<Lock sx={{ color: "text.secondary", fontSize: 20 }} />}
              />
            )}
          />

          {errors.root && (
            <UiFieldError>{errors.root.message}</UiFieldError>
          )}

          <UiButton
            type="submit"
            disabled={resetPasswordMutation.isPending || !isValid}
            fullWidth
          >
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
          </UiButton>
        </form>

        <div className="text-center">
          <button
            onClick={() => setStep("verify")}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            <ArrowBack sx={{ fontSize: 18 }} />
            Back to OTP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter the 6-digit code sent to
        </p>
        <p className="text-sm font-medium text-gray-900">{email}</p>
      </div>

      <div className="space-y-4">
        <UiPinInput
          length={6}
          value={otp}
          onChange={setOtp}
          disabled={verifyOtpMutation.isPending}
          error={!!errors.otp}
        />

        <UiButton
          onClick={handleVerifyOtp}
          disabled={verifyOtpMutation.isPending || otp.length !== 6}
          fullWidth
        >
          {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
        </UiButton>
      </div>

      <div className="flex justify-between text-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
        >
          <ArrowBack sx={{ fontSize: 18 }} />
          Change Email
        </button>
      </div>
    </div>
  );
}
