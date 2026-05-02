"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerifyPasswordOtp, useResetPassword } from "../hooks/useAuth";

import {
  UiField,
  UiFieldError,
  DEFAULT_PASSWORD_RULES,
} from "@/components/ui/field";
import { UiButton } from "@/components/ui/button/UiButton";
import { UiPinInput } from "@/components/ui/pin-input/UiPinInput";
import { useToast } from "@/components/ui/toast";

import { Lock, ArrowBack, CheckCircle } from "@mui/icons-material";

import {
  resetPasswordFormSchema,
  ResetPasswordFormValues,
} from "../schemas/resetPasswordSchema";

interface ResetPasswordFormProps {
  email: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

type Step = "verify" | "reset" | "success";

export function ResetPasswordForm({
  email,
  onBack,
  onSuccess,
}: ResetPasswordFormProps) {
  const [step, setStep] = useState<Step>("verify");
  const [otp, setOtp] = useState("");

  const verifyOtpMutation = useVerifyPasswordOtp();
  const resetPasswordMutation = useResetPassword();
  const { addToast } = useToast();

  // ✅ ONLY password fields here (NO OTP)
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      email,
      newPassword: "",
      newPasswordConfirmation: "",
    },
    mode: "onChange",
  });

  // 🔐 STEP 1: VERIFY OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      addToast({ type: "error", message: "Enter 6-digit OTP" });
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({ email, otp });
      setStep("reset");
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Invalid OTP",
      });
    }
  };

  // 🔐 STEP 2: RESET PASSWORD
  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPasswordMutation.mutateAsync({
        ...data,
        otp, // ✅ attach OTP manually
      });

      setStep("success");

      addToast({
        type: "success",
        message: "Password reset successful",
      });

      onSuccess?.();
    } catch (error: any) {
      addToast({
        type: "error",
        message: error.message || "Reset failed",
      });
    }
  };

  // ✅ SUCCESS SCREEN
  if (step === "success") {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <CheckCircle sx={{ fontSize: 64, color: "green" }} />
        <h2 className="text-2xl font-bold">Password Reset!</h2>
        <p className="text-sm text-gray-600">
          You can now login with your new password.
        </p>

        <UiButton fullWidth onClick={onSuccess}>
          Go to Login
        </UiButton>
      </div>
    );
  }

  // ✅ STEP 2 UI
  if (step === "reset") {
    return (
      <div className="w-full max-w-md space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="New Password"
                type="password"
                showPasswordToggle
                validationRules={DEFAULT_PASSWORD_RULES}
                error={!!errors.newPassword}
                errorMessage={errors.newPassword?.message}
                startIcon={<Lock />}
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
                type="password"
                showPasswordToggle
                error={!!errors.newPasswordConfirmation}
                errorMessage={errors.newPasswordConfirmation?.message}
                startIcon={<Lock />}
              />
            )}
          />

          <UiButton
            type="submit"
            disabled={!isValid || resetPasswordMutation.isPending}
            fullWidth
          >
            {resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
          </UiButton>
        </form>

        <button
          onClick={() => setStep("verify")}
          className="text-sm text-blue-600 flex items-center gap-1"
        >
          <ArrowBack /> Back to OTP
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold">Verify OTP</h2>
        <p className="text-sm text-gray-600">{email}</p>
      </div>

      <UiPinInput
        length={6}
        value={otp}
        onChange={setOtp}
        disabled={verifyOtpMutation.isPending}
      />

      <UiButton
        onClick={handleVerifyOtp}
        disabled={otp.length !== 6 || verifyOtpMutation.isPending}
        fullWidth
      >
        {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
      </UiButton>

      <button
        onClick={onBack}
        className="text-sm text-blue-600 flex items-center gap-1"
      >
        <ArrowBack /> Change Email
      </button>
    </div>
  );
}