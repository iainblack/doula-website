import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import type { TestimonialGrid as TestimonialGridType } from '@/types/sanity.generated'

type TestimonialItem = NonNullable<TestimonialGridType['testimonials']>[number]
type TestimonialGridProps = Omit<TestimonialGridType, '_type'>
type ImgItem = NonNullable<TestimonialItem['images']>[number]

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1 text-primary">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
      ))}
    </div>
  )
}

function BodyParagraphs({ body, className }: { body: string; className?: string }) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean)
  return (
    <div className={`space-y-4 ${className ?? ''}`}>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  )
}

// Shared dynamic image grid — 1 fills space, 2–4 spaced evenly
function TestimonialImageGrid({ imgs, className }: { imgs: ImgItem[]; className?: string }) {
  const count = imgs.length

  if (count === 1) {
    return (
      <div className={`w-full ${className ?? ''}`}>
        <Image
          src={urlFor(imgs[0].image!).url()}
          alt={imgs[0].alt ?? ''}
          width={0}
          height={0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="w-full h-auto rounded-xl"
        />
      </div>
    )
  }

  if (count === 2) {
    return (
      <div className={`grid grid-cols-2 gap-4 h-full ${className ?? ''}`}>
        {imgs.map((img, i) => (
          <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-xl">
            <Image
              src={urlFor(img.image!).url()}
              alt={img.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>
    )
  }

  if (count === 3) {
    return (
      <div className={`grid grid-cols-2 gap-4 ${className ?? ''}`}>
        {/* Tall first image */}
        <div className="row-span-2 relative aspect-[3/4] overflow-hidden rounded-xl">
          <Image
            src={urlFor(imgs[0].image!).url()}
            alt={imgs[0].alt ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
        {/* Two stacked on the right */}
        {imgs.slice(1).map((img, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={urlFor(img.image!).url()}
              alt={img.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 25vw, 12vw"
            />
          </div>
        ))}
      </div>
    )
  }

  // 4 images: 2x2 grid
  return (
    <div className={`grid grid-cols-2 gap-4 ${className ?? ''}`}>
      {imgs.map((img, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src={urlFor(img.image!).url()}
            alt={img.alt ?? ''}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  )
}

// Layout 0: 5/12 text left + 7/12 image grid right
function AsymmetricLayout({ item }: { item: TestimonialItem }) {
  const imgs = (item.images ?? []).filter((img) => img.image).slice(0, 4)
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      {/* Text */}
      <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
        {item.overline && (
          <span className="font-body text-primary text-xs tracking-widest uppercase">
            {item.overline}
          </span>
        )}
        {(item.rating ?? 5) > 0 && <StarRating count={item.rating ?? 5} />}
        <h2 className="font-heading text-3xl italic text-foreground leading-snug">
          &ldquo;{item.quote}&rdquo;
        </h2>
        {item.body && (
          <BodyParagraphs
            body={item.body}
            className="text-muted leading-relaxed font-body"
          />
        )}
        <div>
          {item.attribution && (
            <p className="font-heading font-semibold text-lg text-primary">{item.attribution}</p>
          )}
          {item.attributionDetail && (
            <p className="text-sm font-body uppercase tracking-widest text-muted">
              {item.attributionDetail}
            </p>
          )}
        </div>
      </div>

      {/* Images */}
      {imgs.length > 0 && (
        <div className="lg:col-span-7 order-1 lg:order-2">
          <TestimonialImageGrid imgs={imgs} />
        </div>
      )}
    </section>
  )
}

// Layout 1: Centered editorial card on bg-surface-container-low
function EditorialCardLayout({ item }: { item: TestimonialItem }) {
  const imgs = (item.images ?? []).filter((img) => img.image)
  const paragraphs = item.body ? item.body.split(/\n\n+/).filter(Boolean) : []

  return (
    <section className="max-w-4xl mx-auto py-12 px-6 md:py-20 md:px-12 bg-surface-container-low rounded-card relative overflow-hidden">
      {/* Decorative watermark */}
      <div className="absolute top-0 right-0 p-12 opacity-5 text-primary scale-[5] pointer-events-none">
        <span className="material-symbols-outlined text-9xl">format_quote</span>
      </div>

      <div className="relative z-10 text-center space-y-10">
        {item.overline && (
          <span className="font-body text-primary text-xs tracking-widest uppercase block">
            {item.overline}
          </span>
        )}

        {/* Avatar — only first image */}
        {imgs[0]?.image && (
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-surface overflow-hidden shadow-md relative">
              <Image
                src={urlFor(imgs[0].image).url()}
                alt={imgs[0].alt ?? item.attribution ?? ''}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          </div>
        )}

        {(item.rating ?? 5) > 0 && (
          <div className="flex justify-center">
            <StarRating count={item.rating ?? 5} />
          </div>
        )}

        <h2 className="font-heading text-2xl md:text-4xl italic text-foreground leading-tight px-4">
          &ldquo;{item.quote}&rdquo;
        </h2>

        {paragraphs.length > 0 && (
          <div className="font-body text-muted text-lg leading-relaxed max-w-2xl mx-auto space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        <div className="pt-4">
          {item.attribution && (
            <p className="font-heading font-bold text-xl text-primary">{item.attribution}</p>
          )}
          {item.attributionDetail && (
            <p className="text-xs font-body uppercase tracking-[0.3em] text-muted mt-2">
              {item.attributionDetail}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

// Layout 2: Left image grid + right text
function GalleryGridLayout({ item }: { item: TestimonialItem }) {
  const imgs = (item.images ?? []).filter((img) => img.image).slice(0, 4)
  const paragraphs = item.body ? item.body.split(/\n\n+/).filter(Boolean) : []

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
      {/* Image grid */}
      {imgs.length > 0 && (
        <TestimonialImageGrid imgs={imgs} />
      )}

      {/* Text */}
      <div className="space-y-8">
        {item.overline && (
          <span className="font-body text-primary text-xs tracking-widest uppercase">
            {item.overline}
          </span>
        )}
        {(item.rating ?? 5) > 0 && <StarRating count={item.rating ?? 5} />}
        <h2 className="font-heading text-2xl md:text-4xl text-foreground leading-tight">{item.quote}</h2>

        {paragraphs.length > 0 && (
          <div className="text-muted text-lg leading-relaxed font-body space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}

        {(item.attribution || item.attributionDetail) && (
          <div className="flex items-center gap-4 pt-4">
            <div className="h-px flex-1 bg-outline-variant/30" />
            <div className="text-right">
              {item.attribution && (
                <p className="font-heading font-semibold text-foreground">{item.attribution}</p>
              )}
              {item.attributionDetail && (
                <p className="text-sm italic text-muted">{item.attributionDetail}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function TestimonialGrid({ testimonials }: TestimonialGridProps) {
  if (!testimonials?.length) return null

  return (
    <div data-testid="testimonial-grid-section" className="space-y-20 md:space-y-40 px-8 max-w-screen-2xl mx-auto">
      {testimonials.map((item, i) => (
        <div key={item._key ?? i}>
          {(item.variant === 'asymmetric' || !item.variant) && <AsymmetricLayout item={item} />}
          {item.variant === 'editorial' && <EditorialCardLayout item={item} />}
          {item.variant === 'gallery' && <GalleryGridLayout item={item} />}
        </div>
      ))}
    </div>
  )
}
