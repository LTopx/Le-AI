import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Announcement from "@/components/announcement";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  let messages;
  try {
    messages = (await import(`../../locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Announcement />
      {children}
    </NextIntlClientProvider>
  );
}
