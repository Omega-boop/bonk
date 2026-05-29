import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'bonk — service pros, instantly',
  description:
    'Post a job. Vetted pros nearby see it instantly. First to accept gets it. On-the-way tracking. In-app payment. Done.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
