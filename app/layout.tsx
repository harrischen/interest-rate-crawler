import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bank Interest Rates',
  description: 'Compare bank interest rates in Hong Kong',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
