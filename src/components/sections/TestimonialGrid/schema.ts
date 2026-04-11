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
            defineField({
              name: 'overline',
              title: 'Overline',
              type: 'string',
              description: 'Optional. Small label shown above the quote (Gallery layout only).',
            }),
            defineField({ name: 'rating', title: 'Rating (stars)', type: 'number', initialValue: 5 }),
            defineField({ name: 'quote', title: 'Pull Quote', type: 'string', validation: r => r.required() }),
            defineField({
              name: 'body',
              title: 'Full Review',
              type: 'text',
              rows: 6,
              description: 'Optional. Full testimonial text. Separate paragraphs with a blank line.',
            }),
            defineField({
              name: 'attribution',
              title: 'Attribution Name',
              type: 'string',
              description: 'Optional. Name of the person being quoted.',
            }),
            defineField({
              name: 'attributionDetail',
              title: 'Attribution Detail',
              type: 'string',
              description: 'Optional. Extra context shown beneath the name (e.g. "Birth client, June 2024")',
            }),
            defineField({
              name: 'variant',
              title: 'Card Layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Asymmetric (text left, image grid right)', value: 'asymmetric' },
                  { title: 'Editorial (centered card)', value: 'editorial' },
                  { title: 'Gallery (image grid left, text right)', value: 'gallery' },
                ],
                layout: 'radio',
              },
              initialValue: 'asymmetric',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{ type: 'imageWithAlt' }],
              description: 'Optional. Up to 4 images displayed in a grid beside the testimonial text.',
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
