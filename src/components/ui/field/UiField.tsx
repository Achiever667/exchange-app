"use client";

import { ReactNode, ChangeEvent } from "react";
import { Box, TextField, TextFieldProps } from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  CheckCircle,
  HighlightOff 
} from "@mui/icons-material";
import { useState } from "react";

import { UiFieldError } from "./UiFieldError";

type PasswordRule = {
  label: string;
  test: (value: string) => boolean;
};

type Size = "sm" | "md" | "lg";

type UiFieldProps = {
  /**
   * Label for the field
   */
  label?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message to display
   */
  errorMessage?: string;
  /**
   * Helper text to display below the field
   */
  helperText?: string;
  /**
   * If disabled, the field is not interactive
   */
  disabled?: boolean;
  /**
   * Size of the field
   */
  size?: Size;
  /**
   * Field type (text, password, email, etc.)
   */
  type?: string;
  /**
   * Show password toggle icon
   */
  showPasswordToggle?: boolean;
  /**
   * Validation rules for password
   */
  validationRules?: PasswordRule[];
  /**
   * Start icon
   */
  startIcon?: ReactNode;
  /**
   * End icon
   */
  endIcon?: ReactNode;
  /**
   * Value of the field
   */
  value?: string;
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Change handler
   */
  onChange?: (value: string) => void;
  /**
   * Blur handler
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Additional TextField props
   */
  textFieldProps?: Partial<TextFieldProps>;
  /**
   * Custom className
   */
  className?: string;
};

// Size map matching UiSelectInput sizes
const sizeMap: Record<Size, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

export function UiField({
  label,
  placeholder,
  error = false,
  errorMessage,
  helperText,
  disabled = false,
  size = "md",
  type = "text",
  showPasswordToggle = false,
  validationRules = [],
  startIcon,
  endIcon,
  value: controlledValue,
  defaultValue,
  onChange,
  onBlur,
  textFieldProps,
  className = "",
}: UiFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [isDirty, setIsDirty] = useState(false);

  // Controlled vs uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const isPassword = type === "password";
  const inputType = isPassword && showPasswordToggle 
    ? (showPassword ? "text" : "password") 
    : type;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
      setIsDirty(true);
    }
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsDirty(true);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {/* Label */}
      {label && (
        <Box
          component="label"
          sx={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            mb: 1,
            color: error ? "error.main" : "text.primary",
          }}
        >
          {label}
        </Box>
      )}

      {/* Input Field */}
      <TextField
        {...textFieldProps}
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error}
        disabled={disabled}
        type={inputType}
        size={size === "sm" ? "small" : "medium"}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            height: sizeMap[size],
            "& fieldset": { 
              borderColor: error ? "error.main" : "#e2e8f0",
              borderWidth: error ? 2 : 1,
            },
            "&:hover fieldset": {
              borderColor: error ? "error.dark" : "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderColor: error ? "error.main" : "primary.main",
            },
          },
          "& .MuiInputBase-input": {
            padding: size === "sm" 
              ? "8px 12px" 
              : size === "lg" 
                ? "14px 16px"
                : "12px 14px",
          },
          ...textFieldProps?.sx,
        }}
        slotProps={{
          input: {
            startAdornment: startIcon && (
              <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
                {startIcon}
              </Box>
            ),
            endAdornment: (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {endIcon}
                {isPassword && showPasswordToggle && (
                  <Box
                    component="button"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      p: 0.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Box>
                )}
              </Box>
            ),
          },
        }}
      />

      {/* Error Message */}
      {error && errorMessage && (
        <UiFieldError>{errorMessage}</UiFieldError>
      )}

      {/* Helper Text (non-error) */}
      {!error && helperText && (
        <Box
          sx={{
            mt: 0.5,
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          {helperText}
        </Box>
      )}

      {isPassword && isDirty && validationRules.length > 0 && (
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {validationRules.map((rule, i) => {
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
                  color: isValid ? "success.main" : "error.main",
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
      )}
    </Box>
  );
}
