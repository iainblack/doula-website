import { defineType, defineField } from 'sanity'

export const imageGallery = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'imageWithAlt' }],
      validation: r => r.required().min(1),
    }),
  ],
  preview: {
    select: { images: 'images' },
    prepare: ({ images }) => ({
      title: images?.length ? `${images.length} image(s)` : 'Image Gallery',
      subtitle: 'Image Gallery Section',
    }),
  },
})
