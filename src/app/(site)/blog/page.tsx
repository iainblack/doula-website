import { client, urlFor } from '@/lib/sanity/client'
import { allPostsQuery } from '@/lib/sanity/queries'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles and updates',
}

export default async function BlogPage() {
  let posts: any[] = []

  try {
    posts = (await client.fetch(allPostsQuery)) ?? []
  } catch {
    // Sanity not yet configured
  }

  if (!posts.length) {
    return (
      <div className="max-w-[--max-width-content] mx-auto px-[--spacing-section-x] py-[--spacing-section-y]">
        <h1 className="font-heading text-4xl font-bold text-foreground">Blog</h1>
        <p className="mt-4 text-muted">
          No posts yet. Create your first post in{' '}
          <a href="/studio" className="text-primary underline">
            Sanity Studio
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[--max-width-content] mx-auto px-[--spacing-section-x] py-[--spacing-section-y]">
      <h1 className="font-heading text-4xl font-bold text-foreground mb-12">Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug?.current}
            href={`/blog/${post.slug?.current}`}
            className="group block"
          >
            <article className="bg-surface rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow h-full">
              {post.coverImage?.image && (
                <Image
                  src={urlFor(post.coverImage.image).width(600).height(340).url()}
                  alt={post.coverImage.alt || post.title}
                  width={600}
                  height={340}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 text-muted text-sm line-clamp-2">{post.excerpt}</p>
                )}
                {post.publishedAt && (
                  <time className="mt-4 block text-xs text-muted">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
