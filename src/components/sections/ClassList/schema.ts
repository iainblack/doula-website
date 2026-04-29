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
            defineField({
              name: 'class',
              title: 'Class',
              type: 'reference',
              to: [{ type: 'class' }],
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: 'class.title', subtitle: 'class.date' },
            prepare: ({ title, subtitle }) => ({
              title: title || 'Class',
              subtitle: subtitle || '',
            }),
          },
        },
      ],
      description: 'Add classes. Each one is managed as a separate document.',
    }),
  ],
  preview: {
    select: { classes: 'classes' },
    prepare: ({ classes }) => ({
      title: 'Class List',
      subtitle: `${(classes ?? []).length} classes`,
    }),
  },
})
