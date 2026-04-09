import {
  PortableText as PortableTextReact,
  type PortableTextComponents,
} from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-heading text-3xl font-bold text-foreground mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-heading text-2xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-heading text-xl font-semibold text-foreground mt-6 mb-3">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-foreground leading-relaxed mb-5">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-6 italic text-muted my-8">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith('http')
      return (
        <a
          href={value?.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary underline underline-offset-2 hover:no-underline"
        >
          {children}
        </a>
      )
    },
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-surface px-1.5 py-0.5 rounded-sm border border-border">
        {children}
      </code>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-5 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-5 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-foreground leading-relaxed">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <figure className="my-10">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="text-sm text-muted mt-3 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

interface PortableTextProps {
  value: any
  className?: string
}

export function PortableText({ value, className = '' }: PortableTextProps) {
  if (!value) return null
  return (
    <div className={className}>
      <PortableTextReact value={value} components={components} />
    </div>
  )
}
