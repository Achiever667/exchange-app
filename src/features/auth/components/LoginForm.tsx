"use client";

import { useState, FormEvent } from "react";
import { useLogin } from "../hooks/useAuth";
import { AuthCredentials } from "@/types";
import { UiField, UiFieldError, DEFAULT_PASSWORD_RULES } from "@/components/ui/field";

import { Mail, Lock } from "@mui/icons-material";

interface LoginFormProps {
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function LoginForm({
  onSuccess,
  isLoading: externalLoading,
}: LoginFormProps) {
  const [formData, setFormData] = useState<AuthCredentials>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const loginMutation = useLogin();
  const isLoading = externalLoading ?? loginMutation.isPending;

  const handleChange = (name: keyof AuthCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear individual field error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      general: undefined,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

// Validate password rules
    const allRulesMet = DEFAULT_PASSWORD_RULES.every(rule => rule.test(formData.password));
    if (!allRulesMet) {
      setErrors({ password: "Please meet all password requirements" });
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
      onSuccess?.();
    } catch (error: any) {
      setErrors({ general: error.message || "Login failed" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <UiField
        label="Email"
        placeholder="you@example.com"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        disabled={isLoading}
        error={!!errors.email}
        errorMessage={errors.email}
        startIcon={<Mail sx={{ color: "text.secondary", fontSize: 20 }} />}
      />

      <UiField
        label="Password"
        placeholder="••••••••"
        type="password"
        value={formData.password}
        onChange={(value) => handleChange("password", value)}
        disabled={isLoading}
        showPasswordToggle
validationRules={DEFAULT_PASSWORD_RULES}
        error={!!errors.password}
        errorMessage={errors.password}
        startIcon={<Lock sx={{ color: "text.secondary", fontSize: 20 }} />}
      />

      {errors.general && (
        <UiFieldError className="justify-center">{errors.general}</UiFieldError>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
