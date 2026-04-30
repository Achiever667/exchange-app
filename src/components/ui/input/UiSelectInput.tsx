"use client";

import * as React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

import { debounce } from "@/lib/utils";

type Option = {
  label: string;
  value: string | number;
};

type UiSelectProps = {
  label?: string;
  value: string | number;
  options: Option[];

  onChange: (value: string | number) => void;

  disabled?: boolean;
  error?: boolean;

  size?: "sm" | "md" | "lg";

  searchable?: boolean;
  onSearch?: (query: string) => Promise<Option[]> | void;
};

export function UiSelect({
  label,
  value,
  options,
  onChange,
  disabled,
  error,
  size = "md",
  searchable = false,
  onSearch,
}: UiSelectProps) {
  const [search, setSearch] = React.useState("");
  const [filteredOptions, setFilteredOptions] = React.useState(options);

  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (!onSearch) {
          setFilteredOptions(
            options.filter((opt) =>
              opt.label.toLowerCase().includes(query.toLowerCase())
            )
          );
          return;
        }

        const result = await onSearch(query);
        if (result) setFilteredOptions(result);
      }, 300),
    [options, onSearch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    debouncedSearch(query);
  };

  const handleChange = (event: any) => {
    onChange(event.target.value as string | number);
  };

  const sizeMap = {
    sm: 36,
    md: 44,
    lg: 52,
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl
        fullWidth
        error={error}
        disabled={disabled}
        size={size === "sm" ? "small" : "medium"}
      >
        {label && <InputLabel>{label}</InputLabel>}

        <Select
          value={value}
          onChange={handleChange}
          label={label}
          sx={{
            borderRadius: 2,
            height: sizeMap[size],
          }}
          MenuProps={{
            sx: {
              "& .MuiPaper-root": {
                borderRadius: 2,
                padding: searchable ? 1 : 0,
              },
            },
          }}
        >
          {searchable && (
            <Box component="div" sx={{ px: 1, pb: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                autoFocus
              />
            </Box>
          )}

          {filteredOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}