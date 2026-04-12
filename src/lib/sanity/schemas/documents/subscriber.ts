import { defineType, defineField } from 'sanity'

export const subscriber = defineType({
  name: 'subscriber',
  title: 'Subscriber',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly: true,
      validation: r => r.required(),
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['active', 'unsubscribed'] },
      initialValue: 'active',
    }),
  ],
  preview: {
    select: { title: 'email', status: 'status' },
    prepare: ({ title, status }) => ({
      title: title || 'Unknown',
      subtitle: status === 'active' ? 'Subscribed' : 'Unsubscribed',
    }),
  },
})
