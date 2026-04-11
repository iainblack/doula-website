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
            defineField({ name: 'date', title: 'Date', type: 'string', description: 'Optional. e.g. Saturday, March 14, 2026' }),
            defineField({ name: 'time', title: 'Time', type: 'string', description: 'Optional. e.g. 10:00 AM – 12:00 PM' }),
            defineField({ name: 'location', title: 'Location', type: 'string', description: 'Optional. e.g. "123 Main St, Portland" or "Online via Zoom"' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, description: 'Optional. A short description of what the class covers.' }),
            defineField({ name: 'price', title: 'Price', type: 'string', description: 'Optional. e.g. "$75 per person"' }),
            defineField({ name: 'ctaLabel', title: 'Button Text', type: 'string', description: 'Optional. e.g. "Register Now", "Book Your Spot"' }),
            defineField({
              name: 'ctaUrl',
              title: 'Button Link',
              type: 'string',
              description: 'Optional. Use /contact for the contact page, or a full URL for an external booking link.',
            }),
            defineField({
              name: 'attendeeLimit',
              title: 'Attendee Limit',
              type: 'number',
              description: 'Optional. Maximum number of registrants. Leave blank to disable sign-up.',
            }),
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
