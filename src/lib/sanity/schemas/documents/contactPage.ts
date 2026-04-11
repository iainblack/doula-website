import { defineType, defineField } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({ name: 'contactDetail', title: 'Contact Detail', type: 'contactDetail' }),
    defineField({ name: 'contactForm', title: 'Contact Form', type: 'contactForm' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact Page' }),
  },
})
