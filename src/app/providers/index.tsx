'use client'

import { useEffect } from 'react'
import { ThemeProvider } from 'next-themes'

import { useChatStore } from '@/store/chat'

export default function Providers({ children }: { children: React.ReactNode }) {
  const hasHydrated = useChatStore((state) => state._hasHydrated)

  if (!hasHydrated) return null

  // const [locale, setLocale] = useState<string>("en");

  // useEffect(() => {
  //   const locale = localStorage.getItem("lang") || "en";
  //   setLocale(locale);
  // }, []);

  return (
    // <NextIntlClientProvider locale={locale} timeZone="Asia/Shanghai">
    <ThemeProvider attribute="class">{children}</ThemeProvider>
    // </NextIntlClientProvider>
  )
}
