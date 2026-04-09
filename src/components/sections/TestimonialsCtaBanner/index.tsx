import Link from 'next/link'
import type { TestimonialsCtaBanner as TestimonialsCtaBannerType } from '@/types/sanity.generated'

type TestimonialsCtaBannerProps = Omit<TestimonialsCtaBannerType, '_type'>

export function TestimonialsCtaBanner({
  heading,
  body,
  primaryCta,
  secondaryCta,
}: TestimonialsCtaBannerProps) {
  if (!heading) return null

  return (
    <section data-testid="testimonials-cta-banner-section" className="mt-24 md:mt-48 mb-16 md:mb-24 max-w-screen-xl mx-auto px-8">
      <div className="bg-primary-container/20 py-16 px-6 md:py-24 md:px-12 rounded-section text-center border border-primary/10">
        <h2 className="font-heading text-4xl md:text-5xl text-primary mb-8 leading-tight">
          {heading}
        </h2>
        {body && (
          <p className="text-on-primary-container text-lg max-w-xl mx-auto mb-12 font-body leading-relaxed">
            {body}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {primaryCta?.label && primaryCta.url && (
              <Link
                href={primaryCta.url}
                className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-body font-medium shadow-md hover:-translate-y-0.5 transition-all"
                {...(primaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta?.label && secondaryCta.url && (
              <Link
                href={secondaryCta.url}
                className="bg-surface text-primary border-2 border-primary/20 px-10 py-4 rounded-xl font-body font-medium hover:bg-primary/5 transition-all"
                {...(secondaryCta.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
