import { defineType, defineField } from 'sanity'

export const testimonialQuote = defineType({
  name: 'testimonialQuote',
  title: 'Testimonial Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: r => r.required(),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      description: 'Name and/or title of the person being quoted',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'Optional portrait or accompanying image',
    }),
    defineField({
      name: 'hasPillBackground',
      title: 'Pill Background Style',
      type: 'boolean',
      description: 'Wraps the quote in a rounded-full container with primary-container tint and dot texture (About Me style)',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'attribution', subtitle: 'quote' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Testimonial Quote',
      subtitle: subtitle ? `"${subtitle.slice(0, 60)}…"` : 'Testimonial Quote Section',
    }),
  },
})
