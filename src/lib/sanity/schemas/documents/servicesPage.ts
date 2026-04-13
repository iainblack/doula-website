import { defineType, defineField } from 'sanity'

const collapsed = { collapsible: true, collapsed: true }

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero', options: collapsed }),
    defineField({ name: 'serviceCards', title: 'Service Cards', type: 'serviceCards', options: collapsed }),
    defineField({ name: 'faq', title: 'FAQ', type: 'faq', options: collapsed }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', options: collapsed }),
  ],
  preview: {
    prepare: () => ({ title: 'Services Page' }),
  },
})
