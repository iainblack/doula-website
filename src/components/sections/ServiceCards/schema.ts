import { defineType, defineField } from 'sanity'

export const serviceCards = defineType({
  name: 'serviceCards',
  title: 'Service Cards',
  type: 'object',
  fields: [
    defineField({
      name: 'packages',
      title: 'Packages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'package',
              title: 'Service Package',
              type: 'reference',
              to: [{ type: 'servicePackage' }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'variant',
              title: 'Card Layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Featured (wide, image + checklist)', value: 'featured' },
                  { title: 'Compact (narrow, pull quote)', value: 'compact' },
                  { title: 'Highlighted (inverted, dark bg)', value: 'highlighted' },
                  { title: 'Media (sessions grid + image)', value: 'media' },
                ],
                layout: 'radio',
              },
              initialValue: 'featured',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: {
              title: 'package.title',
              subtitle: 'variant',
            },
            prepare: ({ title, subtitle }) => ({
              title: title || 'Service Package',
              subtitle: subtitle || 'featured',
            }),
          },
        },
      ],
      description: 'Add packages and choose a card layout for each.',
    }),
  ],
  preview: {
    select: { packages: 'packages' },
    prepare: ({ packages }) => ({
      title: 'Service Cards',
      subtitle: `${(packages ?? []).length} packages`,
    }),
  },
})
