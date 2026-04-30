"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

export function MuiProvider({ children }: { children: ReactNode }) {
  return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
}