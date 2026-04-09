import { urlFor } from '@/lib/sanity/client'
import { sanityFetch } from '@/lib/sanity/fetch'
import { testimonialsPageQuery } from '@/lib/sanity/queries'
import { Hero } from '@/components/sections/Hero'
import { TestimonialGrid } from '@/components/sections/TestimonialGrid'
import { TestimonialsCtaBanner } from '@/components/sections/TestimonialsCtaBanner'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await sanityFetch(testimonialsPageQuery)
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

export default async function TestimonialsPage() {
  let page = null
  try {
    page = await sanityFetch(testimonialsPageQuery)
  } catch {
    // Sanity not yet configured
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="font-heading text-4xl text-foreground">Testimonials</h1>
          <p className="mt-4 text-muted font-body">
            Create a{' '}
            <strong>Testimonials Page</strong> document in{' '}
            <a href="/studio" className="text-primary underline">Sanity Studio</a>{' '}
            to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {page.hero && <Hero {...page.hero} />}
      {page.testimonialGrid && <TestimonialGrid {...page.testimonialGrid} />}
      {page.ctaBanner && <TestimonialsCtaBanner {...page.ctaBanner} />}
    </>
  )
}
