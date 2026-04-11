import { defineType, defineField } from 'sanity'

export const testimonialsCtaBanner = defineType({
  name: 'testimonialsCtaBanner',
  title: 'Call to Action Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 2,
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
