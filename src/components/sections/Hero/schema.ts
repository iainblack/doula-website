import { defineType, defineField } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({
      name: 'overline',
      title: 'Overline',
      type: 'string',
      description: 'Optional. Small label above the headline (e.g. "Birth Doula & Postpartum Support")',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: r => r.required().max(100),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      description: 'Optional. Supporting paragraph shown beneath the headline.',
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline Italic Word/Phrase',
      type: 'string',
      description: 'Optional. Type a word or short phrase from the headline exactly as written — it will appear in italics on the live site.',
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'imageWithAlt',
      description: 'Optional. When provided, the layout shifts to text on the left and image on the right.',
    }),
    defineField({
      name: 'accentImage',
      title: 'Accent Image',
      type: 'imageWithAlt',
      description: 'Optional. Smaller overlapping image shown at bottom-left of the main image (desktop only).',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary Button',
      type: 'cta',
      description: 'Optional. Main action button shown in the hero (e.g. "Book a Consultation")',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary Button',
      type: 'cta',
      description: 'Optional. Second button shown alongside the primary button.',
    }),
    defineField({
      name: 'compact',
      title: 'Compact Layout',
      type: 'boolean',
      description: 'Use for interior pages (e.g. Services, About). Shows a shorter text-only header with no background strip or full-height layout.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Hero Section' }),
  },
})
