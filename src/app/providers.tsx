"use client";

import type * as React from "react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <AnimatePresence>{children}</AnimatePresence>
      </ThemeProvider>
    </SessionProvider>
  );
}
