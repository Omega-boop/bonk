import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'bonk pros — accept jobs instantly',
  description: 'Real-time job feed for vetted service providers. Accept, navigate, complete.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
