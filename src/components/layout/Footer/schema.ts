import { defineType, defineField } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'links',
      title: 'Footer Links',
      type: 'array',
      description: 'Optional. Links shown in the footer navigation.',
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
      name: 'copyright',
      title: 'Copyright Text',
      type: 'string',
      description: 'Optional. Defaults to "© [year] All rights reserved." if left blank.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Footer' }),
  },
})
