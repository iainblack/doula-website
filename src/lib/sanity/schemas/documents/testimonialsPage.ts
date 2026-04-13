import { defineType, defineField } from 'sanity'

const collapsed = { collapsible: true, collapsed: true }

export const testimonialsPage = defineType({
  name: 'testimonialsPage',
  title: 'Testimonials Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero', options: collapsed }),
    defineField({ name: 'testimonialGrid', title: 'Testimonial Grid', type: 'testimonialGrid', options: collapsed }),
    defineField({ name: 'ctaBanner', title: 'CTA Banner', type: 'testimonialsCtaBanner', options: collapsed }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', options: collapsed }),
  ],
  preview: {
    prepare: () => ({ title: 'Testimonials Page' }),
  },
})
