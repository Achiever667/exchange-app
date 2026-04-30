"use client";

import { useState, ChangeEvent } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box,
  TextFieldProps,
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  CheckCircle,
  HighlightOff 
} from "@mui/icons-material";

// Define the shape of our rules
type PasswordRule = {
  label: string;
  test: (value: string) => boolean;
};

type UiInputProps = {
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  labelVariant?: "block" | "inline";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  type?: string;
  showPasswordToggle?: boolean;
  // We change passwordRules to an array of objects for logic testing
  validationRules?: PasswordRule[];
} & Omit<TextFieldProps, "slotProps">;

export function Input({
  label,
  error,
  helperText,
  disabled,
  labelVariant = "block",
  startIcon,
  endIcon,
  type = "text",
  showPasswordToggle = false,
  validationRules = [],
  onChange,
  ...props
}: UiInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPasswordToggle 
    ? (showPassword ? "text" : "password") 
    : type;

  const handleInternalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setIsDirty(true);
    if (onChange) onChange(e);
  };

  return (
    <Box className="w-full">
      {label && labelVariant === "block" && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          {label}
        </label>
      )}

      <TextField
        {...props}
        fullWidth
        value={value}
        onChange={handleInternalChange}
        label={labelVariant === "inline" ? label : undefined}
        error={error}
        disabled={disabled}
        type={inputType}
        // Custom styling for rounded borders
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px", // Adjust for desired "roundness"
            "& fieldset": { borderColor: "#e2e8f0" },
          },
          ...props.sx,
        }}
        slotProps={{
          input: {
            startAdornment: startIcon && (
              <InputAdornment position="start">{startIcon}</InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {endIcon}
                {isPassword && showPasswordToggle && (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          },
        }}
      />

      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}

      {/* Password Validation List */}
      {isPassword && isDirty && validationRules.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {validationRules.map((rule, i) => {
            const isValid = rule.test(value);
            return (
              <li 
                key={i} 
                className={`flex items-center text-xs font-medium transition-colors duration-200 ${
                  isValid ? "text-green-600" : "text-red-500"
                }`}
              >
                <span className="mr-2 flex items-center">
                  {isValid ? (
                    <CheckCircle sx={{ fontSize: 16 }} />
                  ) : (
                    <HighlightOff sx={{ fontSize: 16 }} />
                  )}
                </span>
                {rule.label}
              </li>
            );
          })}
        </ul>
      )}
    </Box>
  );
}