import { defineType, defineField } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({ name: 'hero', title: 'Hero', type: 'hero' }),
    defineField({ name: 'imageGallery', title: 'Image Gallery', type: 'imageGallery' }),
    defineField({ name: 'editorialBlock', title: 'Editorial Block', type: 'editorialBlock' }),
    defineField({ name: 'featureGrid', title: 'Feature Grid', type: 'featureGrid' }),
    defineField({ name: 'testimonialQuote', title: 'Testimonial Quote', type: 'testimonialQuote' }),
  ],
  preview: {
    prepare: () => ({ title: 'Home Page' }),
  },
})
