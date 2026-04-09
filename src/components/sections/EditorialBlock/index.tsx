import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'

interface EditorialBlockProps {
  heading: string
  body: string
  highlightText?: string
  pullQuote?: string
  image?: { image: any; alt: string }
}

export function EditorialBlock({
  heading,
  body,
  highlightText,
  pullQuote,
  image,
}: EditorialBlockProps) {
  const hasImage = !!(image?.image)

  return (
    <section data-testid="editorial-block-section" className="py-12 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-8">
        {hasImage ? (
          /* With image: 2/3 text + 1/3 image layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2">
              {highlightText && (
                <p className="font-body text-xs tracking-[--tracking-extra-wide] uppercase text-primary font-medium mb-6">
                  {highlightText}
                </p>
              )}
              <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-8 leading-tight">
                {heading}
              </h2>
              <p className="font-body text-on-surface-variant leading-relaxed text-lg text-muted">
                {body}
              </p>
              {pullQuote && (
                <blockquote className="mt-8 pl-6 border-l-2 border-primary">
                  <p className="font-heading text-xl text-foreground italic leading-snug">
                    &ldquo;{pullQuote}&rdquo;
                  </p>
                </blockquote>
              )}
            </div>
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
              {image?.image && (
                <Image
                  src={urlFor(image.image).url()}
                  alt={image.alt ?? ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 427px"
                />
              )}
            </div>
          </div>
        ) : (
          /* Without image: centered editorial layout */
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto border-t border-outline-variant/20 pt-16">
            {highlightText && (
              <p className="font-body text-xs tracking-[--tracking-extra-wide] uppercase text-primary font-medium mb-6">
                {highlightText}
              </p>
            )}
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-8">
              {heading}
            </h2>
            <p className="font-body text-muted leading-relaxed text-lg">
              {body}
            </p>
            {pullQuote && (
              <blockquote className="mt-8 italic font-heading text-xl text-foreground">
                &ldquo;{pullQuote}&rdquo;
              </blockquote>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
