import { GeistSans } from 'geist/font/sans'
import type { Metadata, Viewport } from 'next'

import { Toaster } from '@/components/ui/sonner'

import Providers from './providers'

import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Le-AI',
  description:
    'Le-AI is an open-source software that can serve as your personal AI assistant.',
}

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
