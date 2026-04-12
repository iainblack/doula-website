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
  if (!response.ok) throw new Error(`Failed to fetch image: ${url} (${response.status})`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename })
  console.log(`  Uploaded image: ${filename} → ${asset._id}`)
  return asset._id
}

console.log('Seeding service packages...\n')

// ── Birth Doula Support ──────────────────────────────────────────────────────
console.log('Creating: Birth Doula Support package...')
await client.createOrReplace({
  _type: 'servicePackage',
  _id: 'servicePackage-birth-doula',
  title: 'Birth Doula Support',
  slug: { _type: 'slug', current: 'birth-doula-support' },
  icon: 'child_care',
  tagline: 'Continuous, compassionate support before, during, and after your birth.',
  summary: 'Dedicated support through every stage of your birth journey — from late pregnancy through your first days postpartum.',
  pullQuote: null,
  description: [
    {
      _type: 'block',
      _key: 'intro',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro-span',
          text: 'Every birth is a sacred and powerful experience. As your birth doula, I provide unwavering physical, emotional, and informational support throughout your entire birth journey — from the final weeks of pregnancy through the first days postpartum.',
          marks: [],
        },
      ],
    },
    {
      _type: 'block',
      _key: 'body',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'body-span',
          text: 'Research consistently shows that continuous labor support from a trained doula leads to shorter labors, fewer interventions, and higher rates of satisfaction with the birth experience. But beyond the statistics, having a doula means you never face a challenging moment alone.',
          marks: [],
        },
      ],
    },
  ],
  features: [
    'Two prenatal visits (90 minutes each)',
    'On-call support from 38 weeks',
    'Continuous labor and birth support',
    'Comfort measures and positioning guidance',
    'Partner support and coaching',
    'One postpartum visit within 2 weeks',
    'Unlimited text and email support throughout',
    'Birth preferences review and planning',
  ],
  pricingLabel: 'Investment',
  pricing: 'Starting at $1,800',
  sessions: [
    { _key: 's1', duration: '2 × 90 min', label: 'Prenatal visits' },
    { _key: 's2', duration: 'On-call', label: 'From 38 weeks' },
    { _key: 's3', duration: 'Full labor', label: 'Continuous support' },
    { _key: 's4', duration: '1 × 60 min', label: 'Postpartum visit' },
  ],
  cta: {
    _type: 'cta',
    label: 'Book a Consultation',
    url: '/contact',
    style: 'primary',
    newTab: false,
  },
  seo: {
    _type: 'seo',
    title: 'Birth Doula Support | Continuous Labor Support',
    description:
      'Compassionate, continuous birth doula support before, during, and after your birth. Prenatal visits, on-call availability, and postpartum follow-up.',
  },
})
console.log('  ✓ Birth Doula Support created')

// ── Postpartum Doula Support ─────────────────────────────────────────────────
console.log('\nCreating: Postpartum Doula Support package...')
await client.createOrReplace({
  _type: 'servicePackage',
  _id: 'servicePackage-postpartum',
  title: 'Postpartum Doula Support',
  slug: { _type: 'slug', current: 'postpartum-doula-support' },
  icon: 'home_health',
  tagline: 'Expert newborn care and nurturing support for your growing family.',
  summary: 'In-home support for new families — newborn care, feeding guidance, rest for parents, and gentle reassurance as you settle in.',
  pullQuote: 'You deserve to be nurtured too. Let me hold the space while you rest.',
  description: [
    {
      _type: 'block',
      _key: 'intro',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro-span',
          text: 'The weeks following birth are both magical and demanding. Postpartum doula support provides your family with the practical help, emotional reassurance, and expert newborn guidance you need to settle into your new rhythm with confidence.',
          marks: [],
        },
      ],
    },
    {
      _type: 'block',
      _key: 'body',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'body-span',
          text: 'Whether you need daytime support to rest and recover, overnight care so you can sleep, or simply a knowledgeable presence to answer your questions — I am here. Sessions can be arranged flexibly to match your family\'s unique needs.',
          marks: [],
        },
      ],
    },
  ],
  features: [
    'Newborn care and feeding support',
    'Breastfeeding and bottle-feeding guidance',
    'Sibling adjustment support',
    'Light household help (laundry, meals)',
    'Emotional support and listening',
    'Resources and referrals as needed',
    'Flexible day or overnight sessions',
    'Evidence-based newborn information',
  ],
  pricingLabel: 'Rate',
  pricing: '$45 / Hour',
  sessions: [
    { _key: 's1', duration: '3-hour min', label: 'Daytime sessions' },
    { _key: 's2', duration: '8-hour', label: 'Overnight sessions' },
    { _key: 's3', duration: 'Flexible', label: 'Package bookings' },
  ],
  cta: {
    _type: 'cta',
    label: 'Book a Consultation',
    url: '/contact',
    style: 'primary',
    newTab: false,
  },
  seo: {
    _type: 'seo',
    title: 'Postpartum Doula Support | Newborn Care at Home',
    description:
      'In-home postpartum doula support for new families. Newborn care, breastfeeding guidance, emotional support, and practical household help.',
  },
})
console.log('  ✓ Postpartum Doula Support created')

