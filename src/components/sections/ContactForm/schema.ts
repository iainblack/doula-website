import { defineType, defineField } from 'sanity'

export const contactForm = defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: r => r.required() }),
    defineField({ name: 'buttonLabel', title: 'Submit Button Label', type: 'string' }),
    defineField({
      name: 'subjectOptions',
      title: 'Subject Options',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
          preview: {
            select: { title: 'label' },
            prepare: ({ title }) => ({ title: title || 'Option' }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Contact Form', subtitle: 'Contact Form Section' }),
  },
})
