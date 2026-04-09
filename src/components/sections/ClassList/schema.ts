import { defineType, defineField } from 'sanity'

export const classList = defineType({
  name: 'classList',
  title: 'Class List',
  type: 'object',
  fields: [
    defineField({
      name: 'classes',
      title: 'Classes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
            defineField({ name: 'date', title: 'Date', type: 'string' }),
            defineField({ name: 'time', title: 'Time', type: 'string' }),
            defineField({ name: 'location', title: 'Location', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'price', title: 'Price', type: 'string' }),
            defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
            defineField({ name: 'ctaUrl', title: 'CTA URL', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'date' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Class', subtitle }),
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Class List', subtitle: 'Class List Section' }),
  },
})
