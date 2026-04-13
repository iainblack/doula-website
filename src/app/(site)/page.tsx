import { urlFor } from '@/lib/sanity/client'
import { sanityFetch } from '@/lib/sanity/fetch'
import { homePageQuery } from '@/lib/sanity/queries'
import { Hero } from '@/components/sections/Hero'
import { EditorialBlock } from '@/components/sections/EditorialBlock'
import { FeatureGrid } from '@/components/sections/FeatureGrid'
import { TestimonialQuote } from '@/components/sections/TestimonialQuote'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await sanityFetch(homePageQuery)
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

export default async function HomePage() {
  let page = null
  try {
    page = await sanityFetch(homePageQuery)
  } catch {
    // Sanity not yet configured
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="font-heading text-4xl text-foreground">Welcome</h1>
          <p className="mt-4 text-muted font-body">
            Create a{' '}
            <strong>Home Page</strong> document in{' '}
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
      {page.editorialBlock && <EditorialBlock {...page.editorialBlock} />}
      {page.featureGrid && <FeatureGrid {...page.featureGrid} />}
      {page.testimonialQuote && <TestimonialQuote {...page.testimonialQuote} />}
    </>
  )
}
