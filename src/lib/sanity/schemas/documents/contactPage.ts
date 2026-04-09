import { defineType, defineField } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'contactDetail', title: 'Contact Detail', type: 'contactDetail' }),
    defineField({ name: 'contactForm', title: 'Contact Form', type: 'contactForm' }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' }),
  },
})
