"use client";

import { useState, FormEvent } from "react";
import { useRegister } from "../hooks/useAuth";
import { RegisterPayload } from "@/types";
import { UiField, UiFieldError, UiFieldGroup, DEFAULT_PASSWORD_RULES } from "@/components/ui/field";

import { 
  Mail, 
  Lock, 
  Person, 
  Phone, 
  Visibility, 
  VisibilityOff 
} from "@mui/icons-material";

interface RegistrationFormProps {
  onSuccess?: () => void;
  onVerificationRequired?: (email: string) => void;
  isLoading?: boolean;
}

export function RegistrationForm({
  onSuccess,
  onVerificationRequired,
  isLoading: externalLoading,
}: RegistrationFormProps) {
  const [formData, setFormData] = useState<RegisterPayload>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

const registerMutation = useRegister();
  const isLoading = externalLoading ?? registerMutation.isPending;

  type FieldName = keyof typeof formData | "confirmPassword";

  const handleChange = (name: FieldName, value: string) => {
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      general: undefined,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors: typeof errors = {};

    // Validate required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
// Validate password rules
      const allRulesMet = DEFAULT_PASSWORD_RULES.every(rule => rule.test(formData.password));
      if (!allRulesMet) {
        newErrors.password = "Please meet all password requirements";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerMutation.mutateAsync(formData);
      // If registration succeeds but requires OTP verification
      onVerificationRequired?.(formData.email);
      onSuccess?.();
    } catch (error: any) {
      setErrors({ general: error.message || "Registration failed" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <UiFieldGroup title="Personal Information" description="Please fill in your details">
        <UiField
          label="First Name"
          placeholder="John"
          value={formData.firstName}
          onChange={(value) => handleChange("firstName", value)}
          disabled={isLoading}
          error={!!errors.firstName}
          errorMessage={errors.firstName}
          startIcon={<Person sx={{ color: "text.secondary", fontSize: 20 }} />}
        />

        <UiField
          label="Last Name"
          placeholder="Doe"
          value={formData.lastName}
          onChange={(value) => handleChange("lastName", value)}
          disabled={isLoading}
          error={!!errors.lastName}
          errorMessage={errors.lastName}
          startIcon={<Person sx={{ color: "text.secondary", fontSize: 20 }} />}
        />
      </UiFieldGroup>

      <UiFieldGroup title="Contact Information" description="How can we reach you?">
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
          label="Phone Number"
          placeholder="+1234567890"
          type="tel"
          value={formData.phoneNumber}
          onChange={(value) => handleChange("phoneNumber", value)}
          disabled={isLoading}
          error={!!errors.phoneNumber}
          errorMessage={errors.phoneNumber}
          startIcon={<Phone sx={{ color: "text.secondary", fontSize: 20 }} />}
        />
      </UiFieldGroup>

      <UiFieldGroup title="Security" description="Create a strong password">
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

        <UiField
          label="Confirm Password"
          placeholder="••••••••"
          type="password"
          value={confirmPassword}
          onChange={(value) => handleChange("confirmPassword", value)}
          disabled={isLoading}
          showPasswordToggle
          error={!!errors.confirmPassword}
          errorMessage={errors.confirmPassword}
          startIcon={<Lock sx={{ color: "text.secondary", fontSize: 20 }} />}
        />
      </UiFieldGroup>

      {errors.general && (
        <UiFieldError className="justify-center">{errors.general}</UiFieldError>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
      >
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
