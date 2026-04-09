import type { Metadata } from 'next'
import { Noto_Serif, Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import '@/styles/globals.css'

// Heading font: Noto Serif — editorial, authoritative, warmth of serif
const headingFont = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '700'],
})

// Body font: Inter — clean, legible, modern
const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})


export const metadata: Metadata = {
  title: {
    default: 'Site Title',
    template: '%s | Site Title',
  },
  description: 'Site description',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled: isDraftMode } = await draftMode()
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background text-foreground font-body antialiased">
        {children}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}
