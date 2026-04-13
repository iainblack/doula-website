/**
 * Seed script: Site Theme
 *
 * Seeds the siteTheme singleton with the design token colours from globals.css.
 * Safe to re-run — uses createOrReplace.
 *
 * Run: npm run seed:theme
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

function color(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }
  const sv = max === 0 ? 0 : (max - min) / max
  return {
    _type: 'color',
    hex,
    alpha: 1,
    rgb: { _type: 'rgbaColor', r, g, b, a: 1 },
    hsl: { _type: 'hslaColor', h: Math.round(h * 360), s, l, a: 1 },
    hsv: { _type: 'hsvaColor', h: Math.round(h * 360), s: sv, v: max, a: 1 },
  }
}

async function seed() {
  console.log('\n🌱 Seeding Site Theme...\n')

  const doc = {
    _type: 'siteTheme',
    _id: 'siteTheme',
    colorPrimary:            color('#6d5b45'),
    colorPrimaryHover:       color('#54442e'),
    colorPrimaryForeground:  color('#ffffff'),
    colorBackground:         color('#fbf9f4'),
    colorSurface:            color('#fbf9f4'),
    colorForeground:         color('#1b1c19'),
    colorMuted:              color('#4d453d'),
    colorBorder:             color('#d0c5b9'),
  }

  console.log('Writing siteTheme...')
  const result = await client.createOrReplace(doc)
  console.log(`✓ siteTheme created: ${result._id}`)

  console.log('\nDone. Open /studio → Site-wide → Site Theme to verify.')
}

seed().catch((err) => {
  console.error('\n✗ Seed failed:', err.message)
  process.exit(1)
})
