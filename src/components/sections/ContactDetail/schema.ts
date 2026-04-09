import { defineType, defineField } from 'sanity'

export const contactDetail = defineType({
  name: 'contactDetail',
  title: 'Contact Detail',
  type: 'object',
  fields: [
    defineField({ name: 'overline', title: 'Overline', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: r => r.required() }),
    defineField({ name: 'headlineEmphasis', title: 'Italic Emphasis (portion of headline)', type: 'string' }),
    defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 3 }),
    defineField({
      name: 'contactMethods',
      title: 'Contact Methods',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Material Symbol Icon', type: 'string' }),
            defineField({ name: 'label', title: 'Label (e.g. "Email")', type: 'string' }),
            defineField({ name: 'value', title: 'Display Value', type: 'string' }),
            defineField({ name: 'url', title: 'URL / href', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Contact Method', subtitle }),
          },
        },
      ],
    }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({ name: 'pullQuote', title: 'Pull Quote (on image overlay)', type: 'string' }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Contact Detail', subtitle: 'Contact Detail Section' }),
  },
})
