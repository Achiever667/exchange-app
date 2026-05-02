"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Redirect to forgot-password if no email provided
      router.push("/auth/forgot-password");
    }
  }, [searchParams, router]);

  const handleBack = () => {
    router.push("/auth/forgot-password");
  };

  const handleSuccess = () => {
    router.push("/auth/login");
  };

  if (!email) {
    return null; // Or a loading skeleton
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter the verification code sent to your email"
    >
      <ResetPasswordForm
        email={email}
        onBack={handleBack}
        onSuccess={handleSuccess}
      />
    </AuthLayout>
  );
}
