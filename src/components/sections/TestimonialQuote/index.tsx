import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import type { TestimonialQuote as TestimonialQuoteType } from '@/types/sanity.generated'

export function TestimonialQuote({ quote, attribution, image, hasPillBackground }: TestimonialQuoteType) {
  if (hasPillBackground) {
    return (
      <section data-testid="testimonial-quote-section" className="max-w-5xl mx-auto px-8 mb-16 md:mb-32 pt-4">
        <div className="relative bg-primary-container/10 p-10 md:p-20 rounded-3xl sm:rounded-full flex flex-col items-center text-center overflow-hidden">
          {/* Dot texture */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-primary) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          <span
            className="material-symbols-outlined text-primary-container mb-8 relative z-10"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            format_quote
          </span>
          <blockquote className="text-2xl md:text-3xl font-heading italic text-on-primary-container leading-snug mb-8 relative z-10">
            &ldquo;{quote}&rdquo;
          </blockquote>
          {attribution && (
            <cite className="font-body not-italic font-semibold text-primary uppercase tracking-widest text-sm relative z-10">
              — {attribution}
            </cite>
          )}
        </div>
      </section>
    )
  }

  return (
    <section data-testid="testimonial-quote-section" className="py-16 md:py-32 bg-surface text-center px-8">
      <div className="max-w-3xl mx-auto">
        <span
          className="material-symbols-outlined text-primary-container text-6xl opacity-30 mb-8 block"
          aria-hidden="true"
        >
          format_quote
        </span>
        {image?.image && (
          <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-8">
            <Image
              src={urlFor(image.image).url()}
              alt={image.alt ?? ''}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}
        <p className="font-heading text-3xl lg:text-4xl italic text-foreground leading-snug mb-10">
          &ldquo;{quote}&rdquo;
        </p>
        {attribution && (
          <cite className="font-body not-italic font-medium text-outline tracking-widest uppercase text-sm">
            — {attribution}
          </cite>
        )}
      </div>
    </section>
  )
}
