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
      description: 'Optional. A short phrase displayed in small caps above the heading.',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'text',
      rows: 2,
      description: 'Optional. A highlighted quote displayed prominently alongside the body text.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'Optional. When present, the layout shifts to two-thirds text and one-third image.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Editorial Block', subtitle: 'Editorial Block Section' }),
  },
})
