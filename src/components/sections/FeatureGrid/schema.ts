import { defineType, defineField } from 'sanity'
import { MaterialIconPicker } from '../../../sanity/components/MaterialIconPicker'

export const featureGrid = defineType({
  name: 'featureGrid',
  title: 'Feature Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'overline',
      title: 'Overline',
      type: 'string',
      description: 'Optional. Small label above the heading (e.g. "Holistic Support")',
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
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              components: { input: MaterialIconPicker },
            }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: r => r.required().max(80) }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              description: 'Optional. Supporting text shown beneath the feature title.',
            }),
            defineField({
              name: 'linkLabel',
              title: 'Link Text',
              type: 'string',
              description: 'Optional. Text for a "learn more" style link shown at the bottom of the card.',
            }),
            defineField({
              name: 'linkUrl',
              title: 'Link URL',
              type: 'string',
              description: 'Optional. Required if Link Text is set. Use /services for internal pages.',
            }),
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
