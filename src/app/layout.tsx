import React from "react";
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Le-AI",
  description:
    "Le-AI is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
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
  appleWebApp: { capable: true, title: "Le-AI" },
  openGraph: {
    title: "Le-AI | An AI Assitant Hub",
    description:
      "Le-AI is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
    url: "https://le-ai.app",
    siteName: "Le-AI",
    locale: "en_US",
    type: "website",
    images: {
      url: "https://le-ai.app/opengraph-image.png?v=2",
      width: 1200,
      height: 675,
      alt: "Le-AI",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Le-AI | An AI Assitant Hub",
    description:
      "Le-AI is an open-source project that helps you improve your learning, work, and life efficiency by providing various AI models.",
    site: "@peekbomb",
    creator: "@peekbomb",
    images: {
      url: "https://le-ai.app/twitter-image.png?v=2",
      width: 1200,
      height: 675,
      alt: "Le-AI",
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
