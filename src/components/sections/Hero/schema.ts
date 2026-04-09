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
      description: 'Small label above the headline (e.g. "Birth Doula & Postpartum Support")',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: r => r.required().max(100),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline Italic Word/Phrase',
      type: 'string',
      description: 'A word or phrase from the headline to render in italic (e.g. "Journey")',
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'imageWithAlt',
    }),
    defineField({
      name: 'accentImage',
      title: 'Accent Image',
      type: 'imageWithAlt',
      description: 'Smaller overlapping image shown at bottom-left of the main image (desktop only)',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'cta',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'cta',
    }),
    defineField({
      name: 'hasGradientBg',
      title: 'Gradient Background',
      type: 'boolean',
      description: 'Enable the brand gradient background (primary → primary-container)',
      initialValue: false,
    }),
    defineField({
      name: 'compact',
      title: 'Compact Layout',
      type: 'boolean',
      description: 'Renders a simple centered text-only header — no min-height, no background strip. Used on interior pages like Services.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Hero Section' }),
  },
})
