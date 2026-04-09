import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/client'
import type { Hero as HeroType } from '@/types/sanity.generated'

function HeadlineWithEmphasis({ headline, emphasis }: { headline: string; emphasis: string }) {
  const index = headline.indexOf(emphasis)
  if (index === -1) return <>{headline}</>
  return (
    <>
      {headline.slice(0, index)}
      <span className="italic">{emphasis}</span>
      {headline.slice(index + emphasis.length)}
    </>
  )
}

export function Hero({
  headline,
  headlineEmphasis,
  overline,
  body,
  image,
  accentImage,
  primaryCta,
  secondaryCta,
  compact,
}: HeroType) {

  if (compact) {
    return (
      <header data-testid="hero-section" className="max-w-7xl mx-auto px-8 mb-20 text-center">
        {overline && (
          <span className="block text-primary uppercase tracking-[0.2em] text-xs font-body font-semibold mb-4">
            {overline}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-heading text-foreground mb-8 tracking-tight leading-[1.1]">
          {headlineEmphasis
            ? <HeadlineWithEmphasis headline={headline} emphasis={headlineEmphasis} />
            : headline}
        </h1>
        {body && (
          <p className="max-w-2xl mx-auto text-lg text-muted font-light leading-relaxed">
            {body}
          </p>
        )}
      </header>
    )
  }
  const hasImages = image?.image || accentImage?.image

  return (
    <section data-testid="hero-section" className="relative lg:min-h-[--hero-min-height-lg] flex items-center px-8 lg:px-24 pb-12 md:pb-24 overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left column — text */}
        <div className={`z-10 ${hasImages ? 'lg:col-span-6' : 'lg:col-span-8 lg:col-start-3 text-center'}`}>
          {overline && (
            <span className="font-body text-xs tracking-[--tracking-extra-wide] uppercase text-primary font-medium mb-6 block">
              {overline}
            </span>
          )}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-7xl text-foreground leading-tight font-light mb-8">
            {headlineEmphasis
              ? <HeadlineWithEmphasis headline={headline} emphasis={headlineEmphasis} />
              : headline}
          </h1>
          {body && (
            <p className="font-body text-lg text-muted max-w-lg mb-10 leading-relaxed">
              {body}
            </p>
          )}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-4">
              {primaryCta && (
                <Link
                  href={primaryCta.url}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-medium hover:opacity-90 transition-opacity font-body"
                  {...(primaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.url}
                  className="border border-outline-variant/30 text-foreground px-8 py-4 rounded-lg font-medium hover:bg-surface-container-low transition-colors font-body"
                  {...(secondaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Right column — overlapping images */}
        {hasImages && (
          <div className="lg:col-span-6 relative pb-12 lg:pb-0">
            {image?.image && (
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={urlFor(image.image).url()}
                  alt={image.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            )}
            {accentImage?.image && (
              <div className="absolute -bottom-12 -left-12 w-2/3 aspect-square rounded-xl overflow-hidden shadow-xl border-[--accent-image-border] border-surface hidden lg:block z-10">
                <Image
                  src={urlFor(accentImage.image).url()}
                  alt={accentImage.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Background tonal decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10 opacity-50" />
    </section>
  )
}
