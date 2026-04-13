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
          ],
          preview: {
            select: { title: 'package.title', subtitle: 'package.variant' },
            prepare: ({ title, subtitle }) => ({
              title: title || 'Service Package',
              subtitle: subtitle || 'featured',
            }),
          },
        },
      ],
      description: 'Add service packages. Card layout is configured on each package.',
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
