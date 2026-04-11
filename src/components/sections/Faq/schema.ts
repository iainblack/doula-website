import { defineType, defineField } from 'sanity'

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Optional. Section heading shown above the questions.',
    }),
    defineField({
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'question', title: 'Question', type: 'string', validation: r => r.required() }),
            defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 4, validation: r => r.required() }),
          ],
          preview: {
            select: { title: 'question' },
            prepare: ({ title }) => ({ title: title || 'Question', subtitle: 'FAQ Item' }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'FAQ', subtitle: 'FAQ Section' }),
  },
})
