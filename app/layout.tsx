import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bank Interest Rates',
  description: 'Compare bank interest rates in Hong Kong',
  verification: {
    google: 'rJf5dkvnZwcsNLqn2kR7_S5s22x_mm5XzFtLoCXIFaU',
  },
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
