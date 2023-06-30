import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
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

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <Script src="/disableSafariScalable.js" />
      <body>
        <Providers>{children}</Providers>
        <Toaster toastOptions={{ style: { maxWidth: "calc(100vw - 2rem)" } }} />
        <Analytics debug={false} />
      </body>
    </html>
  );
}
