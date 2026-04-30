"use client";

import { Card, CardContent, CardHeader, CardActions } from "@mui/material";
import clsx from "clsx";

type UiCardProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "elevated" | "outlined" | "flat";
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
};

export function UiCard({
  title,
  subtitle,
  children,
  footer,
  variant = "elevated",
  clickable = false,
  onClick,
  className,
}: UiCardProps) {
  return (
    <Card
      onClick={onClick}
      elevation={variant === "elevated" ? 3 : 0}
      variant={variant === "outlined" ? "outlined" : undefined}
      className={clsx(
        "rounded-2xl transition-all duration-200",
        clickable && "cursor-pointer hover:shadow-lg",
        variant === "flat" && "bg-gray-50 shadow-none",
        className
      )}
    >
      {/* Header */}
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          sx={{
            pb: 0,
            "& .MuiCardHeader-title": {
              fontWeight: 600,
              fontSize: "1rem",
            },
          }}
        />
      )}

      <CardContent className="space-y-3">
        {children}
      </CardContent>

      {footer && (
        <CardActions className="px-4 pb-4 pt-0">
          {footer}
        </CardActions>
      )}
    </Card>
  );
}