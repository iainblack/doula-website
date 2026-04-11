import { defineType, defineField } from 'sanity'

export const cta = defineType({
  name: 'cta',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Text',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'Link',
      type: 'string',
      description: 'Use /contact for the contact page, or a full URL (https://...) for external links.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in new tab',
      type: 'boolean',
      description: 'Turn on for external links that should open without leaving the site.',
      initialValue: false,
    }),
  ],
})
