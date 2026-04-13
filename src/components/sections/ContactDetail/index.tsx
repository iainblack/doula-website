import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import type { ContactDetail as ContactDetailType } from '@/types/sanity.generated'

type ContactDetailProps = Omit<ContactDetailType, '_type'>

function resolveHref(url: string): string {
  if (/^(https?|mailto|tel):/.test(url)) return url
  if (url.includes('@')) return `mailto:${url}`
  if (/^[\d\s+\-().]+$/.test(url)) return `tel:${url}`
  return url
}

function HeadingWithEmphasis({ heading, emphasis }: { heading: string; emphasis?: string }) {
  if (!emphasis) return <>{heading}</>
  const index = heading.indexOf(emphasis)
  if (index === -1) return <>{heading}</>
  return (
    <>
      {heading.slice(0, index)}
      <i className="italic">{emphasis}</i>
      {heading.slice(index + emphasis.length)}
    </>
  )
}

export function ContactDetail({
  overline,
  headline,
  headlineEmphasis,
  body,
  contactMethods,
  image,
  pullQuote,
}: ContactDetailProps) {
  return (
    <section data-testid="contact-detail-section" className="max-w-7xl mx-auto px-8 mb-12 md:mb-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        {/* Left — text + contact methods */}
        <div className="w-full md:w-5/12">
          {overline && (
            <span className="font-body text-xs uppercase tracking-[0.3em] text-outline mb-6 block">
              {overline}
            </span>
          )}
          {headline && (
            <h1 className="font-heading text-3xl sm:text-5xl md:text-7xl leading-tight text-foreground mb-8 font-light">
              <HeadingWithEmphasis heading={headline} emphasis={headlineEmphasis} />
            </h1>
          )}
          {body && (
            <p className="font-body text-lg text-muted leading-relaxed mb-12 max-w-md">{body}</p>
          )}
          {contactMethods && contactMethods.length > 0 && (
            <div className="space-y-10">
              {contactMethods.map((method, i) => (
                <div key={method._key ?? i} className="flex items-start gap-4">
                  {method.icon && (
                    <span
                      className="material-symbols-outlined text-primary"
                      style={{ fontVariationSettings: "'wght' 300" }}
                    >
                      {method.icon}
                    </span>
                  )}
                  <div>
                    {method.label && (
                      <p className="font-body text-xs uppercase tracking-widest text-outline mb-1">
                        {method.label}
                      </p>
                    )}
                    {method.value && method.url ? (
                      <a
                        href={resolveHref(method.url)}
                        className="font-body text-lg text-foreground hover:text-primary transition-colors"
                      >
                        {method.value}
                      </a>
                    ) : method.value ? (
                      <p className="font-body text-lg text-foreground">{method.value}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — image with pull quote overlay */}
        {image?.image && (
          <div className="w-full md:w-7/12 relative group">
            <div className="aspect-[4/5] bg-surface-container-low overflow-hidden rounded-xl relative">
              <Image
                src={urlFor(image.image).url()}
                alt={image.alt ?? ''}
                fill
                className="object-cover grayscale-[20%] sepia-[10%] group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
            </div>
            {pullQuote && (
              <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 p-8 md:p-12 bg-primary text-primary-foreground max-w-xs rounded-lg hidden lg:block">
                <p className="font-heading text-xl italic font-light leading-relaxed">
                  &ldquo;{pullQuote}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
