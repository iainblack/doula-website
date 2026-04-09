import { defineType, defineField } from 'sanity'

export const newsletterSignup = defineType({
  name: 'newsletterSignup',
  title: 'Newsletter Signup',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'buttonLabel',
      title: 'Button Label',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Newsletter Signup', subtitle: 'Newsletter Signup Section' }),
  },
})
