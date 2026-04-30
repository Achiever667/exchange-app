"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useLogin } from "../hooks/useAuth";
import { UiField, UiFieldError, DEFAULT_PASSWORD_RULES } from "@/components/ui/field";
import { UiButton } from "@/components/ui/button/UiButton";
import { useToast } from "@/components/ui/toast";

import { Mail, Lock } from "@mui/icons-material";
import { loginSchema, LoginCredentials } from "../schemas/loginSchema";

interface LoginFormProps {
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function LoginForm({
  onSuccess,
  isLoading: externalLoading,
}: LoginFormProps) {
  const loginMutation = useLogin();
  const { addToast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const isLoading = externalLoading ?? loginMutation.isPending;

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await loginMutation.mutateAsync(data);
      addToast({ type: "success", message: "Login successful!" });
      onSuccess?.();
    } catch (error: any) {
      const message = error.message || "Login failed";
      addToast({ type: "error", message });
      setError("root", {
        message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <UiField
            {...field}
            label="Email"
            placeholder="you@example.com"
            type="email"
            disabled={isLoading}
            error={!!errors.email}
            errorMessage={errors.email?.message}
            startIcon={<Mail sx={{ color: "text.secondary", fontSize: 20 }} />}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <UiField
            {...field}
            label="Password"
            placeholder="••••••••"
            type="password"
            disabled={isLoading}
            showPasswordToggle
            validationRules={DEFAULT_PASSWORD_RULES}
            error={!!errors.password}
            errorMessage={errors.password?.message}
            startIcon={<Lock sx={{ color: "text.secondary", fontSize: 20 }} />}
          />
        )}
      />

      {errors.root && (
        <UiFieldError className="justify-center">{errors.root.message}</UiFieldError>
      )}

      <UiButton type="submit" disabled={isLoading || !isValid} fullWidth>
        {isLoading ? "Logging in..." : "Login"}
      </UiButton>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
}
