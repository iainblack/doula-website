import { defineType, defineField } from 'sanity'

const collapsed = { collapsible: true, collapsed: true }

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'hero', title: 'Hero', type: 'heroAbout', options: collapsed }),
    defineField({ name: 'philosophy', title: 'Philosophy & Experience', type: 'philosophy', options: collapsed }),
    defineField({ name: 'certifications', title: 'Certifications', type: 'certifications', options: collapsed }),
    defineField({ name: 'testimonialQuote', title: 'Testimonial Quote', type: 'testimonialQuote', options: collapsed }),
    defineField({ name: 'ctaBanner', title: 'CTA Banner', type: 'ctaBanner', options: collapsed }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', options: collapsed }),
  ],
  preview: {
    prepare: () => ({ title: 'About Page' }),
  },
})
