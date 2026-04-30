"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ReactNode } from "react";

export function MuiProvider({ children }: { children: ReactNode }) {
  return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
}