"use client";

import { ReactNode } from "react";
import { Box, Paper } from "@mui/material";

type AuthLayoutProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  return (
    <Box className="min-h-screen flex">
      
      <Box className="hidden md:flex flex-1 bg-blue-600 text-white items-center justify-center p-10">
        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold">
            Exchange App
          </h1>
          <p className="text-blue-100">
            Secure, fast, and reliable fintech platform.
          </p>
        </div>
      </Box>

      <Box className="flex flex-1 items-center justify-center p-6 bg-gray-50">
        <Paper
          elevation={3}
          className="w-full max-w-lg p-8 rounded-2xl space-y-6"
        >
          {(title || subtitle) && (
            <div className="space-y-1 text-center">
              {title && (
                <h2 className="text-2xl font-semibold">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-gray-500 text-sm">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </Paper>
      </Box>
    </Box>
  );
}