import { defineType, defineField } from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines (e.g. "Sarah smiling with a newborn").',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional. A short caption displayed below the image.',
    }),
  ],
})
