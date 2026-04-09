import { defineType, defineField } from 'sanity'

export const navbar = defineType({
  name: 'navbar',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'links',
      title: 'Nav Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Nav CTA',
      type: 'cta',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
})