// ── Childbirth Education ─────────────────────────────────────────────────────
console.log('\nCreating: Childbirth Education package...')
await client.createOrReplace({
  _type: 'servicePackage',
  _id: 'servicePackage-childbirth-education',
  title: 'Childbirth Education',
  slug: { _type: 'slug', current: 'childbirth-education' },
  icon: 'menu_book',
  tagline: 'Comprehensive preparation for an informed, empowered birth experience.',
  summary: 'Private, personalised childbirth education sessions at your pace — covering labor, comfort, interventions, and newborn care.',
  pullQuote: null,
  description: [
    {
      _type: 'block',
      _key: 'intro',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro-span',
          text: 'Knowledge is one of the greatest tools you can bring into your birth. My private childbirth education series gives you and your partner a deep, personalised understanding of the birth process — covering everything from early labor signs to navigating medical interventions.',
          marks: [],
        },
      ],
    },
    {
      _type: 'block',
      _key: 'body',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'body-span',
          text: 'Unlike group classes, private sessions move at your pace and focus on the topics most relevant to your specific circumstances, birth preferences, and concerns. Each session is designed to leave you feeling informed, prepared, and genuinely excited for your birth.',
          marks: [],
        },
      ],
    },
  ],
  features: [
    'Three 2-hour private sessions',
    'Stages of labor in depth',
    'Comfort measures and pain management',
    'Understanding interventions and options',
    'Partner roles and coaching techniques',
    'Newborn care basics',
    'Postpartum recovery overview',
    'Personalised birth preferences guidance',
  ],
  pricingLabel: 'Series Price',
  pricing: '$350 (3 sessions)',
  sessions: [
    { _key: 's1', duration: '2 hrs', label: 'Session 1: Labor Prep' },
    { _key: 's2', duration: '2 hrs', label: 'Session 2: Birth & Comfort' },
    { _key: 's3', duration: '2 hrs', label: 'Session 3: Newborn & Recovery' },
  ],
  cta: {
    _type: 'cta',
    label: 'Book a Consultation',
    url: '/contact',
    style: 'primary',
    newTab: false,
  },
  seo: {
    _type: 'seo',
    title: 'Childbirth Education | Private Classes for Expectant Parents',
    description:
      'Private childbirth education series covering labor stages, comfort measures, interventions, and partner coaching — tailored to your birth preferences.',
  },
})
console.log('  ✓ Childbirth Education created')

// ── Lactation & Wellness ─────────────────────────────────────────────────────
console.log('\nCreating: Lactation & Wellness package...')
await client.createOrReplace({
  _type: 'servicePackage',
  _id: 'servicePackage-lactation-wellness',
  title: 'Lactation & Wellness',
  slug: { _type: 'slug', current: 'lactation-and-wellness' },
  icon: 'spa',
  tagline: 'Targeted support for feeding and holistic wellness in early parenthood.',
  summary: 'One-on-one lactation consultations and wellness support to help you and your baby thrive in the first months of life.',
  pullQuote: null,
  description: [
    {
      _type: 'block',
      _key: 'intro',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'intro-span',
          text: 'Breastfeeding is a learned skill for both you and your baby. Whether you are navigating latch challenges, supply concerns, or simply want reassurance that everything is going well, targeted lactation support can make all the difference.',
          marks: [],
        },
      ],
    },
    {
      _type: 'block',
      _key: 'body',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'body-span',
          text: 'Sessions are offered in-home for your comfort and include a full feeding assessment, personalised guidance, and a written care plan. Follow-up support ensures that any adjustments are working well for your family.',
          marks: [],
        },
      ],
    },
  ],
  features: [
    'In-home feeding assessment',
    'Latch and positioning guidance',
    'Supply support and monitoring',
    'Bottle and paced feeding guidance',
    'Written care plan after each session',
    'Text support between visits',
  ],
  pricingLabel: 'Per Session',
  pricing: 'From $120',
  sessions: [
    { _key: 's1', duration: '90 min', label: 'Initial Consult' },
    { _key: 's2', duration: '60 min', label: 'Follow-up Care' },
    { _key: 's3', duration: 'Ongoing', label: 'Text support' },
  ],
  cta: {
    _type: 'cta',
    label: 'Book a Consultation',
    url: '/contact',
    style: 'primary',
    newTab: false,
  },
  seo: {
    _type: 'seo',
    title: 'Lactation & Wellness | Breastfeeding Support',
    description:
      'In-home lactation consultations covering latch, supply, and feeding assessment — with a personalised care plan and ongoing text support.',
  },
})
console.log('  ✓ Lactation & Wellness created')

console.log('\n✅ All service packages seeded successfully.')
console.log('\nNext steps:')
console.log('  1. Go to localhost:3000/studio → Service Packages to review and publish each document')
console.log('  2. On the Services page, set packageRef on each card to link to the detail page')
console.log('  3. Visit localhost:3000/services/birth-doula-support to see the detail page')
