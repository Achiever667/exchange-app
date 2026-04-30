"use client";

import { Box } from "@mui/material";
import { CheckCircle, HighlightOff } from "@mui/icons-material";

type PasswordRule = {
  label: string;
  test: (value: string) => boolean;
};

export type PasswordValidationRules = PasswordRule[];

// Default password validation rules
export const DEFAULT_PASSWORD_RULES: PasswordValidationRules = [
  { label: "Minimum 8 characters", test: (v: string) => v.length >= 8 },
  { label: "At least one number", test: (v: string) => /\d/.test(v) },
  { label: "At least one special character", test: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v) },
  { label: "At least one uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "At least one lowercase letter", test: (v: string) => /[a-z]/.test(v) },
];

type PasswordMeterProps = {
  value: string;
  rules?: PasswordValidationRules;
  compact?: boolean;
  className?: string;
};

export function PasswordMeter({
  value,
  rules = DEFAULT_PASSWORD_RULES,
  compact = false,
  className = "",
}: PasswordMeterProps) {
  if (!value) return null;

  const validRules = rules.filter((rule) => rule.test(value));
  const invalidRules = rules.filter((rule) => !rule.test(value));

  if (compact) {
    return (
      <Box
        className={className}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: "0.75rem",
          color: validRules.length === rules.length ? "success.main" : "text.secondary",
        }}
      >
        <span>
          {validRules.length}/{rules.length} rules met
        </span>
      </Box>
    );
  }

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        mt: 1,
      }}
    >
      {rules.map((rule, i) => {
        const isValid = rule.test(value);
        return (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "0.75rem",
              fontWeight: 500,
              color: isValid ? "success.main" : "text.disabled",
              transition: "color 0.2s ease",
            }}
          >
            {isValid ? (
              <CheckCircle sx={{ fontSize: 16 }} />
            ) : (
              <HighlightOff sx={{ fontSize: 16 }} />
            )}
            {rule.label}
          </Box>
        );
      })}
    </Box>
  );
}

export function getPasswordStrength(
  value: string,
  rules: PasswordValidationRules = DEFAULT_PASSWORD_RULES
): number {
  if (!value) return 0;
  return rules.filter((rule) => rule.test(value)).length;
}

export function isPasswordValid(
  value: string,
  rules: PasswordValidationRules = DEFAULT_PASSWORD_RULES
): boolean {
  if (!value) return false;
  return rules.every((rule) => rule.test(value));
}
