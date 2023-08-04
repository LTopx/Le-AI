import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "L-GPT",
  description:
    "L-GPT is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "any",
      },
      {
        url: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        url: "/android-icon-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    apple: [
      {
        sizes: "152x152",
        url: "/apple-icon-152x152.png",
      },
      {
        sizes: "180x180",
        url: "/apple-icon-180x180.png",
      },
    ],
  },
  viewport: {
    height: "device-height",
    width: "device-width",
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: { capable: true, title: "L-GPT" },
  openGraph: {
    title: "L-GPT | An AI Assitant Hub",
    description:
      "L-GPT is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
    url: "https://chat.ltopx.com",
    siteName: "L-GPT",
    locale: "zh_CN",
    type: "website",
    images: {
      url: "https://chat.ltopx.com/opengraph-image.png?v=1",
      width: 1200,
      height: 675,
      alt: "L-GPT",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "L-GPT | An AI Assitant Hub",
    description:
      "L-GPT is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
    site: "@peekbomb",
    creator: "@peekbomb",
    images: {
      url: "https://chat.ltopx.com/twitter-image.png?v=1",
      width: 1200,
      height: 675,
      alt: "L-GPT",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
