import { defineType, defineField } from 'sanity'

const collapsed = { collapsible: true, collapsed: true }

export const classesPage = defineType({
  name: 'classesPage',
  title: 'Classes & Workshops Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero', options: collapsed }),
    defineField({ name: 'classList', title: 'Class List', type: 'classList', options: collapsed }),
    defineField({ name: 'newsletterSignup', title: 'Newsletter Signup', type: 'newsletterSignup', options: collapsed }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', options: collapsed }),
  ],
  preview: {
    prepare: () => ({ title: 'Classes & Workshops Page' }),
  },
})
