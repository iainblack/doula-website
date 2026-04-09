import { defineType, defineField } from 'sanity'

export const serviceCards = defineType({
  name: 'serviceCards',
  title: 'Service Cards',
  type: 'object',
  fields: [
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Material Symbol Icon', type: 'string', description: 'e.g. child_care, home_health, menu_book' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 3 }),
            defineField({
              name: 'features',
              title: 'Feature List',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Checklist items (card 1) or bullet points (card 3)',
            }),
            defineField({ name: 'pullQuote', title: 'Pull Quote', type: 'string', description: 'Short italic quote shown in a tonal card (card 2)' }),
            defineField({ name: 'pricingLabel', title: 'Pricing Label', type: 'string', description: 'e.g. "Investment", "Hourly Rate"' }),
            defineField({ name: 'pricing', title: 'Pricing', type: 'string', description: 'e.g. "Starting at $1,800", "$45 / Hour"' }),
            defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
            defineField({ name: 'ctaUrl', title: 'CTA URL', type: 'string' }),
            defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
            defineField({
              name: 'sessions',
              title: 'Sessions',
              type: 'array',
              of: [{
                type: 'object',
                fields: [
                  defineField({ name: 'duration', title: 'Duration', type: 'string', description: 'e.g. "90 min"' }),
                  defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Initial Consult"' }),
                ],
                preview: {
                  select: { title: 'duration', subtitle: 'label' },
                  prepare: ({ title, subtitle }) => ({ title: title || 'Session', subtitle }),
                },
              }],
              description: 'Session types shown in a 2-column grid (card 4)',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'pricing' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Service', subtitle }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { services: 'services' },
    prepare: ({ services }) => ({
      title: 'Service Cards',
      subtitle: `${(services ?? []).length} services`,
    }),
  },
})
