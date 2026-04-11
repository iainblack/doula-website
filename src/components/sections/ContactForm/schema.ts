import { defineType, defineField } from 'sanity'

export const contactForm = defineType({
  name: 'contactForm',
  title: 'Contact Form',
  type: 'object',
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'buttonLabel',
      title: 'Submit Button Label',
      type: 'string',
      description: 'Optional. Defaults to "Send Message" if left blank.',
    }),
    defineField({
      name: 'subjectOptions',
      title: 'Subject Options',
      type: 'array',
      description: 'Optional. Adds a dropdown to the form so people can pick what they\'re contacting you about. Leave empty to hide the dropdown.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'Text shown in the dropdown (e.g. "Birth Doula Services")' }),
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'Optional. Internal identifier — can match the label if unsure.' }),
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
