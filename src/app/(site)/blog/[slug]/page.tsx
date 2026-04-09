import { client, urlFor } from '@/lib/sanity/client'
import { postBySlugQuery, allPostSlugsQuery } from '@/lib/sanity/queries'
import { PortableText } from '@/components/ui/PortableText'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let post = null
  try {
    post = await client.fetch(postBySlugQuery, { slug })
  } catch {
    notFound()
  }
  if (!post) notFound()

  return (
    <article className="max-w-[--max-width-content] mx-auto px-[--spacing-section-x] py-[--spacing-section-y]">
      <header className="max-w-3xl mx-auto mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted leading-relaxed">{post.excerpt}</p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
          {post.author?.name && <span>By {post.author.name}</span>}
          {post.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </>
          )}
        </div>
      </header>

      {post.coverImage?.image && (
        <div className="mb-12">
          <Image
            src={urlFor(post.coverImage.image).width(1200).height(630).url()}
            alt={post.coverImage.alt || post.title}
            width={1200}
            height={630}
            className="w-full rounded-lg"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <PortableText value={post.body} />
      </div>
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const slugs = await client.fetch(allPostSlugsQuery)
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
  let post = null
  try {
    post = await client.fetch(postBySlugQuery, { slug })
  } catch {
    return {}
  }
  if (!post) return {}

  return {
    title: post.seo?.title ?? post.title,
    description: post.seo?.description ?? post.excerpt,
    openGraph: post.coverImage?.image
      ? { images: [{ url: urlFor(post.coverImage.image).width(1200).url() }] }
      : undefined,
  }
}
