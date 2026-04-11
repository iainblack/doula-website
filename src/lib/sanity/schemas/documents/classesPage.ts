import { defineType, defineField } from 'sanity'

export const classesPage = defineType({
  name: 'classesPage',
  title: 'Classes & Workshops Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'classList', title: 'Class List', type: 'classList' }),
    defineField({ name: 'newsletterSignup', title: 'Newsletter Signup', type: 'newsletterSignup' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Classes & Workshops Page' }),
  },
})
