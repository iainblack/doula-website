/**
 * Seed script: Contact Page
 *
 * Run: npm run seed:contact
 * Requires SANITY_SEED_TOKEN in .env.local (Editor permissions).
 * Safe to re-run — uses createOrReplace.
 */

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
  console.log(`Uploading: ${filename}`)
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeedScript/1.0)' },
  })
  if (!response.ok) throw new Error(`Failed to fetch: ${url} (${response.status})`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename })
  return asset._id
}

console.log('Seeding contact page...')

const img_contact = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCZgkIaWrBLuaoJVp97LlwktsL8v9w-s8K26VSTcPh5s2an_v4e5AazF8fGSvUFbmzzKFNN9aLv4wg0n2_A0838ki1Jv3WAyM8JOTL_TiWi2u4DmaK8UGAK2Cf0nOJRpdb83nu5QCBqc0DkG-XND1Vy1s89flwRf_Wcfk6YdqztvVZhRbofkDyFlvGzUBLd9OJq81Cyfa5Hz0V9Ndq1xr8f4OlS88TkVxVCuJbA3eo3GhKHIgVokUfSfvlzmp3wVunCxJoqznj8SSs',
  'contact-hero.jpg'
)

await client.createOrReplace({
  _type: 'contactPage',
  _id: 'contactPage',

  contactDetail: {
    _type: 'contactDetail',
    overline: 'Inquiry',
    headline: "Let's start this journey together.",
    headlineEmphasis: 'journey together.',
    body: "Whether you're just starting to explore your options or you're ready to secure support for your upcoming birth, I am here to hold space for your questions.",
    contactMethods: [
      {
        _key: 'method-email',
        _type: 'object',
        icon: 'mail',
        label: 'Email',
        value: 'hello@mindfuldoula.com',
        url: 'mailto:hello@mindfuldoula.com',
      },
      {
        _key: 'method-social',
        _type: 'object',
        icon: 'favorite',
        label: 'Social',
        value: '@themindfuldoula',
        url: '#',
      },
    ],
    image: {
      _type: 'imageWithAlt',
      image: { _type: 'image', asset: { _type: 'reference', _ref: img_contact } },
      alt: "Mother's hands holding a newborn",
    },
    pullQuote: 'The support you receive during birth echoes throughout your entire motherhood.',
  },

  contactForm: {
    _type: 'contactForm',
    heading: 'Send a Message',
    buttonLabel: 'Send Message',
    subjectOptions: [
      { _key: 'opt-birth', _type: 'object', label: 'Birth Support Inquiry', value: 'birth-support' },
      { _key: 'opt-postpartum', _type: 'object', label: 'Postpartum Care', value: 'postpartum' },
      { _key: 'opt-classes', _type: 'object', label: 'Classes & Workshops', value: 'classes' },
      { _key: 'opt-other', _type: 'object', label: 'General Inquiry', value: 'other' },
    ],
  },
})

console.log('✓ Contact page seeded successfully')
