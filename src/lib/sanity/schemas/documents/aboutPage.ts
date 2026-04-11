import { defineType, defineField } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroAbout' }),
    defineField({ name: 'philosophy', title: 'Philosophy & Experience', type: 'philosophy' }),
    defineField({ name: 'certifications', title: 'Certifications', type: 'certifications' }),
    defineField({ name: 'testimonialQuote', title: 'Testimonial Quote', type: 'testimonialQuote' }),
    defineField({ name: 'ctaBanner', title: 'CTA Banner', type: 'ctaBanner' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: {
    prepare: () => ({ title: 'About Page' }),
  },
})
