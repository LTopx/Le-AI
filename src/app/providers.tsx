"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";

export default function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class">
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          timeZone="Asia/Shanghai"
        >
          {children}
        </NextIntlClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
