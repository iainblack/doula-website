import { defineType, defineField } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      description: 'Optional. Auto-generated from the name. Used in author profile URLs.',
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional. Author photo shown on blog posts.',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
      description: 'Optional. Short biography shown on blog posts.',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'image' },
    prepare: ({ title, media }) => ({ title: title || 'Unnamed Author', media }),
  },
})
