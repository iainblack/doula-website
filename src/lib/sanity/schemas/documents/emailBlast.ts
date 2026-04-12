import { defineType, defineField } from 'sanity'

export const emailBlast = defineType({
  name: 'emailBlast',
  title: 'Email Blast',
  type: 'document',
  fields: [
    defineField({
      name: 'subject',
      title: 'Subject Line',
      type: 'string',
      validation: r => r.required(),
    }),
    defineField({
      name: 'previewText',
      title: 'Preview Text',
      type: 'string',
      description: 'Short summary shown in email client inbox views (under the subject line).',
    }),
    defineField({
      name: 'body',
      title: 'Email Body',
      type: 'text',
      rows: 12,
      description: 'Plain text content of the email. Separate paragraphs with a blank line.',
      validation: r => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['draft', 'sent'] },
      initialValue: 'draft',
      readOnly: true,
    }),
    defineField({
      name: 'sentAt',
      title: 'Sent At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'subject', status: 'status', sentAt: 'sentAt' },
    prepare: ({ title, status, sentAt }) => ({
      title: title || 'Untitled Blast',
      subtitle:
        status === 'sent'
          ? `Sent ${sentAt ? new Date(sentAt).toLocaleDateString() : ''}`
          : 'Draft — not yet sent',
    }),
  },
})
