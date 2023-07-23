import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "L-GPT",
  description:
    "L-GPT is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
  icons: "/logo.svg",
  viewport: {
    height: "device-height",
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: { capable: true, title: "L-GPT" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
