"use client";

import { ReactNode } from "react";
import { Box, FormHelperText } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";

type UiFieldErrorProps = {
  children: ReactNode;
  /**
   * If true, hides the error message but keeps the icon
   * Useful when you want to show only the error state without text
   */
  hidden?: boolean;
  /**
   * Custom className for additional styling
   */
  className?: string;
};

export function UiFieldError({
  children,
  hidden = false,
  className = "",
}: UiFieldErrorProps) {
  if (!children) return null;

  return (
    <Box
      className={`flex items-center gap-1 ${className}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        mt: 0.5,
      }}
    >
      <HighlightOff sx={{ fontSize: 16, color: "error.main" }} />
      {!hidden && (
        <FormHelperText error sx={{ m: 0 }}>
          {children}
        </FormHelperText>
      )}
    </Box>
  );
}
