import { defineType, defineField } from 'sanity'

export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'overline',
      title: 'Overline',
      type: 'string',
      description: 'Small label above the heading (e.g. "Holistic Support")',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: r => r.required().max(120),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon', type: 'string', description: 'Material icon name (e.g. "favorite", "star", "child_care")' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required().max(80) }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
            defineField({ name: 'linkLabel', title: 'Link Label', type: 'string' }),
            defineField({ name: 'linkUrl', title: 'Link URL', type: 'string' }),
          ],
          preview: {
            select: { title: 'title' },
            prepare: ({ title }) => ({ title: title || 'Feature', subtitle: 'Feature' }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Feature Grid', subtitle: 'Feature Grid Section' }),
  },
})
