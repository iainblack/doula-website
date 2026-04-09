import { urlFor } from '@/lib/sanity/client'
import { sanityFetch } from '@/lib/sanity/fetch'
import { aboutPageQuery } from '@/lib/sanity/queries'
import { HeroAbout } from '@/components/sections/HeroAbout'
import { Philosophy } from '@/components/sections/Philosophy'
import { Certifications } from '@/components/sections/Certifications'
import { TestimonialQuote } from '@/components/sections/TestimonialQuote'
import { CtaBanner } from '@/components/sections/CtaBanner'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await sanityFetch(aboutPageQuery)
    return {
      title: page?.seo?.title,
      description: page?.seo?.description,
      openGraph: page?.seo?.ogImage
        ? { images: [{ url: urlFor(page.seo.ogImage).width(1200).url() }] }
        : undefined,
    }
  } catch {
    return {}
  }
}

export default async function AboutPage() {
  let page = null
  try {
    page = await sanityFetch(aboutPageQuery)
  } catch {
    // Sanity not yet configured
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="font-heading text-4xl text-foreground">About</h1>
          <p className="mt-4 text-muted font-body">
            Create an{' '}
            <strong>About Page</strong> document in{' '}
            <a href="/studio" className="text-primary underline">Sanity Studio</a>{' '}
            to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {page.hero && <HeroAbout {...page.hero} />}
      {page.philosophy && <Philosophy {...page.philosophy} />}
      {page.certifications && <Certifications {...page.certifications} />}
      {page.testimonialQuote && <TestimonialQuote {...page.testimonialQuote} />}
      {page.ctaBanner && <CtaBanner {...page.ctaBanner} />}
    </>
  )
}
