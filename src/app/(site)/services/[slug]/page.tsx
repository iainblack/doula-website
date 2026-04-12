import Link from 'next/link'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity/client'
import { servicePackageBySlugQuery, allServicePackageSlugsQuery } from '@/lib/sanity/queries'
import { PortableText } from '@/components/ui/PortableText'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export default async function ServicePackagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let pkg = null
  try {
    pkg = await client.fetch(servicePackageBySlugQuery, { slug })
  } catch {
    notFound()
  }
  if (!pkg) notFound()

  return (
    <main>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="bg-surface-container-low pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-10 font-body"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Services
          </Link>

          <div className="max-w-3xl">
            {pkg.icon && (
              <span className="material-symbols-outlined text-primary text-5xl mb-4 block">{pkg.icon}</span>
            )}
            <span className="text-xs uppercase tracking-widest text-muted font-body mb-4 block">Service Package</span>
            <h1 className="font-heading text-5xl md:text-6xl text-foreground leading-tight mb-6">
              {pkg.title}
            </h1>
            {pkg.tagline && (
              <p className="text-xl text-muted leading-relaxed font-body mb-8">{pkg.tagline}</p>
            )}
            {pkg.pricing && (
              <div className="inline-flex items-baseline gap-2 bg-surface-container-lowest px-6 py-3 rounded-full border border-outline-variant/20">
                {pkg.pricingLabel && (
                  <span className="text-xs uppercase tracking-widest text-outline font-body">{pkg.pricingLabel}</span>
                )}
                <span className="font-heading text-2xl text-foreground">{pkg.pricing}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Image ────────────────────────────────────────────────── */}
      {pkg.heroImage?.image?.asset && (
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="rounded-xl overflow-hidden">
            <Image
              src={urlFor(pkg.heroImage.image).width(1400).height(613).url()}
              alt={pkg.heroImage.alt ?? pkg.title}
              width={1400}
              height={613}
              className="w-full h-auto"
              priority
              sizes="(max-width: 768px) 100vw, 1400px"
            />
          </div>
        </div>
      )}

      {/* ── Body + Features ───────────────────────────────────────────── */}
      {(pkg.description || (pkg.features && pkg.features.length > 0)) && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-8">
            <div className={`gap-16 ${pkg.description && pkg.features?.length ? 'lg:grid lg:grid-cols-3' : ''}`}>
              {pkg.description && (
                <div className={pkg.features?.length ? 'lg:col-span-2' : 'max-w-4xl'}>
                  <PortableText value={pkg.description} />
                </div>
              )}

              {pkg.features && pkg.features.length > 0 && (
                <div className="mt-10 lg:mt-0">
                  <h2 className="font-heading text-2xl text-foreground mb-6">What&apos;s Included</h2>
                  <ul className="space-y-4">
                    {pkg.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="material-symbols-outlined text-primary mt-0.5 flex-shrink-0"
                          style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}
                        >
                          check_circle
                        </span>
                        <span className="text-muted leading-relaxed font-body">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Sessions Grid ─────────────────────────────────────────────── */}
      {pkg.sessions && pkg.sessions.length > 0 && (
        <section className="bg-surface-container-low py-16">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-heading text-2xl text-foreground mb-8">Session Types</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pkg.sessions.map((session: { _key: string; duration?: string; label?: string }) => (
                <div
                  key={session._key}
                  className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10"
                >
                  {session.duration && (
                    <span className="block font-heading text-2xl text-primary mb-1">{session.duration}</span>
                  )}
                  {session.label && (
                    <span className="text-sm text-muted font-body italic">{session.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Block ─────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="bg-primary-container/20 rounded-2xl py-20 px-8 md:px-16 text-center border border-primary/10">
            <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">
              Let&apos;s Work Together
            </h2>
            <p className="text-muted font-body text-lg mb-8 max-w-xl mx-auto">
              Reach out to discuss how this package can support you through your journey.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-md font-body font-semibold hover:bg-primary-hover transition-colors"
            >
              {pkg.ctaLabel ?? 'Get in Touch'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(allServicePackageSlugsQuery)
    return (slugs ?? []).map((slug: string) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  let pkg = null
  try {
    pkg = await client.fetch(servicePackageBySlugQuery, { slug })
  } catch {
    return {}
  }
  if (!pkg) return {}

  return {
    title: pkg.seo?.title ?? pkg.title,
    description: pkg.seo?.description ?? pkg.tagline,
    openGraph: pkg.heroImage?.image
      ? { images: [{ url: urlFor(pkg.heroImage.image).width(1200).url() }] }
      : undefined,
  }
}
