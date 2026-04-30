"use client";

import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type UiFieldGroupProps = {
  children: ReactNode;
  /**
   * Title for the field group
   */
  title?: string;
  /**
   * Optional description for the field group
   */
  description?: string;
  /**
   * If true, the group is disabled
   */
  disabled?: boolean;
  /**
   * Custom className for additional styling
   */
  className?: string;
};

export function UiFieldGroup({
  children,
  title,
  description,
  disabled = false,
  className = "",
}: UiFieldGroupProps) {
  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: disabled ? "text.disabled" : "text.primary",
          }}
        >
          {title}
        </Typography>
      )}
      
      {description && (
        <Typography
          variant="body2"
          sx={{
            color: disabled ? "text.disabled" : "text.secondary",
          }}
        >
          {description}
        </Typography>
      )}
      
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
