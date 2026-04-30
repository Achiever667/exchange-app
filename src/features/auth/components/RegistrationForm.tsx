"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRegister } from "../hooks/useAuth";
import {
  UiField,
  UiFieldError,
  UiFieldGroup,
  DEFAULT_PASSWORD_RULES,
} from "@/components/ui/field";
import { UiButton } from "@/components/ui/button/UiButton";

import { Mail, Lock, Person, Phone } from "@mui/icons-material";
import { registerSchema, RegisterCredentials } from "../schemas/registerSchema";

interface RegistrationFormProps {
  onSuccess?: () => void;
  onVerificationRequired?: (email: string) => void;
  isLoading?: boolean;
}

export function RegistrationForm({
  onSuccess,
  onVerificationRequired,
  isLoading: external_loading,
}: RegistrationFormProps) {
  const registerMutation = useRegister();
  
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const isLoading = external_loading || registerMutation.isPending;

  const onsubmit = async (data: RegisterCredentials) => {
    try {
      await registerMutation.mutateAsync(data);
      onVerificationRequired?.(data.email);
      onSuccess?.();
    } catch (error: any) {
      setError("root", { 
        message: error.message || "Registration failed" 
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="w-full max-w-2xl space-y-6">
      
      <UiFieldGroup
        title="Personal Information"
        description="Please fill in your details"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="First Name"
                placeholder="John"
                disabled={isLoading}
                error={!!errors.first_name}
                errorMessage={errors.first_name?.message}
                startIcon={<Person sx={{ fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Last Name"
                placeholder="Doe"
                disabled={isLoading}
                error={!!errors.last_name}
                errorMessage={errors.last_name?.message}
                startIcon={<Person sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>
      </UiFieldGroup>

      <UiFieldGroup>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                startIcon={<Mail sx={{ fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Phone Number"
                placeholder="+1234567890"
                type="tel"
                disabled={isLoading}
                error={!!errors.phone_number}
                errorMessage={errors.phone_number?.message}
                startIcon={<Phone sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>
      </UiFieldGroup>

      <UiFieldGroup>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
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
                startIcon={<Lock sx={{ fontSize: 20 }} />}
              />
            )}
          />

          <Controller
            name="confirm_password"
            control={control}
            render={({ field }) => (
              <UiField
                {...field}
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                disabled={isLoading}
                showPasswordToggle
                error={!!errors.confirm_password}
                errorMessage={errors.confirm_password?.message}
                startIcon={<Lock sx={{ fontSize: 20 }} />}
              />
            )}
          />
        </div>
      </UiFieldGroup>

      {errors.root && (
        <UiFieldError className="justify-center">
          {errors.root.message}
        </UiFieldError>
      )}

      <UiButton 
        type="submit" 
        disabled={isLoading || !isValid} 
        fullWidth
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </UiButton>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Login
        </Link>
      </p>
    </form>
  );
}