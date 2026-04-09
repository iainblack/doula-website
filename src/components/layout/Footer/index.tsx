import Link from 'next/link'

interface FooterLink {
  label: string
  url: string
}

interface FooterData {
  links?: FooterLink[]
  copyright?: string
}

export function Footer({ data }: { data: FooterData | null }) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-[--max-width-content] mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {data?.links && data.links.length > 0 && (
            <nav className="flex flex-wrap items-center justify-center md:justify-start gap-6">
              {data.links.map((link, i) => (
                <Link
                  key={`${link.url}-${i}`}
                  href={link.url}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
          <p className="text-sm text-muted">
            {data?.copyright || `© ${year} All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
