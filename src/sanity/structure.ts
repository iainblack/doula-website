import type { StructureResolver } from 'sanity/structure'
import {
  HomeIcon,
  InfoOutlineIcon,
  StarIcon,
  CalendarIcon,
  FaceHappyIcon,
  EnvelopeIcon,
  LinkIcon,
  OlistIcon,
  EditIcon,
  UsersIcon,
  CogIcon,
} from '@sanity/icons'
import { AttendeesView } from './components/AttendeesView'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ── Pages ──────────────────────────────────────────────────
      S.listItem()
        .title('Pages')
        .icon(OlistIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(HomeIcon)
                .child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem()
                .title('About Page')
                .icon(InfoOutlineIcon)
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('Services Page')
                .icon(StarIcon)
                .child(S.document().schemaType('servicesPage').documentId('servicesPage')),
              S.listItem()
                .title('Classes & Workshops Page')
                .icon(CalendarIcon)
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
                .title('Testimonials Page')
                .icon(FaceHappyIcon)
                .child(S.document().schemaType('testimonialsPage').documentId('testimonialsPage')),
              S.listItem()
                .title('Contact Page')
                .icon(EnvelopeIcon)
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
            ])
        ),

      S.divider(),

      // ── Site-wide ──────────────────────────────────────────────
      S.listItem()
        .title('Site-wide')
        .icon(LinkIcon)
        .child(
          S.list()
            .title('Site-wide')
            .items([
              S.listItem()
                .title('Navigation')
                .icon(LinkIcon)
                .child(S.document().schemaType('navbar').documentId('navbar')),
              S.listItem()
                .title('Footer')
                .icon(OlistIcon)
                .child(S.document().schemaType('footer').documentId('footer')),
            ])
        ),

      S.divider(),

      // ── Content ────────────────────────────────────────────────
      S.listItem()
        .title('Content')
        .icon(EditIcon)
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('servicePackage').title('Service Packages').icon(StarIcon),
              S.documentTypeListItem('post').title('Blog Posts').icon(EditIcon),
              S.documentTypeListItem('author').title('Authors').icon(UsersIcon),
            ])
        ),

      S.divider(),

      // ── Submissions ────────────────────────────────────────────
      S.listItem()
        .title('Submissions')
        .icon(EnvelopeIcon)
        .child(
          S.list()
            .title('Submissions')
            .items([
              S.documentTypeListItem('classRegistration').title('Class Registrations').icon(CalendarIcon),
            ])
        ),

      S.divider(),

      // ── Settings ───────────────────────────────────────────────
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])
