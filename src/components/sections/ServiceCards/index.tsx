import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/client'
import type { ServiceCards as ServiceCardsType } from '@/types/sanity.generated'

type ServiceItem = NonNullable<ServiceCardsType['services']>[number]
type ServiceCardsProps = ServiceCardsType

// Card 0 — col-span-8, bg-surface-container-lowest, features list + image
function FeaturedCard({ service }: { service: ServiceItem }) {
  return (
    <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center border border-outline-variant/10" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          {service.icon && (
            <span className="material-symbols-outlined text-primary text-3xl">{service.icon}</span>
          )}
          <h2 className="text-3xl font-heading text-primary">{service.title}</h2>
        </div>
        {service.body && (
          <p className="text-muted leading-relaxed">{service.body}</p>
        )}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-3 font-body text-sm text-muted">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {f}
              </li>
            ))}
          </ul>
        )}
        {(service.pricing || service.ctaLabel) && (
          <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-end">
            {service.pricing && (
              <div>
                {service.pricingLabel && (
                  <span className="block text-xs uppercase tracking-widest text-outline mb-1">{service.pricingLabel}</span>
                )}
                <span className="text-2xl font-heading text-foreground">{service.pricing}</span>
              </div>
            )}
            {service.ctaLabel && service.ctaUrl && (
              <Link href={service.ctaUrl} className="text-primary font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform font-body">
                {service.ctaLabel} <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            )}
          </div>
        )}
      </div>
      {service.image?.image && (
        <div className="w-full md:w-1/3 aspect-[4/5] bg-surface-container rounded-lg overflow-hidden relative">
          <Image
            src={urlFor(service.image.image).url()}
            alt={service.image.alt ?? service.title}
            fill
            className="object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      )}
    </div>
  )
}

// Card 1 — col-span-4, bg-surface-container-low, pullquote, hourly pricing
function CompactCard({ service }: { service: ServiceItem }) {
  return (
    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-10 flex flex-col justify-between border border-outline-variant/10" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {service.icon && (
            <span className="material-symbols-outlined text-primary text-3xl">{service.icon}</span>
          )}
          <h2 className="text-2xl font-heading text-primary">{service.title}</h2>
        </div>
        {service.body && (
          <p className="text-muted text-sm leading-relaxed">{service.body}</p>
        )}
        {service.pullQuote && (
          <div className="space-y-3 pt-4">
            <div className="bg-surface-container-lowest p-4 rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">nest_eco_leaf</span>
              <span className="text-xs font-body text-muted italic leading-snug">{service.pullQuote}</span>
            </div>
          </div>
        )}
      </div>
      {service.pricing && (
        <div className="mt-8 pt-6 border-t border-outline-variant/20">
          {service.pricingLabel && (
            <span className="block text-xs uppercase tracking-widest text-outline mb-1">{service.pricingLabel}</span>
          )}
          <span className="text-2xl font-heading text-foreground">{service.pricing}</span>
        </div>
      )}
    </div>
  )
}

// Card 2 — col-span-5, bg-primary (inverted), features as bullets
function HighlightedCard({ service }: { service: ServiceItem }) {
  return (
    <div className="md:col-span-5 bg-primary text-primary-foreground rounded-xl p-6 md:p-10 flex flex-col justify-between relative overflow-hidden" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      {service.icon && (
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined" style={{ fontSize: '80px' }}>{service.icon}</span>
        </div>
      )}
      <div className="space-y-6 relative z-10">
        <h2 className="text-3xl font-heading">{service.title}</h2>
        {service.body && (
          <p className="leading-relaxed opacity-90 text-primary-foreground/90">{service.body}</p>
        )}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-2 text-sm">
            {service.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">• {f}</li>
            ))}
          </ul>
        )}
      </div>
      {(service.pricing || service.ctaLabel) && (
        <div className="mt-8 relative z-10">
          <div className="flex justify-between items-center">
            {service.pricing && (
              <span className="text-xl font-heading">{service.pricing}</span>
            )}
            {service.ctaLabel && service.ctaUrl && (
              <Link href={service.ctaUrl} className="bg-primary-foreground text-primary px-4 py-2 rounded-md text-sm font-body font-bold uppercase tracking-tighter">
                {service.ctaLabel}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Card 3 — col-span-7, bg-surface-container-highest, sessions grid + image
function MediaCard({ service }: { service: ServiceItem }) {
  return (
    <div className="md:col-span-7 bg-surface-container-highest rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 border border-outline-variant/10" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-heading text-primary">{service.title}</h2>
        {service.body && (
          <p className="text-muted text-sm">{service.body}</p>
        )}
        {service.sessions && service.sessions.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4">
            {service.sessions.map((s, i) => (
              <div key={s._key ?? i} className="bg-surface-container-lowest p-4 rounded-lg">
                <span className="block font-semibold text-primary mb-1 font-body">{s.duration}</span>
                <span className="text-xs text-outline italic font-body">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {service.image?.image && (
        <div className="w-full md:w-1/2 aspect-video md:aspect-auto rounded-lg overflow-hidden bg-surface-container">
          <Image
            src={urlFor(service.image.image).url()}
            alt={service.image.alt ?? service.title}
            width={600}
            height={400}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, 35vw"
          />
        </div>
      )}
    </div>
  )
}

const cardRenderers = [FeaturedCard, CompactCard, HighlightedCard, MediaCard]

export function ServiceCards({ services }: ServiceCardsProps) {
  if (!services || services.length === 0) return null

  return (
    <section data-testid="service-cards-section" className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      {services.map((service, index) => {
        const CardComponent = cardRenderers[index]
        if (!CardComponent) return null
        return <CardComponent key={service._key ?? index} service={service} />
      })}
    </section>
  )
}
