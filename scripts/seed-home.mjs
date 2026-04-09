/**
 * Seed script: Home Page
 *
 * Populates the homePage Sanity document with content extracted from the
 * Stitch design. Images are downloaded from Stitch and uploaded to Sanity.
 *
 * Run: node scripts/seed-home.mjs
 *
 * Requires SANITY_SEED_TOKEN in .env.local (Editor permissions).
 * Safe to re-run — uses createOrReplace so it won't create duplicates.
 */

import { createClient } from '@sanity/client'

// Load .env.local
process.loadEnvFile('.env.local')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_SEED_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ── Helpers ────────────────────────────────────────────────────────────────

async function uploadImage(url, filename) {
  console.log(`  Uploading ${filename}...`)
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeedScript/1.0)' },
  })
  if (!response.ok) throw new Error(`Failed to fetch image: ${url} (${response.status})`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename })
  console.log(`  ✓ ${filename} → ${asset._id}`)
  return asset._id
}

function imageWithAlt(assetId, alt) {
  return {
    _type: 'imageWithAlt',
    image: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
    },
    alt,
  }
}

function cta(label, url, style = 'primary') {
  return { _type: 'cta', label, url, style }
}

function feature(key, icon, title, description, linkLabel, linkUrl) {
  return { _key: key, icon, title, description, linkLabel, linkUrl }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 Seeding Home Page...\n')

  // Upload images from Stitch
  console.log('Uploading images:')
  const [heroImageId, accentImageId] = await Promise.all([
    uploadImage(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCAAj6w_pjnYzL_F1wgSxZ8VWtxhUF8M9EekzKvXaz1buY_f99t9G0yIiJyi87Rja1rZZFQ24zUjvlVRStreiOTMyXznb8-aX_w8ao_BXHBnpOW7cMBYiwjcWsMt_lkBcQ6HsJ0T7uIANEfO_jM6hbfu9g1Kw4GkCTq4c2eQfyTMR5HjRUfmlvxmh_pxV70X58NCXNhvn4w4ylkWM7PaQUHT-ONrXcyI3Wo_l6JBQ7_QlfSFNajhBwZ4XosWZGew8jF9C-ui4NW78M',
      'home-hero-main.jpg'
    ),
    uploadImage(
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCRQTWmlJPbP7AAN3-hRCcdDf4I199F0z_K1My0c4dj3AYHT4SsY9X7NQzPVkYZUHAnh1ITWqgMojlxXpqgLwU__oXnlZUs-mUN1dF1Yvqk4eHb5ujz7n5hZlMg6Ny4RvFVgG8QuhGxhYiKLVUmfZ21CXjItunAkpLYkii6L7rj6nckjSWnYF7ZarUHO5yCil023KprOGP4BI-O3eEFCG-omcz4aCrXEqGR5Ot8y95niHI3yjV7j2FC454k2EEk_uPWaXnwkaM3gJs',
      'home-hero-accent.jpg'
    ),
  ])

  // Build document
  const doc = {
    _type: 'homePage',
    _id: 'homePage',

    hero: {
      _type: 'hero',
      overline: 'Nurturing New Beginnings',
      headline: 'Nurturing Your Journey Into Motherhood',
      headlineEmphasis: 'Journey',
      body: 'Supporting families through the transformative experience of birth and postpartum with intention, wisdom, and compassionate care.',
      image: imageWithAlt(heroImageId, 'Serene moment of pregnancy'),
      accentImage: imageWithAlt(accentImageId, 'Quiet nursery scene'),
      primaryCta: cta('Explore Services', '/services'),
      secondaryCta: cta('Book a Consultation', '/contact', 'ghost'),
    },

    editorialBlock: {
      _type: 'editorialBlock',
      heading: 'What Makes Me Unique',
      body: 'My approach is a harmonious blend of evidence-based clinical knowledge and deeply intuitive, heart-centered support. I believe that when you are equipped with both informed advocacy and a grounding, intuitive presence, you can truly step into your power as you transition into parenthood with emotional safety and confidence.',
    },

    featureGrid: {
      _type: 'featureGrid',
      overline: 'Holistic Support',
      heading: 'How I Can Walk With You',
      features: [
        feature('birth-doula', 'pregnant_woman', 'Birth Doula Support',
          'Continuous physical and emotional support throughout labor and delivery, ensuring your voice is heard.',
          'Learn more', '/services'),
        feature('postpartum', 'baby_changing_station', 'Postpartum Care',
          'Nurturing the "fourth trimester" with infant care education, breastfeeding support, and home settling.',
          'Learn more', '/services'),
        feature('mindful-prep', 'self_improvement', 'Mindful Prep',
          'Private sessions focused on mindfulness, breathing techniques, and releasing fears before birth.',
          'Learn more', '/services'),
      ],
    },

    testimonialQuote: {
      _type: 'testimonialQuote',
      quote: 'Sarah was the calm in the middle of a storm. She provided a sense of peace that allowed us to fully embrace the birth of our daughter.',
      attribution: 'The Miller Family',
    },
  }

  console.log('\nWriting document to Sanity...')
  const result = await client.createOrReplace(doc)
  console.log(`✓ homePage created: ${result._id}\n`)
  console.log('Done. Reload localhost:3000 to see the seeded content.')
}

seed().catch((err) => {
  console.error('\n✗ Seed failed:', err.message)
  process.exit(1)
})
