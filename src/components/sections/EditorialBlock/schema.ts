import { defineType, defineField } from 'sanity'

export const editorialBlock = defineType({
  name: 'editorialBlock',
  title: 'Editorial Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: r => r.required().max(120),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      validation: r => r.required(),
    }),
    defineField({
      name: 'highlightText',
      title: 'Highlight Text',
      type: 'string',
      description: 'A short phrase displayed with emphasis (e.g. in a decorative callout)',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'text',
      rows: 2,
      description: 'An extracted quote displayed prominently alongside the body text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'Optional. When present, layout shifts to 2/3 text + 1/3 image.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Editorial Block', subtitle: 'Editorial Block Section' }),
  },
})
