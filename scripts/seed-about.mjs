import { createClient } from '@sanity/client'
process.loadEnvFile('.env.local')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_SEED_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function uploadImage(url, filename) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeedScript/1.0)' },
  })
  if (!response.ok) throw new Error(`Failed to fetch: ${url} (${response.status})`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename })
  return asset._id
}

console.log('Uploading images...')

const [headshotId, ctaImageId] = await Promise.all([
  uploadImage(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCxENf7jy_so3raI3iIi4wFZNvPP9M5ShaDk-CfJJI7jid4FgB7Y4Lwxu9OW51iqS53Ou5CyMdduRGnFKBXwL9Vsjc3hDredp6BXC9p5qgEMBHACjXKsAWt-3Ec9USKfydM4Z0u25qQWy6WIXlWyldzFpQNUX_GSltSI2Y-a7DXl1dH7bHspc48Ew2oW-7oNlWTmGywT62BbNjV-DSRcnXjusVemk4RnnLtrXihZOdotIgonK1UrVlWSE7wKY0wHk89YYpfhy-DrQY',
    'about-headshot.jpg'
  ),
  uploadImage(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsNBRKKlI7facILqmEulZ6nSv3eqxdNuk4s0tlY3ljLuSVv6kyrIWzmomDfGK1q-mzustA7PyA7v9Pb3B1OZUJWlR2Vv4uqfoGelInVfvGvPOPNvwjL6W3MtzrzPUw4UmIgnGlAolcFbWNqXrD5EZ03ki740Cm6GEQYVLkG4GksuQe3pwhDeWJH21C_9HYQftCPfHdsznFa2Dj8Yt2oC3PS7c3gFdNDQi9kONybYIi7lrC_cGKR6mB7CMA9cNH24HNAlLrZUDlJkc',
    'about-cta-hands.jpg'
  ),
])

console.log('Images uploaded. Seeding aboutPage document...')

await client.createOrReplace({
  _type: 'aboutPage',
  _id: 'aboutPage',

  hero: {
    overline: 'Warmth • Trust • Intention',
    headline: 'Meet Your Guide Through the Sacred Transition.',
    headlineEmphasis: 'Sacred Transition',
    body: 'I believe that every birth is a transformative journey that deserves to be held with reverence, knowledge, and unwavering support.',
    image: {
      _type: 'imageWithAlt',
      image: { _type: 'image', asset: { _type: 'reference', _ref: headshotId } },
      alt: 'Professional and warm headshot of a doula',
    },
  },

  philosophy: {
    heading: 'My Philosophy & Experience',
    body: 'With over a decade of experience supporting families in both hospital and home settings, my approach is rooted in the "Mindful Editorial" of care—blending evidence-based practices with a deep intuitive presence.\n\nI don\'t just provide physical support; I help you curate an environment where you feel empowered to make informed decisions for your body and your baby. My background in prenatal yoga and nutritional counseling allows me to offer a holistic perspective that begins long before labor starts.',
    pullQuote: 'The way we are born, and the way we give birth, leaves an imprint for a lifetime. Let\'s make it one of strength and peace.',
  },

  certifications: {
    heading: 'Professional Certifications',
    subheading: 'Validated expertise for your peace of mind.',
    items: [
      {
        _key: 'cert1',
        _type: 'object',
        icon: 'verified_user',
        title: 'Certified Birth Doula',
        description: 'DONA International certified with 500+ births attended in various settings.',
      },
      {
        _key: 'cert2',
        _type: 'object',
        icon: 'self_improvement',
        title: 'Yoga Instructor',
        description: 'RYT-200 specialized in Prenatal and Postpartum flow and restorative practices.',
      },
      {
        _key: 'cert3',
        _type: 'object',
        icon: 'nutrition',
        title: 'Lactation Counselor',
        description: 'Certified specialist supporting your unique breastfeeding and feeding journey.',
      },
      {
        _key: 'cert4',
        _type: 'object',
        icon: 'history_edu',
        title: 'B.S. Maternal Health',
        description: 'Academic foundation in reproductive physiology, psychology, and public health.',
      },
      {
        _key: 'cert5',
        _type: 'object',
        icon: 'baby_changing_station',
        title: 'Newborn Care Specialist',
        description: 'Advanced training in infant sleep patterns and early development care.',
      },
    ],
  },

  testimonialQuote: {
    quote: 'Sarah wasn\'t just a doula; she was the anchor for our entire family. Her calm presence in the delivery room allowed me to fully surrender to the process, knowing I was safe and understood.',
    attribution: 'Elena & James, Portland',
    hasPillBackground: true,
  },

  ctaBanner: {
    image: {
      _type: 'imageWithAlt',
      image: { _type: 'image', asset: { _type: 'reference', _ref: ctaImageId } },
      alt: 'Gentle hands holding a newborn baby\'s feet',
    },
    heading: 'Let\'s see if we\'re a heart-match.',
    headlineEmphasis: 'heart-match',
    body: 'Choosing a birth partner is a deeply personal decision. I offer complimentary 30-minute consultations to discuss your vision and ensure my style aligns with your needs.',
    primaryCta: { _type: 'cta', label: 'Let\'s Connect', url: '/contact' },
    secondaryCta: { _type: 'cta', label: 'View Packages', url: '/services' },
  },
})

console.log('✓ aboutPage seeded successfully.')
