import Image from 'next/image'
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { urlFor } from '@/lib/sanity/client'
import type { ImageGallery as ImageGalleryType } from '@/types/sanity.generated'

export function ImageGallery({ images }: ImageGalleryType) {
  if (!images?.length) return null

  return (
    <SectionWrapper testId="image-gallery-section" className="bg-surface-container-low">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {images.map((item, i) => item.image && (
          <div
            key={i}
            className="relative aspect-[4/5] rounded-lg overflow-hidden"
          >
            <Image
              src={urlFor(item.image).url()}
              alt={item.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 640px"
            />
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
