"use client";

import { Toast } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      <Toast.Provider placement="top end" width="min(92vw, 420px)" maxVisibleToasts={2} />
    </ThemeProvider>
  );
}
