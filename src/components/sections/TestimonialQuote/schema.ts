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
      description: 'Optional. Name and/or title of the person being quoted.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'imageWithAlt',
      description: 'Optional. Portrait or accompanying image shown above the quote.',
    }),
    defineField({
      name: 'hasPillBackground',
      title: 'Decorative Background',
      type: 'boolean',
      description: 'Wraps the quote in a soft rounded container with a subtle tinted background and dot pattern. Best for the About page.',
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
