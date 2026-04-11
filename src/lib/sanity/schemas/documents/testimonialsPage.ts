import { defineType, defineField } from 'sanity'

export const testimonialsPage = defineType({
  name: 'testimonialsPage',
  title: 'Testimonials Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'testimonialGrid', title: 'Testimonial Grid', type: 'testimonialGrid' }),
    defineField({ name: 'ctaBanner', title: 'CTA Banner', type: 'testimonialsCtaBanner' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'Testimonials Page' }),
  },
})
