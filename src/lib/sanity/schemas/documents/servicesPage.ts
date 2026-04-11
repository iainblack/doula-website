import { defineType, defineField } from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'serviceCards', title: 'Service Cards', type: 'serviceCards' }),
    defineField({ name: 'faq', title: 'FAQ', type: 'faq' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Services Page' }),
  },
})
