"use client";

import type * as React from "react";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class">
      <AnimatePresence>{children}</AnimatePresence>
    </ThemeProvider>
  );
}
