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
            defineField({ name: 'icon', title: 'Material Icon Name', type: 'string', description: 'e.g. "verified_user", "self_improvement"' }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'certUrl', title: 'Certificate URL', type: 'url', description: 'Link to PDF or certificate page' }),
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
