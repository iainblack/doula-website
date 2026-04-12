import { defineType, defineField } from 'sanity'

export const siteTheme = defineType({
  name: 'siteTheme',
  title: 'Site Theme',
  type: 'document',
  description: 'Override the default colour palette site-wide. Any field left blank falls back to the built-in design defaults.',
  fields: [
    defineField({
      name: 'colorPrimary',
      title: 'Primary Colour',
      type: 'color',
      description: 'Main brand colour — buttons, links, and key accents.',
    }),
    defineField({
      name: 'colorPrimaryHover',
      title: 'Primary Colour — Hover State',
      type: 'color',
      description: 'Darker shade used when hovering over primary buttons.',
    }),
    defineField({
      name: 'colorPrimaryForeground',
      title: 'Primary Colour — Text on Primary',
      type: 'color',
      description: 'Text/icon colour drawn on top of primary-coloured backgrounds.',
    }),
    defineField({
      name: 'colorBackground',
      title: 'Page Background',
      type: 'color',
      description: 'Main page background colour.',
    }),
    defineField({
      name: 'colorSurface',
      title: 'Surface / Card Background',
      type: 'color',
      description: 'Background colour for cards and elevated surfaces.',
    }),
    defineField({
      name: 'colorForeground',
      title: 'Primary Text Colour',
      type: 'color',
      description: 'Main body text colour.',
    }),
    defineField({
      name: 'colorMuted',
      title: 'Secondary / Muted Text Colour',
      type: 'color',
      description: 'Used for captions, overlines, and less-prominent text.',
    }),
    defineField({
      name: 'colorBorder',
      title: 'Border / Divider Colour',
      type: 'color',
      description: 'Colour for borders and subtle dividers.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Theme' }),
  },
})
