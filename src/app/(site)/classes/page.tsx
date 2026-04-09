import { urlFor } from '@/lib/sanity/client'
import { sanityFetch } from '@/lib/sanity/fetch'
import { classesPageQuery } from '@/lib/sanity/queries'
import { Hero } from '@/components/sections/Hero'
import { ClassList } from '@/components/sections/ClassList'
import { NewsletterSignup } from '@/components/sections/NewsletterSignup'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const page = await sanityFetch(classesPageQuery)
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

export default async function ClassesPage() {
  let page = null
  try {
    page = await sanityFetch(classesPageQuery)
  } catch {
    // Sanity not yet configured
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="font-heading text-4xl text-foreground">Classes &amp; Workshops</h1>
          <p className="mt-4 text-muted font-body">
            Create a <strong>Classes &amp; Workshops Page</strong> document in{' '}
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
      {page.classList && <ClassList {...page.classList} />}
      {page.newsletterSignup && <NewsletterSignup {...page.newsletterSignup} />}
    </>
  )
}
