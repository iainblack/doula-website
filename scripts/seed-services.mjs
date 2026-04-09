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

const [birthDoulaImageId, lactationImageId] = await Promise.all([
  uploadImage(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDnzZJk8FtS2e9cYh2OCcDE30Zw9Ko2-q_MkiCKB8wRZvVIfYpmUo6abYBDbU3dZ37LQ_YpmAgyUX8Ydqf_CtZbnIABYW_mdW8qIcF0XF6027j2pjHwIKOkFYFEX-P5V-3142p_XW5ffd9mREdTmzsbH7xPvsJ21jciwPjVnyfX2V6rr5wSRTJoQVo3-mxDo4wRMz2r5dCjsCIW8qmaz0N3S_0z_YQVG2MbxAeasDnPWAmJYbDXd1e2gUA2goQ30JVgoergbOwpoh8',
    'birth-doula-hands.jpg'
  ),
  uploadImage(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBdxWFIwY3xUWVWBUFq3vuctJJnykXwgj0XDODVK6rYwQL8pjyv7Xvhc6VNLkJy8P8HhidmiwYNkltXSxx9Qx0EXxjYxw3ZeqbqU-mBimPL3VU23hyRVnfO1859H-Xmoc9qj6T7mGz4Cv-zy2YlcpRNbTHk4iKI0HHN0id_UfFwrIdbq40uf1S_wnFsn53eW5TrOjK6RYiyg9bocNUXtzwnENq7bg5hlW9piArFe0UVJJv4GroQrtGB7g2ysmVlI0t9FDmMd_kkjag',
    'lactation-wellness.jpg'
  ),
])

console.log('Images uploaded. Seeding services page...')

await client.createOrReplace({
  _type: 'servicesPage',
  _id: 'servicesPage',
  seo: {
    _type: 'seo',
    title: 'Services | The Mindful Doula',
    description: 'Explore birth doula support, postpartum care, childbirth education, and lactation & wellness services.',
  },
  hero: {
    _type: 'hero',
    overline: 'Nurturing New Beginnings',
    headline: 'Our Support Options',
    body: 'Whether you are seeking physical support during labor, emotional guidance postpartum, or educational grounding, we are here to hold space for your journey.',
    compact: true,
  },
  serviceCards: {
    _type: 'serviceCards',
    services: [
      {
        _key: 'birth-doula',
        _type: 'object',
        icon: 'child_care',
        title: 'Birth Doula Support',
        body: 'Continuous physical, emotional, and informational support for the birthing person and their partner throughout the transformative experience of childbirth.',
        features: [
          'Two personalized prenatal visits',
          'On-call support from 38 weeks',
          'Continuous labor and delivery presence',
          'Immediate postpartum & breastfeeding help',
        ],
        pricingLabel: 'Investment',
        pricing: 'Starting at $1,800',
        ctaLabel: 'View Details',
        ctaUrl: '/contact',
        image: {
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: birthDoulaImageId },
          },
          alt: 'Gentle hands holding a newborn',
        },
      },
      {
        _key: 'postpartum-care',
        _type: 'object',
        icon: 'home_health',
        title: 'Postpartum Care',
        body: 'Nurturing the mother and family in the first weeks at home. Focusing on recovery, newborn care, and light household organization.',
        pullQuote: '"Bringing a sense of calm and order to the \'fourth trimester\' transition."',
        pricingLabel: 'Hourly Rate',
        pricing: '$45 / Hour',
      },
      {
        _key: 'childbirth-education',
        _type: 'object',
        icon: 'menu_book',
        title: 'Childbirth Education',
        body: 'Private or group sessions designed to empower you with knowledge about the physiological process and your choices.',
        features: [
          'Physiology of Labor & Birth',
          'Comfort Measures & Coping',
          'Partner Support Techniques',
        ],
        pricing: 'Private $350 | Group $150',
        ctaLabel: 'Learn More',
        ctaUrl: '/classes',
      },
      {
        _key: 'lactation-wellness',
        _type: 'object',
        title: 'Lactation & Wellness',
        body: 'Targeted support for breastfeeding challenges and holistic wellness during the early months of parenting.',
        image: {
          _type: 'imageWithAlt',
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: lactationImageId },
          },
          alt: 'Soothing natural scene',
        },
        sessions: [
          { _key: 'initial', _type: 'object', duration: '90 min', label: 'Initial Consult' },
          { _key: 'followup', _type: 'object', duration: '60 min', label: 'Follow-up Care' },
        ],
      },
    ],
  },
  faq: {
    _type: 'faq',
    heading: 'Frequently Asked Questions',
    faqs: [
      {
        _key: 'when-to-hire',
        _type: 'object',
        question: 'When should I hire a doula?',
        answer: 'Most families choose to hire a doula between 20-30 weeks of pregnancy, but we welcome you at any stage. Early booking ensures we have ample time for prenatal bonding and education.',
      },
      {
        _key: 'hospital-births',
        _type: 'object',
        question: 'Do you attend hospital births?',
        answer: 'Yes, we support births in hospitals, birthing centers, and home settings. Our goal is to support your choice of birthplace and healthcare provider.',
      },
      {
        _key: 'c-section',
        _type: 'object',
        question: 'What if I have a C-section?',
        answer: 'Doula support is invaluable for cesarean births. We provide support before surgery, help during recovery, and facilitate early skin-to-skin and breastfeeding in the recovery room.',
      },
    ],
  },
})

console.log('✓ Services page seeded successfully.')
