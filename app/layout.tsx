import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'stripe-no-webhooks - Cursor Style',
  description: 'Demo app for stripe-no-webhooks integration',
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
