/**
 * Seed script: Site Settings (Navbar + Footer)
 *
 * Populates the navbar and footer Sanity singleton documents.
 * Safe to re-run — uses createOrReplace.
 *
 * Run: npm run seed:settings
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

function navLink(key, label, url) {
  return { _key: key, _type: 'object', label, url }
}

async function seed() {
  console.log('\n🌱 Seeding Site Settings...\n')

  // ── Navbar ──────────────────────────────────────────────────────────────
  const navbarDoc = {
    _type: 'navbar',
    _id: 'navbar',
    links: [
      navLink('about', 'About', '/about'),
      navLink('services', 'Services', '/services'),
      navLink('classes', 'Classes & Workshops', '/classes'),
      navLink('testimonials', 'Testimonials', '/testimonials'),
      navLink('contact', 'Contact', '/contact'),
    ],
    cta: {
      _type: 'cta',
      label: 'Book a Consultation',
      url: '/contact',
      style: 'primary',
    },
  }

  console.log('Writing navbar...')
  const nav = await client.createOrReplace(navbarDoc)
  console.log(`✓ navbar created: ${nav._id}`)

  // ── Footer ──────────────────────────────────────────────────────────────
  const footerDoc = {
    _type: 'footer',
    _id: 'footer',
    links: [
      navLink('privacy', 'Privacy Policy', '/privacy'),
      navLink('contact', 'Contact', '/contact'),
    ],
    copyright: '© 2026 The Mindful Doula. All rights reserved.',
  }

  console.log('Writing footer...')
  const foot = await client.createOrReplace(footerDoc)
  console.log(`✓ footer created: ${foot._id}`)

  console.log('\nDone. Reload localhost:3000 to see the navbar and footer.')
}

seed().catch((err) => {
  console.error('\n✗ Seed failed:', err.message)
  process.exit(1)
})
