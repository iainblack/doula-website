import { defineType, defineField } from 'sanity'

export const testimonialGrid = defineType({
  name: 'testimonialGrid',
  title: 'Testimonial Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'overline', title: 'Overline (optional label above heading)', type: 'string' }),
            defineField({ name: 'rating', title: 'Rating (stars)', type: 'number', initialValue: 5 }),
            defineField({ name: 'quote', title: 'Pull Quote', type: 'string', validation: r => r.required() }),
            defineField({
              name: 'body',
              title: 'Body (paragraphs separated by blank line)',
              type: 'text',
              rows: 6,
            }),
            defineField({ name: 'attribution', title: 'Attribution Name', type: 'string' }),
            defineField({ name: 'attributionDetail', title: 'Attribution Detail (e.g. date/event)', type: 'string' }),
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{ type: 'imageWithAlt' }],
            }),
          ],
          preview: {
            select: { title: 'attribution', subtitle: 'quote' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Testimonial', subtitle }),
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Testimonial Grid', subtitle: 'Testimonial Grid Section' }),
  },
})
