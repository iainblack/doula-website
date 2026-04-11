import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      description: 'Auto-generated from the title. This becomes the URL of the post.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Optional. A short summary shown in blog listings and search results.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'imageWithAlt',
      description: 'Optional. Image shown at the top of the post and in blog listing cards.',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Optional. Link to an author record.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Optional. The date shown on the post. Defaults to the creation date if left blank.',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Optional. Tags used to group posts.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableTextBlock',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage.image',
    },
    prepare: ({ title, author, media }) => ({
      title: title || 'Untitled Post',
      subtitle: author ? `by ${author}` : '',
      media,
    }),
  },
})
