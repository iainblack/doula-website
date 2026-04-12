import { createClient } from '@sanity/client'
process.loadEnvFile('.env.local')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_SEED_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

console.log('Seeding services page...')

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
    packages: [
      {
        _key: 'card-birth-doula',
        _type: 'object',
        variant: 'featured',
        package: { _type: 'reference', _ref: 'servicePackage-birth-doula' },
      },
      {
        _key: 'card-postpartum',
        _type: 'object',
        variant: 'compact',
        package: { _type: 'reference', _ref: 'servicePackage-postpartum' },
      },
      {
        _key: 'card-childbirth-education',
        _type: 'object',
        variant: 'highlighted',
        package: { _type: 'reference', _ref: 'servicePackage-childbirth-education' },
      },
      {
        _key: 'card-lactation-wellness',
        _type: 'object',
        variant: 'media',
        package: { _type: 'reference', _ref: 'servicePackage-lactation-wellness' },
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
