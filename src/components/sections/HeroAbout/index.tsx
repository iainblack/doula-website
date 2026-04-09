import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import type { HeroAbout as HeroAboutType } from '@/types/sanity.generated'

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

export function HeroAbout({ overline, headline, headlineEmphasis, body, image }: HeroAboutType) {
  return (
    <section data-testid="hero-about-section" className="max-w-7xl mx-auto px-8 mb-16 md:mb-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Left column — 7/12 text */}
        <div className="md:col-span-7 z-10">
          {overline && (
            <span className="block text-primary font-body uppercase tracking-[0.2em] text-xs mb-6 font-medium">
              {overline}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-heading text-foreground leading-tight mb-8">
            {headlineEmphasis
              ? <HeadlineWithEmphasis headline={headline} emphasis={headlineEmphasis} />
              : headline}
          </h1>
          {body && (
            <p className="text-base md:text-xl text-muted leading-relaxed max-w-xl font-body">
              {body}
            </p>
          )}
        </div>

        {/* Right column — 5/12 portrait */}
        {image?.image && (
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl relative">
              <Image
                src={urlFor(image.image).url()}
                alt={image.alt ?? ''}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42vw"
                priority
              />
            </div>
            {/* Decorative blur circle */}
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-tertiary-container/30 rounded-full blur-3xl -z-10" />
          </div>
        )}
      </div>
    </section>
  )
}
