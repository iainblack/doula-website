import { defineType, defineField } from 'sanity'
import { MaterialIconPicker } from '../../../sanity/components/MaterialIconPicker'

export const contactDetail = defineType({
  name: 'contactDetail',
  title: 'Contact Detail',
  type: 'object',
  fields: [
    defineField({
      name: 'overline',
      title: 'Overline',
      type: 'string',
      description: 'Optional. Small label above the headline (e.g. "Let\'s Connect")',
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'headlineEmphasis',
      title: 'Headline Italic Phrase',
      type: 'string',
      description: 'Optional. A word or phrase within the headline to render in italic.',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 3,
      description: 'Optional. Supporting paragraph shown beneath the headline.',
    }),
    defineField({
      name: 'contactMethods',
      title: 'Contact Methods',
      type: 'array',
      description: 'Phone, email, location, and any other ways people can reach you.',
      validation: (r) => r.required().min(1),
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              components: { input: MaterialIconPicker },
            }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'Optional. e.g. "Email", "Phone", "Location"' }),
            defineField({ name: 'value', title: 'Display Text', type: 'string', description: 'The text shown to visitors, e.g. "hello@example.com"' }),
            defineField({
              name: 'url',
              title: 'Link',
              type: 'string',
              description: 'Optional. Use mailto:hello@example.com for email, tel:+1... for phone, or a full URL.',
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
            prepare: ({ title, subtitle }) => ({ title: title || 'Contact Method', subtitle }),
          },
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'Optional. Portrait shown to the right of the contact details.',
    }),
    defineField({
      name: 'pullQuote',
      title: 'Pull Quote',
      type: 'string',
      description: 'Optional. Short quote shown in a coloured box overlapping the image (desktop only).',
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Contact Detail', subtitle: 'Contact Detail Section' }),
  },
})
