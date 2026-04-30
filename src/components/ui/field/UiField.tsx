'use client';

import { ReactNode, ChangeEvent, useState } from 'react';
import { Box, TextField, TextFieldProps, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { UiFieldError } from './UiFieldError';
import { PasswordMeter, type PasswordValidationRules } from '../password';

type PasswordRule = PasswordValidationRules[number];
type Size = 'sm' | 'md' | 'lg';

type UiFieldProps = {
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  size?: Size;
  type?: string;
  showPasswordToggle?: boolean;
  validationRules?: PasswordRule[];
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  textFieldProps?: Partial<TextFieldProps>;
  className?: string;
};

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
  size = 'md',
  type = 'text',
  showPasswordToggle = false,
  validationRules = [],
  startIcon,
  endIcon,
  value: controlledValue,
  defaultValue,
  onChange,
  onBlur,
  textFieldProps,
  className = '',
}: UiFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const [isDirty, setIsDirty] = useState(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const isPassword = type === 'password';
  const inputType =
    isPassword && showPasswordToggle
      ? showPassword
        ? 'text'
        : 'password'
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
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
      }}
    >
      {label && (
        <Box
          component="label"
          sx={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            mb: 1,
            color: error ? 'error.main' : 'text.primary',
          }}
        >
          {label}
        </Box>
      )}

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
        size={size === 'sm' ? 'small' : 'medium'}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            height: sizeMap[size],
            '& fieldset': {
              borderColor: error ? 'error.main' : '#e2e8f0',
              borderWidth: error ? 2 : 1,
            },
            '&:hover fieldset': {
              borderColor: error ? 'error.dark' : 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: error ? 'error.main' : 'primary.main',
            },
          },
          '& .MuiInputBase-input': {
            padding:
              size === 'sm'
                ? '8px 4px'
                : size === 'lg'
                  ? '14px 16px'
                  : '12px 14px',
          },
          ...textFieldProps?.sx,
        }}
        slotProps={{
          input: {
            startAdornment: startIcon && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                {startIcon}
              </Box>
            ),
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {endIcon}
                {isPassword && showPasswordToggle && (
                  <IconButton
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPassword(!showPassword);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    size="small"
                    edge="end"
                    sx={{ p: 0.5 }}
                  >
                    {showPassword ? (
                      <Visibility fontSize="small" />
                    ) : (
                      <VisibilityOff fontSize="small" />
                    )}
                  </IconButton>
                )}
              </Box>
            ),
          },
        }}
      />

      {error && errorMessage && (
        <UiFieldError overlay>{errorMessage}</UiFieldError>
      )}

      {!error && helperText && (
        <Box
          sx={{
            mt: 0.5,
            fontSize: '0.75rem',
            color: 'text.secondary',
          }}
        >
          {helperText}
        </Box>
      )}

      {isPassword && validationRules.length > 0 && value && (
        <PasswordMeter value={value} rules={validationRules} />
      )}
    </Box>
  );
}
