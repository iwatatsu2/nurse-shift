import type { Metadata, Viewport } from 'next'
import { Inter, Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen-kaku",
})

export const metadata: Metadata = {
  title: 'ナースシフト - 看護師向けシフト管理',
  description: '看護師のためのかんたんシフト管理アプリ',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e1e2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className="bg-gray-50">
      <body className={`${inter.variable} ${zenKaku.variable} font-[var(--font-zen-kaku)] antialiased`}>
        {children}
      </body>
    </html>
  )
}
