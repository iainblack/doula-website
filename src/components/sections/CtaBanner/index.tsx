import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/client'
import type { CtaBanner as CtaBannerType } from '@/types/sanity.generated'

function HeadingWithEmphasis({ heading, emphasis }: { heading: string; emphasis: string }) {
  const index = heading.indexOf(emphasis)
  if (index === -1) return <>{heading}</>
  return (
    <>
      {heading.slice(0, index)}
      <span className="italic text-primary">{emphasis}</span>
      {heading.slice(index + emphasis.length)}
    </>
  )
}

export function CtaBanner({
  image,
  heading,
  headlineEmphasis,
  body,
  primaryCta,
  secondaryCta,
}: CtaBannerType) {
  return (
    <section data-testid="cta-banner-section" className="max-w-7xl mx-auto px-8 mb-16 md:mb-32">
      <div className="flex flex-col md:flex-row items-center gap-12 bg-surface-container-highest/50 p-1 rounded-2xl">
        {/* Image — 1/3 */}
        {image?.image && (
          <div className="w-full md:w-1/3">
            <div className="aspect-square rounded-xl overflow-hidden">
              <Image
                src={urlFor(image.image).url()}
                alt={image.alt ?? ''}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        )}

        {/* Text — 2/3 */}
        <div className={`${image?.image ? 'w-full md:w-2/3' : 'w-full'} p-6 md:p-12`}>
          <h2 className="text-3xl md:text-4xl font-heading mb-6">
            {headlineEmphasis
              ? <HeadingWithEmphasis heading={heading} emphasis={headlineEmphasis} />
              : heading}
          </h2>
          {body && (
            <p className="text-muted mb-10 text-lg font-body leading-relaxed">{body}</p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.url}
                  className="bg-primary text-primary-foreground px-10 py-4 rounded-lg font-body font-semibold hover:opacity-90 transition-opacity"
                  {...(primaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.url}
                  className="border border-outline-variant/40 bg-transparent text-primary px-10 py-4 rounded-lg font-body font-semibold hover:bg-surface-container-low transition-colors"
                  {...(secondaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
