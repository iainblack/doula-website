import { defineType, defineField } from 'sanity'

export const classRegistration = defineType({
  name: 'classRegistration',
  title: 'Class Registration',
  type: 'document',
  fields: [
    defineField({ name: 'classKey', title: 'Class Key', type: 'string', readOnly: true, hidden: true }),
    defineField({ name: 'className', title: 'Class Name', type: 'string', readOnly: true }),
    defineField({ name: 'classDate', title: 'Class Date', type: 'string', readOnly: true }),
    defineField({ name: 'name', title: 'Registrant Name', type: 'string', readOnly: true }),
    defineField({ name: 'email', title: 'Registrant Email', type: 'string', readOnly: true }),
    defineField({ name: 'cancelToken', title: 'Cancel Token', type: 'string', readOnly: true, hidden: true }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['active', 'cancelled'] },
      initialValue: 'active',
    }),
    defineField({ name: 'createdAt', title: 'Registered At', type: 'string', readOnly: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'className', status: 'status' },
    prepare: ({ title, subtitle, status }) => ({
      title: title || 'Unknown',
      subtitle: `${subtitle || 'Unknown class'} — ${status}`,
    }),
  },
})
