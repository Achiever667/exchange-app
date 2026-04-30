"use client";

import { useState, FormEvent } from "react";
import { useLogin } from "../hooks/useAuth";
import { AuthCredentials } from "@/types";
import { Input as UiInput } from "@/components/ui/input/UiInput";

import { Mail, Lock } from "@mui/icons-material";
import { UiSelect } from "@/components/ui/input/UiSelectInput";

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

  const [localError, setLocalError] = useState<string | null>(null);

  const loginMutation = useLogin();
  const isLoading = externalLoading ?? loginMutation.isPending;

  const passwordRules = [
    { label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
    { label: "At least one number", test: (v: string) => /\d/.test(v) },
    { label: "At least one special character", test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
  ];

  const handleChange = (name: keyof AuthCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError(null);
  };

  const [age, setAge] = useState("");

const handleSearch = (query: string) => {
  console.log("Searching for:", query);
  // Fetch new options here
};

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // Basic validation check
    if (!formData.email || !formData.password) {
      setLocalError("Email and password are required");
      return;
    }

    // Optional: Check if all rules are met before submitting
    const allRulesMet = passwordRules.every(rule => rule.test(formData.password));
    if (!allRulesMet) {
      setLocalError("Please meet all password requirements");
      return;
    }

    try {
      await loginMutation.mutateAsync(formData);
      onSuccess?.();
    } catch (error: any) {
      setLocalError(error.message || "Login failed");
    }
  };

  const errorMessage = localError || loginMutation.error?.message;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      
      {/* ✅ Email */}
      <UiInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        disabled={isLoading}
        placeholder="you@example.com"
        startIcon={<Mail className="text-gray-400" />}
        error={!!errorMessage && !formData.email}
        helperText={!formData.email && errorMessage ? "Email is required" : ""}
      />

      <UiSelect
  label="Select Age"
  value={age}
onChange={(val) => setAge(String(val))}
  onSearch={handleSearch}
  options={[
    { label: "Ten", value: 10 },
    { label: "Twenty", value: 20 },
    { label: "Thirty", value: 30 },
  ]}

/>

      {/* ✅ Password with Dynamic Rules */}
      <UiInput
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        disabled={isLoading}
        placeholder="••••••••"
        startIcon={<Lock className="text-gray-400" />}
        showPasswordToggle
        validationRules={passwordRules} // Passing the rules here
        error={!!errorMessage && !formData.password}
        helperText={!formData.password && errorMessage ? "Password is required" : ""}
      />

      {/* ✅ Global error message box */}
      {errorMessage && (
        <div className="rounded-lg bg-red-50 p-3 border border-red-200">
          <p className="text-sm text-red-700 text-center font-medium">
            {errorMessage}
          </p>
        </div>
      )}

      {/* ✅ Submit Button */}
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