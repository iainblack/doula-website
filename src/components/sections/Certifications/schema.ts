import { defineType, defineField } from 'sanity'

export const certifications = defineType({
  name: 'certifications',
  title: 'Certifications',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: r => r.required().max(80),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Optional. A short line shown beneath the heading.',
    }),
    defineField({
      name: 'items',
      title: 'Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'certificationItem',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Optional. Enter a Material Symbols icon name, e.g. verified_user, self_improvement. Browse icons at fonts.google.com/icons',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Optional. A short sentence about this certification.',
            }),
            defineField({
              name: 'certUrl',
              title: 'Certificate URL',
              type: 'url',
              description: 'Optional. Link to a PDF or certificate page. Shows a "View Certificate" link on the card.',
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Certification', subtitle }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Certifications', subtitle: 'Certifications Section' }),
  },
})
