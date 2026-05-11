"use client";

import * as React from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ListSubheader,
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

  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);

  React.useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  const debouncedSearch = React.useMemo(
    () =>
      debounce(async (query: string) => {
        if (!onSearch) {
          setFilteredOptions(
            options.filter((opt) =>
              opt.label
                .toLowerCase()
                .includes(query.toLowerCase())
            )
          );

          return;
        }

        const result = await onSearch(query);

        if (result) {
          setFilteredOptions(result);
        }
      }, 300),
    [options, onSearch]
  );

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;

    setSearch(query);

    debouncedSearch(query);
  };

  const handleChange = (event: any) => {
    onChange(event.target.value);
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

    '& .MuiSelect-select': {
      padding:
        size === 'sm'
          ? '8px 4px'
          : size === 'lg'
            ? '14px 16px'
            : '12px 14px',
      display: 'flex',
      alignItems: 'center',
    },

    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'error.main' : '#e2e8f0',
      borderWidth: error ? 2 : 1,
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'error.dark' : 'primary.main',
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: error ? 'error.main' : 'primary.main',
    },
  }}
  MenuProps={{
  autoFocus: false,
  slotProps: {
    paper: {
      sx: {
        borderRadius: 2,
        mt: 1,
      },
    },
  },
}}
>
          {searchable && (
            <ListSubheader>
              <TextField
                size="small"
                autoFocus
                fullWidth
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                onKeyDown={(e) => {
                  e.stopPropagation();
                }}
              />
            </ListSubheader>
          )}

          <MenuItem value="" disabled>
            {searchable ? "Select country" : "Select"}
          </MenuItem>

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