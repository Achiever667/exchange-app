"use client";

import { Alert, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Toast } from "./types";
import { useToast } from "./useToast";

interface ToastItemProps {
  toast: Toast;
}

const severityMap: Record<Toast["type"], typeof Alert.prototype.severity> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

export function ToastItem({ toast }: ToastItemProps) {
  const { removeToast } = useToast();

  return (
    <Alert
      severity={severityMap[toast.type]}
      variant="filled"
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
      action={
        <IconButton
          size="small"
          onClick={() => removeToast(toast.id)}
          sx={{
            color: "inherit",
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      }
    >
      {toast.message}
    </Alert>
  );
}
