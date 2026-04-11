import { defineType, defineField } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'string',
      description: 'Optional. Shown in the browser tab and Google search results. Aim for 50–60 characters.',
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Optional. Shown in Google search results below the title. Aim for 150–160 characters.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Optional. Image shown when this page is shared on social media (Facebook, iMessage, etc.). Recommended size: 1200×630 px.',
    }),
  ],
})
