import type { StructureResolver } from 'sanity/structure'
import { AttendeesView } from './components/AttendeesView'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Pages ──────────────────────────────────────────────────
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('About')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Services')
        .child(S.document().schemaType('servicesPage').documentId('servicesPage')),
      S.listItem()
        .title('Classes & Workshops')
        .child(
          S.document()
            .schemaType('classesPage')
            .documentId('classesPage')
            .views([
              S.view.form().title('Content'),
              S.view.component(AttendeesView).title('Attendees'),
            ])
        ),
      S.listItem()
        .title('Testimonials')
        .child(S.document().schemaType('testimonialsPage').documentId('testimonialsPage')),
      S.listItem()
        .title('Contact')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),

      S.divider(),

      // ── Navigation ─────────────────────────────────────────────
      S.listItem()
        .title('Navbar')
        .child(S.document().schemaType('navbar').documentId('navbar')),
      S.listItem()
        .title('Footer')
        .child(S.document().schemaType('footer').documentId('footer')),

      S.divider(),

      // ── Blog ───────────────────────────────────────────────────
      S.documentTypeListItem('post').title('Blog Posts'),
      S.documentTypeListItem('author').title('Authors'),

      S.divider(),

      // ── Settings ───────────────────────────────────────────────
      S.listItem()
        .title('Settings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
