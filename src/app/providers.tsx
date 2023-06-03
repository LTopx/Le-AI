"use client";

import type * as React from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </SessionProvider>
  );
}
