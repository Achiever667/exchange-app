"use client";

import { ReactNode } from "react";
import { Box, FormHelperText } from "@mui/material";
import { HighlightOff } from "@mui/icons-material";

type UiFieldErrorProps = {
  children: ReactNode;
  hidden?: boolean;
  className?: string;
  overlay?: boolean;
};

export function UiFieldError({
  children,
  hidden = false,
  className = "",
  overlay = false,
}: UiFieldErrorProps) {
  if (!children) return null;

  return (
    <Box
      className={`flex items-center gap-1 ${className}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        mt: overlay ? 0 : 0.5,
        position: overlay ? "absolute" : "relative",
        top: overlay ? "100%" : "auto",
        left: overlay ? 0 : "auto",
        zIndex: overlay ? 1 : "auto",
      }}
    >
      <HighlightOff sx={{ fontSize: 14, color: "error.main" }} />
      {!hidden && (
        <FormHelperText error sx={{ m: 0 }}>
          {children}
        </FormHelperText>
      )}
    </Box>
  );
}
