"use client";

import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { debounce } from "@/lib/utils";

interface Option {
  label: string;
  value: string | number;
}

interface UiSelectProps {
  options: Option[];
  value: any;
  onChange: (value: any) => void;
  onSearch?: (query: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  size?: "small" | "medium";
  loading?: boolean;
  labelVariant?: "block" | "inline";
}

export function UiSelect({
  options,
  value,
  onChange,
  onSearch,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  size = "small",
  loading = false,
  labelVariant = "block",
}: UiSelectProps) {
  
  // Find the selected option object based on the value passed
  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Handle Search with Debounce
  const debouncedSearch = useMemo(
    () => (onSearch ? debounce((query: string) => onSearch(query), 500) : null),
    [onSearch]
  );

  const handleInputChange = (event: any, newInputValue: string) => {
    if (debouncedSearch) {
      debouncedSearch(newInputValue);
    }
  };

  return (
    <Box className="w-full">
      {/* External Label Logic */}
      {label && labelVariant === "block" && (
        <label className="block text-sm font-medium mb-1.5 text-gray-700">
          {label}
        </label>
      )}

      <Autocomplete
        options={options}
        disabled={disabled}
        loading={loading}
        value={selectedOption}
        onChange={(_, newValue) => onChange(newValue?.value ?? "")}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            helperText={helperText}
            placeholder={placeholder}
            label={labelVariant === "inline" ? label : undefined}
            size={size}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // Matching your design language
                backgroundColor: disabled ? "#f8fafc" : "transparent",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#cbd5e1" },
              },
            }}
            slotProps={{
              input: {
                ...params.inputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.inputProps?.endAdornment}
                  </React.Fragment>
                ),
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.value}>
            <Typography variant="body2">{option.label}</Typography>
          </Box>
        )}
      />
    </Box>
  );
}