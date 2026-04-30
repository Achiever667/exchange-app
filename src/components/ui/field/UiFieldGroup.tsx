"use client";

import { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

type UiFieldGroupProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  disabled?: boolean;
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
