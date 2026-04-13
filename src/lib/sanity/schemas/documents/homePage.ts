import { defineType, defineField } from 'sanity'

const collapsed = { collapsible: true, collapsed: true }

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero', options: collapsed }),
    defineField({ name: 'editorialBlock', title: 'Editorial Block', type: 'editorialBlock', options: collapsed }),
    defineField({ name: 'featureGrid', title: 'Feature Grid', type: 'featureGrid', options: collapsed }),
    defineField({ name: 'testimonialQuote', title: 'Testimonial Quote', type: 'testimonialQuote', options: collapsed }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', options: collapsed }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
