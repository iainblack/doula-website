import type { Metadata } from 'next'
import { Noto_Serif, Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import { VisualEditing } from 'next-sanity'
import '@/styles/globals.css'
import { sanityFetch } from '@/lib/sanity/fetch'
import { siteThemeQuery } from '@/lib/sanity/queries'

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
  const theme = await sanityFetch<Record<string, string | null>>(siteThemeQuery)
  const themeVars = buildThemeCss(theme)

  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        {themeVars && (
          <style dangerouslySetInnerHTML={{ __html: themeVars }} />
        )}
      </head>
      <body className="bg-background text-foreground font-body antialiased">
        {children}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  )
}

// Maps Sanity theme field names → CSS custom property names used in globals.css
const THEME_VAR_MAP: Record<string, string> = {
  colorPrimary: '--color-primary',
  colorPrimaryHover: '--color-primary-hover',
  colorPrimaryForeground: '--color-primary-foreground',
  colorBackground: '--color-background',
  colorSurface: '--color-surface',
  colorForeground: '--color-foreground',
  colorMuted: '--color-muted',
  colorBorder: '--color-border',
}

function buildThemeCss(theme?: Record<string, string | null> | null): string {
  if (!theme) return ''
  const declarations = Object.entries(THEME_VAR_MAP)
    .filter(([key]) => theme[key])
    .map(([key, cssVar]) => `  ${cssVar}: ${theme[key]};`)
  if (declarations.length === 0) return ''
  return `:root {\n${declarations.join('\n')}\n}`
}
