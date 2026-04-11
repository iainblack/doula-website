import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Optional. A brief description of the site used in some SEO contexts.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Social Sharing Image',
      type: 'image',
      description: 'Optional. Shown when any page is shared on social media and that page has no image of its own. Recommended size: 1200×630 px.',
    }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url', description: 'Optional.' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url', description: 'Optional.' }),
        defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url', description: 'Optional.' }),
        defineField({ name: 'tiktok', title: 'TikTok URL', type: 'url', description: 'Optional.' }),
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Optional. Email address where contact form submissions are delivered.',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'analyticsId',
      title: 'Analytics ID',
      type: 'string',
      description: 'Optional. Google Analytics tracking ID (e.g. G-XXXXXXXXXX).',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
