import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/client'

type PackageData = {
  _id: string
  title: string
  slug?: { current?: string }
  icon?: string
  summary?: string
  pullQuote?: string
  features?: string[]
  pricingLabel?: string
  pricing?: string
  heroImage?: { image?: { asset?: { _id: string; url: string }; hotspot?: object; crop?: object }; alt?: string }
  sessions?: Array<{ _key: string; duration?: string; label?: string }>
}

type PackageItem = {
  _key: string
  variant: 'featured' | 'compact' | 'highlighted' | 'media'
  package?: PackageData
}

type ServiceCardsProps = { packages?: PackageItem[] }

function detailHref(pkg: PackageData): string {
  return pkg.slug?.current ? `/services/${pkg.slug.current}` : '/services'
}

// Featured — col-span-8, bg-surface-container-lowest, features list + image
function FeaturedCard({ pkg }: { pkg: PackageData }) {
  const href = detailHref(pkg)
  return (
    <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center border border-outline-variant/10" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-4">
          {pkg.icon && (
            <span className="material-symbols-outlined text-primary text-3xl">{pkg.icon}</span>
          )}
          <h2 className="text-3xl font-heading text-primary">{pkg.title}</h2>
        </div>
        {pkg.summary && (
          <p className="text-muted leading-relaxed">{pkg.summary}</p>
        )}
        {pkg.features && pkg.features.length > 0 && (
          <ul className="space-y-3 font-body text-sm text-muted">
            {pkg.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {f}
              </li>
            ))}
          </ul>
        )}
        {(pkg.pricing || href) && (
          <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-end">
            {pkg.pricing && (
              <div>
                {pkg.pricingLabel && (
                  <span className="block text-xs uppercase tracking-widest text-outline mb-1">{pkg.pricingLabel}</span>
                )}
                <span className="text-2xl font-heading text-foreground">{pkg.pricing}</span>
              </div>
            )}
            <Link href={href} className="text-primary font-semibold flex items-center gap-2 hover:translate-x-1 transition-transform font-body">
              View Details <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
      {pkg.heroImage?.image?.asset && (
        <div className="w-full md:w-1/3 aspect-[4/5] bg-surface-container rounded-lg overflow-hidden relative">
          <Image
            src={urlFor(pkg.heroImage.image).url()}
            alt={pkg.heroImage.alt ?? pkg.title}
            fill
            className="object-cover grayscale-[20%] hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      )}
    </div>
  )
}

// Compact — col-span-4, bg-surface-container-low, pull quote + pricing
function CompactCard({ pkg }: { pkg: PackageData }) {
  return (
    <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 md:p-10 flex flex-col justify-between border border-outline-variant/10" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          {pkg.icon && (
            <span className="material-symbols-outlined text-primary text-3xl">{pkg.icon}</span>
          )}
          <h2 className="text-2xl font-heading text-primary">{pkg.title}</h2>
        </div>
        {pkg.summary && (
          <p className="text-muted text-sm leading-relaxed">{pkg.summary}</p>
        )}
        {pkg.pullQuote && (
          <div className="space-y-3 pt-4">
            <div className="bg-surface-container-lowest p-4 rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">nest_eco_leaf</span>
              <span className="text-xs font-body text-muted italic leading-snug">{pkg.pullQuote}</span>
            </div>
          </div>
        )}
      </div>
      {pkg.pricing && (
        <div className="mt-8 pt-6 border-t border-outline-variant/20">
          {pkg.pricingLabel && (
            <span className="block text-xs uppercase tracking-widest text-outline mb-1">{pkg.pricingLabel}</span>
          )}
          <span className="text-2xl font-heading text-foreground">{pkg.pricing}</span>
        </div>
      )}
    </div>
  )
}

// Highlighted — col-span-5, inverted primary bg, bullet features
function HighlightedCard({ pkg }: { pkg: PackageData }) {
  const href = detailHref(pkg)
  return (
    <div className="md:col-span-5 bg-primary text-primary-foreground rounded-xl p-6 md:p-10 flex flex-col justify-between relative overflow-hidden" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      {pkg.icon && (
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined" style={{ fontSize: '80px' }}>{pkg.icon}</span>
        </div>
      )}
      <div className="space-y-6 relative z-10">
        <h2 className="text-3xl font-heading">{pkg.title}</h2>
        {pkg.summary && (
          <p className="leading-relaxed opacity-90 text-primary-foreground/90">{pkg.summary}</p>
        )}
        {pkg.features && pkg.features.length > 0 && (
          <ul className="space-y-2 text-sm">
            {pkg.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">• {f}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-8 relative z-10 flex justify-between items-center">
        {pkg.pricing && (
          <span className="text-xl font-heading">{pkg.pricing}</span>
        )}
        <Link href={href} className="bg-primary-foreground text-primary px-4 py-2 rounded-md text-sm font-body font-bold uppercase tracking-tighter">
          View Details
        </Link>
      </div>
    </div>
  )
}

// Media — col-span-7, sessions grid + image
function MediaCard({ pkg }: { pkg: PackageData }) {
  return (
    <div className="md:col-span-7 bg-surface-container-highest rounded-xl p-6 md:p-10 flex flex-col md:flex-row gap-8 border border-outline-variant/10" style={{ boxShadow: '0 20px 50px -12px rgba(27,28,25,0.04)' }}>
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-heading text-primary">{pkg.title}</h2>
        {pkg.summary && (
          <p className="text-muted text-sm">{pkg.summary}</p>
        )}
        {pkg.sessions && pkg.sessions.length > 0 && (
          <div className="grid grid-cols-2 gap-4 pt-4">
            {pkg.sessions.map((s, i) => (
              <div key={s._key ?? i} className="bg-surface-container-lowest p-4 rounded-lg">
                <span className="block font-semibold text-primary mb-1 font-body">{s.duration}</span>
                <span className="text-xs text-outline italic font-body">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {pkg.heroImage?.image?.asset && (
        <div className="w-full md:w-1/2 aspect-video md:aspect-auto rounded-lg overflow-hidden bg-surface-container relative">
          <Image
            src={urlFor(pkg.heroImage.image).url()}
            alt={pkg.heroImage.alt ?? pkg.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 35vw"
          />
        </div>
      )}
    </div>
  )
}

const cardMap: Record<string, (props: { pkg: PackageData }) => React.ReactElement | null> = {
  featured: FeaturedCard,
  compact: CompactCard,
  highlighted: HighlightedCard,
  media: MediaCard,
}

export function ServiceCards({ packages }: ServiceCardsProps) {
  if (!packages || packages.length === 0) return null

  return (
    <section data-testid="service-cards-section" className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
      {packages.map((item) => {
        if (!item.package) return null
        const CardComponent = cardMap[item.variant ?? 'featured']
        if (!CardComponent) return null
        return <CardComponent key={item._key} pkg={item.package} />
      })}
    </section>
  )
}
