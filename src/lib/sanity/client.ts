import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
}

export const client = createClient({
  ...config,
  useCdn: true,
})

// Used in draft mode — stega encodes field values so the Presentation tool
// can identify which document/field each piece of text came from.
export const draftClient = createClient({
  ...config,
  useCdn: false,
  perspective: 'previewDrafts',
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
  token: process.env.SANITY_API_TOKEN,
})

// Used in server actions that need to write data (registrations, etc.)
// Never import this client-side.
export const writeClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_SEED_TOKEN,
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
