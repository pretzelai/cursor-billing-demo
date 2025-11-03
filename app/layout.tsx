import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lumen Billing Demo - Cursor Style',
  description: 'Demo app for Lumen billing integration',
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
