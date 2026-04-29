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
console.log('  ✓ Image uploaded\n')

// ── Class documents ──────────────────────────────────────────────────────────

console.log('Seeding class documents...\n')

await client.createOrReplace({
  _type: 'class',
  _id: 'class-birthing-with-confidence',
  title: 'Birthing with Confidence',
  slug: { _type: 'slug', current: 'birthing-with-confidence' },
  description: "A comprehensive class covering the physiological process of birth, pain management techniques, and creating your mindful birth plan. We focus on building trust in your body's natural wisdom.",
  date: 'Saturday, October 12, 2024',
  time: '10:00 AM – 2:00 PM',
  location: 'Downtown Studio & Virtual',
  price: '$350',
  ctaLabel: 'Sign Up',
  attendeeLimit: 20,
})
console.log('  ✓ Birthing with Confidence')

await client.createOrReplace({
  _type: 'class',
  _id: 'class-partner-support',
  title: 'Partner Support',
  slug: { _type: 'slug', current: 'partner-support' },
  description: 'Specifically designed for birth partners. Learn hands-on comfort measures, advocacy skills, and how to provide emotional grounding during every stage of labor.',
  date: 'Sunday, October 20, 2024',
  time: '1:00 PM – 4:00 PM',
  location: 'Downtown Studio',
  price: '$175',
  ctaLabel: 'Sign Up',
  ctaUrl: '/contact',
})
console.log('  ✓ Partner Support')

await client.createOrReplace({
  _type: 'class',
  _id: 'class-newborn-care',
  title: 'Newborn Care',
  slug: { _type: 'slug', current: 'newborn-care' },
  description: 'Transitioning home with your little one. We cover breastfeeding basics, soothing techniques, safe sleep, and self-care for the fourth trimester.',
  date: 'Saturday, November 2, 2024',
  time: '10:00 AM – 1:00 PM',
  location: 'Virtual',
  price: '$225',
  ctaLabel: 'Sign Up',
  ctaUrl: '/contact',
})
console.log('  ✓ Newborn Care')

// ── Classes page ─────────────────────────────────────────────────────────────

console.log('\nSeeding classes page...')

await client.createOrReplace({
  _type: 'classesPage',
  _id: 'classesPage',
  seo: {
    _type: 'seo',
    title: 'Classes | The Mindful Doula',
    description: 'Empowering classes for expectant parents and birth partners. Learn birth preparation, partner support, and newborn care.',
  },
  hero: {
    _type: 'hero',
    overline: 'Educational Offerings',
    headline: 'Nurturing Knowledge for New Beginnings.',
    body: 'Preparation is the first step toward a mindful birth. Our curated classes are designed to empower you and your partner with confidence, calm, and connection.',
    image: {
      _type: 'imageWithAlt',
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: workshopImageId },
      },
      alt: 'Serene group class setting',
    },
    compact: false,
  },
  classList: {
    _type: 'classList',
    classes: [
      {
        _key: 'cl-1',
        class: { _type: 'reference', _ref: 'class-birthing-with-confidence' },
      },
      {
        _key: 'cl-2',
        class: { _type: 'reference', _ref: 'class-partner-support' },
      },
      {
        _key: 'cl-3',
        class: { _type: 'reference', _ref: 'class-newborn-care' },
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

console.log('  ✓ Classes page seeded\n')
console.log('✅ All classes seeded successfully.')
console.log('\nNext steps:')
console.log('  1. Go to localhost:3000/studio → Content → Classes to review and publish each document')
console.log('  2. Visit localhost:3000/classes to see the page')
