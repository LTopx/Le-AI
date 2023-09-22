import React from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { notFound } from "next/navigation";
import Providers from "../providers";
import Announcement from "@/components/announcement";

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "zh-CN" },
    { locale: "zh-HK" },
    // { locale: "ja" },
  ];
}

const inter = Inter({ subsets: ["latin"] });

async function getMessages(locale: string) {
  try {
    return (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className={inter.className} suppressHydrationWarning>
      <Script src="/disableSafariScalable.js" />
      {!!(
        process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL &&
        process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
      ) && (
        <script
          async
          src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
          data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        ></script>
      )}
      <body>
        <Providers locale={locale} messages={messages}>
          <Announcement />
          {children}
        </Providers>
        <Toaster toastOptions={{ style: { maxWidth: "calc(100vw - 2rem)" } }} />
      </body>
    </html>
  );
}
