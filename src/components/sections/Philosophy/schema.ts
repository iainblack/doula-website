import { defineType, defineField } from 'sanity'

export const philosophy = defineType({
  name: 'philosophy',
  title: 'Philosophy & Experience',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: r => r.required().max(80),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 8,
      description: 'Separate paragraphs with a blank line between them.',
      validation: r => r.required(),
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'text',
      rows: 3,
      description: 'Optional. A highlighted quote shown with a left border accent below the body text.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Philosophy', subtitle: 'Philosophy & Experience Section' }),
  },
})
