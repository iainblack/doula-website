import { defineType, defineField } from 'sanity'

export const classType = defineType({
  name: 'class',
  title: 'Class',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'logistics', title: 'Logistics & Pricing' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'A short description of what this class covers.',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      group: 'logistics',
      description: 'e.g. Saturday, March 14, 2026',
    }),
    defineField({
      name: 'time',
      title: 'Time',
      type: 'string',
      group: 'logistics',
      description: 'e.g. 10:00 AM – 12:00 PM',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'logistics',
      description: 'e.g. "123 Main St, Portland" or "Online via Zoom"',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      group: 'logistics',
      description: 'e.g. "$75 per person"',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button Text',
      type: 'string',
      group: 'logistics',
      description: 'Optional. e.g. "Register Now", "Book Your Spot". Only used when no attendee limit is set.',
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Button Link',
      type: 'string',
      group: 'logistics',
      description: 'Optional. Use /contact for the contact page, or a full URL for an external booking link.',
    }),
    defineField({
      name: 'attendeeLimit',
      title: 'Attendee Limit',
      type: 'number',
      group: 'logistics',
      description: 'Optional. Maximum number of registrants. When set, enables the built-in sign-up flow.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Class',
      subtitle: subtitle || '',
    }),
  },
})
