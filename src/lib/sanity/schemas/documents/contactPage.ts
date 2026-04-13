import { defineType, defineField } from 'sanity'

const collapsed = { collapsible: true, collapsed: true }

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'contactDetail', title: 'Contact Detail', type: 'contactDetail', options: collapsed }),
    defineField({ name: 'contactForm', title: 'Contact Form', type: 'contactForm', options: collapsed }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', options: collapsed }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' }),
  },
})
