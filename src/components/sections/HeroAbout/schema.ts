import { defineType, defineField } from 'sanity'

export const heroAbout = defineType({
  name: 'heroAbout',
  title: 'Hero (About)',
  type: 'object',
  fields: [
    defineField({
      name: 'overline',
      title: 'Overline',
      type: 'string',
      description: 'Optional. Small tagline above the headline (e.g. "Warmth • Trust • Intention")',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: r => r.required().max(120),
    }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline Italic Phrase',
      type: 'string',
      description: 'Optional. A word or phrase within the headline to render in italic.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Headshot / Portrait',
      type: 'imageWithAlt',
      description: 'Optional. Portrait shown to the right of the text on desktop.',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero (About)', subtitle: 'Hero Section' }),
  },
})
