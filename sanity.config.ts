'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {presentationTool, type DocumentLocation} from 'sanity/presentation'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {colorInput} from '@sanity/color-input'
import {Observable, map} from 'rxjs'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schemaTypes} from './src/lib/sanity/schemas'
import {structure} from './src/sanity/structure'
import {SendBlastAction} from './src/sanity/components/SendBlastAction'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'emailBlast') {
        return [...prev, SendBlastAction]
      }
      return prev
    },
  },
  plugins: [
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      locate: (params, context) => {
        const {documentStore} = context
        const {id, type} = params

        const typeToPath: Record<string, string> = {
          homePage: '/',
          aboutPage: '/about',
          servicesPage: '/services',
          classesPage: '/classes',
          testimonialsPage: '/testimonials',
          contactPage: '/contact',
          navbar: '/',
          footer: '/',
        }

        if (type === 'servicePackage') {
          return new Observable((observer) => {
            const sub = documentStore.listenQuery(
              `*[_id == $id][0]{ slug }`,
              {id},
              {perspective: 'previewDrafts'},
            ).pipe(
              map((doc) =>
                doc?.slug?.current
                  ? {
                      locations: [
                        {
                          title: doc.slug.current,
                          href: `/services/${doc.slug.current}`,
                        } satisfies DocumentLocation,
                      ],
                    }
                  : null,
              ),
            ).subscribe(observer)
            return () => sub.unsubscribe()
          })
        }

        if (type in typeToPath) {
          return new Observable((observer) => {
            const sub = documentStore.listenQuery(
              `*[_id == $id][0]{_id, _type}`,
              {id},
              {perspective: 'previewDrafts'},
            ).pipe(
              map((doc) =>
                doc
                  ? {
                      locations: [
                        {
                          title: type,
                          href: typeToPath[type],
                        } satisfies DocumentLocation,
                      ],
                    }
                  : null,
              ),
            ).subscribe(observer)
            return () => sub.unsubscribe()
          })
        }

        return null
      },
    }),
    structureTool({structure}),
    unsplashImageAsset(),
    colorInput(),
  ],
})
