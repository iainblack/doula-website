/**
 * Seed script: Testimonials Page
 *
 * Populates the testimonialsPage Sanity document with content from the
 * Stitch design. Images are downloaded from Stitch and uploaded to Sanity.
 *
 * Run: npm run seed:testimonials
 *
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

console.log('Seeding testimonials page...')

// Upload images
const img_t1_newborn = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBN9YKuQ4daZqzrneqPhwzprJjTFx9no0IP1X9EzoyMUX1BJpRFPO5-2Zcg17g2Z7PvR7FqLygjR9TUbKIAScIKrj65jEzeVOez2GNdzM4D0N-Zcmur6aRY73JuilMYMW8EwLXTdNOrAI4DYGNvHGCktn6ddZnxoxF8K4AB5FxQQck5QdPRmUFhD9DwaEj_cu462zY0X4cNkWvR9p0KZ0YmMXZo4agGpOXgvvYcWb9dr0KbEzZX_EZKSurih_hWDKglOCKgcslOBOc',
  'testimonial-1-newborn.jpg'
)
const img_t1_parents = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC9v6i3r_9K0w7lVARr0ALI7IltekB4hxPRY4ZUMHEjdRvuAUUKMGCmScAO_FLHcZMJQzzpwfK4xz2f6PzNNP2UImlyrXM6_bxmezfSCLVqmmH3OITXT_bFgp2gSyNkJ5YYWYM9tTSqM_j2DF6YqHMXtZ40W_fIN7xVHrjPY7BlobLVqywB8xg5Sw5LxgGphAa4pXJFHVvOHR45SkL5HZ5tI8BdPd9Qcv3QNRcso3Rr2X3jM98WP9qkZRnH4dt7I2Vx7d_jHaO2WxQ',
  'testimonial-1-parents.jpg'
)
const img_t1_feet = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSWd6I-oayiA-4q7tsiR2WjuDBcCNWZQ_wmO5VFjsKuHFU7sZiiaPWP-nCQb37wBInVytNur22h2tHT5I6BKn7xipJXV1Eq6HPNAFhOZUY9KySBHS4DWir8QUWsFIc-OmoQCxuEMmK-kLYv988gu43p5TjQtYcy184cDDcKtMu0fmlWQueOqDyRRKeTgTui1LoVFn9X24lNxAT89xmsmt9kK3UyIydZY1kO16jlD4Pcx-aZxy71zqlsO3nfVR1vh8oP_FOILHtOSw',
  'testimonial-1-feet.jpg'
)
const img_t2_sarah = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAT3qF_7B7ptcfbQowf3pZjWoBw4m1Q9hvKyEj4U-_LnDiQwQ5DJL9Pg3Oof33bWnHF2YUBgiNB8h89R0CiTygFMNB1t5lujXFc1DmOdKsu6Po7-EOoAGi8g1VY6gvg8jEXEDap3JBVtzXj1zA0JZzUnpoW9cKmlV5y6A4Ob2Gn2RP7bzb7Ia8yNTPUcGj-_z1Zox_T4QTR8fLwx55M9_6cWGUIfJSncPZ3Rpo0jSLBRT7bhfTb2GTxp45SAchCldQZkxyjhUlNusA',
  'testimonial-2-sarah.jpg'
)
const img_t3_couple = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCQhIVBzc3KfQNeuAQTJhkdMSF14iswi4pTd3CNcgJ0dQ0sQKq7woF3293v0-6jWXudnmBjLdHNF4iOFtJL-nnOmmP53c5sUSSFfKwpmyZbojaRyWXP_tbV37ljEqNdgO93HcG4csXR2BUGEW4WNnLBOTkC18oClY2Q67aF-UHuX36KhVnpy9bZ-gWqnDKeUkC1iC874r79IUsnoeF83cP4Yn4p5X7plQPRPKqOpt8pNojk3Cftqx-GhTg2Rk6nXsdoHVXneDp-IRY',
  'testimonial-3-couple.jpg'
)
const img_t3_crib = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDSKmlwuDB5jluqLjUdljWsGUA19o_YryInWC7g74FitJMcnjkIO3d5GCk7pCpAVJMTkMQg5fKe13CL5uJ2jwAfXjeBSmciUpX9MNSndB3NSaTa0kp0S_xmqQ8xtKdiGKLTPLltwCM18KY9a7Kvaqw3sDRy0ZfZwPKSYi6WKxUqNhyvjPH7F7LqHj7DisDTmkbzLEbqldB5q8vJkRXghUNl-TtV7Sj_xlJY6EB78LVAuuxOTaeOrd73JdNm-jzR6Xt_cdwWZFhiHoU',
  'testimonial-3-crib.jpg'
)
const img_t3_family = await uploadImage(
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCMOwgCMUHtyFOj1ZB0lPI0PacYelahLZUcvTvGriTOc2IzKJsVwO7dXyTy68DImbhN967eBptf4G1ueZ-ZjvfsujbEzUyL6JcCKTuAzT-3SiOrNnw54C6cj4AuBfNFC-QnuDT04t_P01bctvs3EWdYMDAEjDx6BapPjRdJP7ijLAao-UV8kY1ZQT51nusHuCdcGJb3OIm0HabQs5zMICD69jnaxRKNrOntETS984UbliwaVVsF8V9M6wYmCYpck_-s1RzK9dk7p4s',
  'testimonial-3-family.jpg'
)

function imageRef(assetId) {
  return { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
}

await client.createOrReplace({
  _type: 'testimonialsPage',
  _id: 'testimonialsPage',

  hero: {
    _type: 'hero',
    overline: 'Kind Words',
    headline: 'Shared Journeys',
    body: "Every birth is a unique tapestry of strength and love. Here are the stories of the families I've had the honor of supporting through their transition into parenthood.",
    compact: true,
  },

  testimonialGrid: {
    _type: 'testimonialGrid',
    testimonials: [
      {
        _key: 'testimonial-1',
        rating: 5,
        quote: 'A presence of pure calm in the midst of our most intense moments.',
        body: `Working with Elena was the best decision we made for our first birth. From our initial prenatal meetings, she helped us navigate the complexities of our birth plan with zero judgment and infinite wisdom. When labor started, her presence transformed our hospital room into a sanctuary.\n\nHer hands-on support during the transition phase was invaluable, but it was her emotional grounding that kept us centered. She didn't just support me; she empowered my partner to be an active, confident participant in the process. We couldn't imagine our daughter's arrival without her gentle guidance.`,
        attribution: 'The Thompson Family',
        attributionDetail: 'Arrival of Baby Mia, June 2023',
        images: [
          {
            _key: 'img-t1-1',
            _type: 'imageWithAlt',
            image: imageRef(img_t1_newborn),
            alt: 'Newborn baby wrapped in soft blanket',
          },
          {
            _key: 'img-t1-2',
            _type: 'imageWithAlt',
            image: imageRef(img_t1_parents),
            alt: 'Parents holding newborn',
          },
          {
            _key: 'img-t1-3',
            _type: 'imageWithAlt',
            image: imageRef(img_t1_feet),
            alt: "Detail of baby's feet",
          },
        ],
      },
      {
        _key: 'testimonial-2',
        rating: 5,
        quote: 'She helped me find a strength I didn\'t know I possessed.',
        body: `As a single mother by choice, I was terrified of the labor process without a traditional partner. Elena didn't just fill that gap; she became the bedrock of my support system. Her evidence-based approach calmed my anxieties, and her advocacy in the delivery room ensured my voice was always heard.\n\nPost-partum, her visits were a lifesaver. She helped me navigate breastfeeding challenges with so much patience and grace. I never felt judged, only nurtured. She truly lives up to the name 'The Mindful Doula'.`,
        attribution: 'Sarah Jenkins & Baby Leo',
        attributionDetail: 'Home Birth Journey, August 2023',
        images: [
          {
            _key: 'img-t2-1',
            _type: 'imageWithAlt',
            image: imageRef(img_t2_sarah),
            alt: 'Sarah M.',
          },
        ],
      },
      {
        _key: 'testimonial-3',
        overline: 'Empowered Birth',
        rating: 5,
        quote: 'Finding Peace in the Unpredictable',
        body: `Our birth didn't go according to our original 'Plan A'. When medical interventions became necessary, we could have easily spiraled into fear. However, Elena stayed right by our side, explaining every option and helping us make informed decisions that kept us feeling in control.\n\nShe brought a sense of ritual and sacredness even to the hospital setting. Her postpartum support, especially the nourishing meals she brought, helped us transition into our new life with so much ease. She is truly a gifted healer and a wonderful doula.`,
        attribution: 'Mark & Elena Rivera',
        attributionDetail: 'VBAC Success, October 2023',
        images: [
          {
            _key: 'img-t3-1',
            _type: 'imageWithAlt',
            image: imageRef(img_t3_couple),
            alt: 'Expecting couple',
          },
          {
            _key: 'img-t3-2',
            _type: 'imageWithAlt',
            image: imageRef(img_t3_crib),
            alt: 'Baby in crib',
          },
          {
            _key: 'img-t3-3',
            _type: 'imageWithAlt',
            image: imageRef(img_t3_family),
            alt: 'Family embrace',
          },
        ],
      },
    ],
  },

  ctaBanner: {
    _type: 'testimonialsCtaBanner',
    heading: 'Ready to begin your journey?',
    body: 'I would be honored to hold space for your growing family. Let\'s connect and see how I can support your unique path.',
    primaryCta: { _type: 'cta', label: 'Schedule a Consultation', url: '/contact', style: 'primary', newTab: false },
    secondaryCta: { _type: 'cta', label: 'View All Services', url: '/services', style: 'secondary', newTab: false },
  },
})

console.log('✓ Testimonials page seeded successfully')
