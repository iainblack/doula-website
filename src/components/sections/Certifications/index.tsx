import type { Certifications as CertificationsType } from '@/types/sanity.generated'

export function Certifications({ heading, subheading, items }: CertificationsType) {
  return (
    <section data-testid="certifications-section" className="py-12 md:py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 mb-12">
        <h2 className="text-3xl font-heading text-primary">{heading}</h2>
        {subheading && (
          <p className="text-muted font-body mt-2">{subheading}</p>
        )}
      </div>
      <div className="relative">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-8 pb-8 max-w-7xl mx-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {items?.map((cert, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 snap-center bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/20 flex flex-col"
            >
              {cert.icon && (
                <span className="material-symbols-outlined text-primary mb-4" style={{ fontSize: '32px' }}>
                  {cert.icon}
                </span>
              )}
              <h3 className="font-heading text-xl mb-2">{cert.title}</h3>
              {cert.description && (
                <p className="text-sm text-muted font-body mb-6 flex-grow leading-relaxed">
                  {cert.description}
                </p>
              )}
              {(() => {
                const href = (cert.certFile?.asset as { url?: string } | undefined)?.url ?? cert.certUrl
                return href ? (
                  <a
                    href={href}
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline font-body"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                    View Certificate
                  </a>
                ) : null
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
