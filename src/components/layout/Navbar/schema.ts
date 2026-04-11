import { defineType, defineField } from 'sanity'

export const navbar = defineType({
  name: 'navbar',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'links',
      title: 'Nav Links',
      type: 'array',
      description: 'Optional. Links shown in the navigation bar.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              description: 'Use /about for internal pages, or a full URL (https://...) for external links.',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Link', subtitle }),
          },
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Header Button',
      type: 'cta',
      description: 'Optional. Button shown in the top-right of the navigation bar (e.g. "Book a Consultation")',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
})
