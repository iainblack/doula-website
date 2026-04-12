'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { urlFor } from '@/lib/sanity/client'

interface NavLink {
  label: string
  url: string
}

interface NavbarData {
  logo?: any
  links?: NavLink[]
  cta?: {
    label: string
    url: string
    style?: string
    newTab?: boolean
  }
}

export function Navbar({ data }: { data: NavbarData | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Blur applied to a non-containing child so fixed descendants position to the viewport */}
      <div className="absolute inset-0 bg-surface/80 backdrop-blur-md bg-gradient-to-b from-surface to-transparent pointer-events-none" aria-hidden="true" />
      <div className="relative z-50 flex justify-between items-center px-8 py-3 max-w-7xl mx-auto">

        {/* Logo / Brand */}
        <Link href="/" className="flex items-center">
          {data?.logo?.asset ? (
            <Image
              src={urlFor(data.logo).height(80).auto('format').url()}
              alt="Logo"
              width={240}
              height={80}
              className="h-16 w-auto object-contain"
              priority
            />
          ) : (
            <span className="text-2xl font-heading italic text-primary">The Mindful Doula</span>
          )}
        </Link>

        {/* Desktop nav links */}
        {data?.links && data.links.length > 0 && (
          <div className="hidden xl:flex items-center gap-8">
            {data.links.map((link, i) => {
              const isActive = pathname === link.url
              return (
                <Link
                  key={`${link.url}-${i}`}
                  href={link.url}
                  className={`font-heading tracking-tight antialiased transition-colors ${isActive ? 'text-primary underline underline-offset-4' : 'text-muted hover:text-primary'}`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Desktop CTA */}
        {data?.cta && (
          <Link
            href={data.cta.url}
            className="hidden xl:inline-flex bg-primary text-primary-foreground px-6 py-2 rounded font-body font-medium hover:opacity-90 transition-opacity active:scale-95 duration-200"
            {...(data.cta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {data.cta.label}
          </Link>
        )}

        {/* Hamburger button (mobile/tablet) */}
        <button
          className="xl:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile/tablet dropdown */}
      {menuOpen && (
        <div className="xl:hidden bg-surface border-t border-border px-8 pb-6 flex flex-col gap-6 fixed inset-0 z-40 pt-20 overflow-y-auto">
          {data?.links && data.links.map((link, i) => {
            const isActive = pathname === link.url
            return (
              <Link
                key={`${link.url}-${i}`}
                href={link.url}
                className={`font-heading tracking-tight antialiased text-lg transition-colors ${isActive ? 'text-primary underline underline-offset-4' : 'text-muted hover:text-primary'}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          {data?.cta && (
            <Link
              href={data.cta.url}
              className="bg-primary text-primary-foreground px-6 py-3 rounded font-body font-medium hover:opacity-90 transition-opacity active:scale-95 duration-200 text-center"
              onClick={() => setMenuOpen(false)}
              {...(data.cta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {data.cta.label}
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
