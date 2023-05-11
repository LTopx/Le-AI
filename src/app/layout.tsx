import { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import "@/styles/globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "L-GPT",
  description:
    "L-GPT is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
  icons: "/logo.svg",
  viewport:
    "height=device-height ,width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: { capable: true, title: "L-GPT" },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="/disableSafariScalable.js" async />
      <Script src="/polyfill.js" async />
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
        <Analytics debug={false} />
      </body>
    </html>
  );
}
