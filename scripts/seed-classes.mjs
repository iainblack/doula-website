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

const workshopImageId = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBijOHv2WOKzAHOAywaubfogkD1LtwJzd_y_IAnDRs37o_xpM0s-4gg3IGTL6hz9n5hf7Da1RVymEWy5-xed2HJ_G5wPOThirLx18QJ1aA1sSLBbUfh0-ox8v0NvxOxqwa2YdZ5PBNYKld2HfUgjJMKGMBM9oqj0IRb_GPVcbaYFZKXtHQK1U5TVu5q0Y0DXna5Fz3BCKs1x6HmFrTj9xgINSM_d1QH44wQR3hPfN7FDHYWi6sPF37GnOkxKb2BO49frvD5dxNOTwg',
  'workshop-group.jpg'
)

console.log('Image uploaded. Seeding classes page...')

await client.createOrReplace({
  _type: 'classesPage',
  _id: 'classesPage',
  seo: {
    _type: 'seo',
    title: 'Classes & Workshops | The Mindful Doula',
    description: 'Empowering workshops for expectant parents and birth partners. Learn birth preparation, partner support, and newborn care with The Mindful Doula.',
  },
  hero: {
    _type: 'hero',
    overline: 'Educational Offerings',
    headline: 'Nurturing Knowledge for New Beginnings.',
    body: 'Preparation is the first step toward a mindful birth. Our curated workshops are designed to empower you and your partner with confidence, calm, and connection.',
    image: {
      _type: 'imageWithAlt',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: workshopImageId },
      },
      alt: 'Serene group workshop setting',
    },
    compact: false,
  },
  classList: {
    _type: 'classList',
    classes: [
      {
        _key: 'class-1',
        title: 'Birthing with Confidence',
        date: 'Oct 12th, 2024',
        time: '10:00 AM - 2:00 PM',
        location: 'Downtown Studio & Virtual',
        description: 'A comprehensive workshop covering the physiological process of birth, pain management techniques, and creating your mindful birth plan. We focus on building trust in your body\'s natural wisdom.',
        price: '$350.00',
        ctaLabel: 'Sign Up',
        ctaUrl: '/contact',
      },
      {
        _key: 'class-2',
        title: 'Partner Support',
        date: 'Oct 20th, 2024',
        time: '1:00 PM - 4:00 PM',
        location: 'Downtown Studio',
        description: 'Specifically designed for birth partners. Learn hands-on comfort measures, advocacy skills, and how to provide emotional grounding during every stage of labor.',
        price: '$175.00',
        ctaLabel: 'Sign Up',
        ctaUrl: '/contact',
      },
      {
        _key: 'class-3',
        title: 'Newborn Care',
        date: 'Nov 2nd, 2024',
        time: '10:00 AM - 1:00 PM',
        location: 'Virtual Workshop',
        description: 'Transitioning home with your little one. We cover breastfeeding basics, soothing techniques, safe sleep, and self-care for the fourth trimester.',
        price: '$225.00',
        ctaLabel: 'Sign Up',
        ctaUrl: '/contact',
      },
    ],
  },
  newsletterSignup: {
    _type: 'newsletterSignup',
    heading: 'Not sure where to start?',
    body: "Join our mailing list to receive our 'Guide to Mindful Birth' and be the first to know about new class dates.",
    buttonLabel: 'Subscribe',
  },
})

console.log('Seeded classes page successfully.')
