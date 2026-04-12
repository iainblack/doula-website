import Image from 'next/image'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { urlFor } from '@/lib/sanity/client'
import type { ImageGallery as ImageGalleryType } from '@/types/sanity.generated'

export function ImageGallery({ images }: ImageGalleryType) {
  if (!images?.length) return null

  const imgs = images.filter((item) => item.image).slice(0, 4)
  const count = imgs.length

  // 1 image: full width
  // 2 images: side by side
  // 3 images: first full-width top row, two below
  // 4 images: 2x2 grid
  const gridClass =
    count === 1
      ? 'grid-cols-1'
      : count === 2
        ? 'grid-cols-2'
        : count === 3
          ? 'grid-cols-2'
          : 'grid-cols-2'

  return (
    <SectionWrapper testId="image-gallery-section" className="bg-surface-container-low">
      <div className={`grid ${gridClass} gap-4 md:gap-6`}>
        {imgs.map((item, i) => {
          const isSpanFull = count === 3 && i === 0

          return (
            <div
              key={i}
              className={`relative overflow-hidden rounded-lg ${isSpanFull ? 'col-span-2 aspect-[16/7]' : 'aspect-[4/5]'}`}
            >
              <Image
                src={urlFor(item.image!).url()}
                alt={item.alt ?? ''}
                fill
                className="object-cover"
                sizes={
                  count === 1
                    ? '(max-width: 1280px) 100vw, 1280px'
                    : isSpanFull
                      ? '(max-width: 1280px) 100vw, 1280px'
                      : '(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px'
                }
              />
            </div>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
