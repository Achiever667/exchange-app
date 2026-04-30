"use client";

import { OtpVerificationForm } from "@/features/auth/components/OtpVerificationForm";
import { AuthLayout } from "@/components/layout/AuthLayout";

export default function VerifyPage() {
  return (
    <AuthLayout
      title="Verify Your Account"
      subtitle="Enter the 6-digit code sent to your email"
    >
      <OtpVerificationForm />
    </AuthLayout>
  );
}