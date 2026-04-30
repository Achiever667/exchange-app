import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegistrationForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Start your journey with us"
    >
      <RegistrationForm />
    </AuthLayout>
  );
}