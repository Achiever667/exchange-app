"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

type ForgotPasswordStep = "request" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>("request");
  const [email, setEmail] = useState("");

  const handleRequestSuccess = (enteredEmail: string) => {
    setEmail(enteredEmail);
    setStep("reset");
  };

  const handleResetSuccess = () => {
    router.push("/auth/login");
  };

  const handleBack = () => {
    setStep("request");
  };

  return (
    <AuthLayout
      title={step === "request" ? "Reset Password" : "Verify Your Email"}
      subtitle={
        step === "request"
          ? "Enter your email to receive a verification code"
          : "Enter the code sent to your email"
      }
    >
      {step === "request" ? (
        <ForgotPasswordForm onSuccess={handleRequestSuccess} />
      ) : (
        <ResetPasswordForm
          email={email}
          onBack={handleBack}
          onSuccess={handleResetSuccess}
        />
      )}
    </AuthLayout>
  );
}
