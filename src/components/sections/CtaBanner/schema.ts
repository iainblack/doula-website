import { defineType, defineField } from 'sanity'

export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'Call to Action Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'Optional. When provided, the image appears to the left of the text.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: r => r.required().max(100),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Heading Italic Phrase',
      type: 'string',
      description: 'Optional. A word or phrase within the heading to render in italic with primary colour.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      description: 'Optional. Supporting paragraph shown beneath the heading.',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary Button',
      type: 'cta',
      description: 'Optional. Main action button (e.g. "Book a Consultation")',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary Button',
      type: 'cta',
      description: 'Optional. Second button shown alongside the primary.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Call to Action Banner', subtitle: 'Call to Action Banner Section' }),
  },
})
