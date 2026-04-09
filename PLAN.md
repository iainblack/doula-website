# Stitch → Production Implementation Plan

## End State

A reusable Next.js + Sanity template that, given any Google Stitch design, allows Claude to automatically generate themed, CMS-connected building blocks (section components). Content editors assemble pages in Sanity Studio (embedded at `/studio`) by stacking these blocks in any order. The template also supports standard Next.js app routes for non-CMS pages (dashboards, auth, integrations like Stripe). Developers focus on UI design in Stitch; everything else is automated or handled by editors.

**Key clarification:** Section components are generated fresh per project from each Stitch design — they are not reused verbatim across projects. What's reusable is the template architecture, shared Sanity types, theme system, and the Claude pipeline process itself. Each project gets its own `COMPONENTS.md` registry tracking what was built for that project.

---

## Tech Stack

| Layer          | Technology                        | Why                                                    |
|----------------|-----------------------------------|--------------------------------------------------------|
| Framework      | Next.js 15 (App Router)           | SSR/SSG, best Sanity integration, Vercel deploy        |
| Language       | TypeScript                        | Type safety, sanity-typegen for auto-typed CMS data    |
| Styling        | Tailwind CSS v4 + CSS variables   | Design tokens map directly to CSS vars; Tailwind v4 is CSS-first |
| CMS            | Sanity v3                         | Page builder pattern, real-time preview, Portable Text |
| Type Gen       | sanity-typegen                    | Auto-generates TS types from Sanity schemas            |
| Deployment     | Vercel + Sanity CDN               | Zero-config Next.js hosting, Sanity hosts its own API  |
| Design Import  | Stitch MCP                        | `extract_design_context`, `fetch_screen_code`, `fetch_screen_image` |

---

## Template Structure

```
stitch-site-template/
│
├── CLAUDE.md                        # Pipeline instructions for Claude (read every session)
├── COMPONENTS.md                    # Section registry — populated by Claude, starts empty
├── DESIGN.md                        # Populated from Stitch Design DNA, starts as placeholder
├── README.md                        # Human setup instructions
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (next/font, Navbar/Footer, global metadata)
│   │   ├── page.tsx                 # Homepage (fetches Sanity page with slug: "home")
│   │   ├── [slug]/
│   │   │   └── page.tsx             # Dynamic CMS pages (generateStaticParams + generateMetadata)
│   │   ├── blog/
│   │   │   ├── page.tsx             # Blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Individual blog posts
│   │   ├── studio/
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx         # Embedded Sanity Studio (auth via Sanity dashboard)
│   │   └── api/
│   │       └── revalidate/
│   │           └── route.ts         # Webhook endpoint — Sanity triggers on publish
│   │
│   ├── actions/                     # Next.js Server Actions
│   │   ├── contact.ts               # Contact form submission
│   │   └── newsletter.ts            # Newsletter signup
│   │
│   ├── components/
│   │   ├── PageBuilder.tsx          # Maps section._type → Component
│   │   ├── sections/                # CMS-connected section blocks (generated per project)
│   │   │   └── [SectionName]/
│   │   │       ├── index.tsx        # React component
│   │   │       └── schema.ts        # Co-located Sanity schema
│   │   ├── layout/
│   │   │   ├── Navbar/
│   │   │   │   ├── index.tsx
│   │   │   │   └── schema.ts
│   │   │   └── Footer/
│   │   │       ├── index.tsx
│   │   │       └── schema.ts
│   │   └── ui/                      # Shared atomic elements (in template, not generated)
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── SectionWrapper.tsx   # Consistent section padding/max-width
│   │       └── PortableText.tsx     # Configured Portable Text renderer
│   │
│   ├── lib/
│   │   └── sanity/
│   │       ├── client.ts            # Sanity client, urlFor image helper
│   │       ├── queries.ts           # All GROQ queries
│   │       └── schemas/
│   │           ├── index.ts         # Aggregates all schemas
│   │           ├── documents/
│   │           │   ├── page.ts      # Page builder document
│   │           │   ├── post.ts      # Blog post
│   │           │   └── author.ts
│   │           ├── singletons/
│   │           │   ├── navbar.ts
│   │           │   ├── footer.ts
│   │           │   └── siteSettings.ts  # Site name, socials, analytics ID
│   │           └── objects/
│   │               ├── cta.ts            # { label, url, style, newTab }
│   │               ├── seo.ts            # { title, description, ogImage }
│   │               ├── imageWithAlt.ts   # { image, alt, caption }
│   │               └── portableTextBlock.ts
│   │
│   ├── styles/
│   │   └── globals.css              # @theme block — single source of truth for design tokens
│   │
│   └── types/
│       └── sanity.generated.ts      # Auto-generated via sanity-typegen (never edit manually)
│
├── sanity.config.ts                 # Sanity Studio config (structure, plugins)
├── sanity.cli.ts                    # Sanity CLI config (projectId, dataset)
├── next.config.ts                   # Next.js config (Sanity image domains, etc.)
├── tsconfig.json
├── package.json
└── .env.local.example               # Template for required env vars
```

> **Note:** `tailwind.config.ts` is not needed for theme values in Tailwind v4. All theme configuration lives in the `@theme` block inside `globals.css`.

---

## Architecture Deep Dive

### 1. Theme System

Tailwind v4 is CSS-first — theme configuration lives directly in `globals.css` using `@theme` blocks, not in a separate config file. This is a perfect fit: Stitch Design DNA is parsed and written as `@theme` variables, which Tailwind automatically exposes as utility classes (`bg-primary`, `text-muted`, `rounded-lg`, etc.).

**There is no `tailwind.config.ts` for theme values.** The file can be omitted entirely or kept minimal for non-theme config only (e.g. content paths, plugins).

```css
/* src/styles/globals.css — auto-generated from Stitch Design DNA */

@import "tailwindcss";

@theme {
  /* Colors — written from Stitch Design DNA */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-foreground: #FFFFFF;
  --color-secondary: #F59E0B;
  --color-secondary-foreground: #000000;
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-border: #E5E7EB;
  --color-foreground: #111827;
  --color-muted: #6B7280;

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --spacing-section-y: 5rem;
  --spacing-section-x: 1.5rem;
  --max-width-content: 1200px;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

**Font loading from Stitch Design DNA:** When Stitch reports a Google Font (e.g. "Sora", "Inter", "DM Sans"), Claude maps it to a `next/font/google` import in `layout.tsx` and injects the CSS variable:

```tsx
// src/app/layout.tsx
import { Sora, Inter } from 'next/font/google'

const sora = Sora({ subsets: ['latin'], variable: '--font-heading' })
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

If Stitch reports a non-Google font, Claude uses `next/font/local` with the font name noted in `DESIGN.md` for manual installation.

**Result:** Components use Tailwind classes like `bg-primary`, `text-muted`, `rounded-lg`, `font-heading`. Change a value in `@theme`, every component updates instantly.


### 2. Component Architecture

Every section follows the same pattern:

```tsx
// src/components/sections/Hero/index.tsx
import { SectionWrapper } from '@/components/ui/SectionWrapper'
import { Button } from '@/components/ui/Button'
import { urlFor } from '@/lib/sanity/client'
import type { Hero as HeroType } from '@/types/sanity.generated'

export function Hero({ headline, subheadline, cta, backgroundImage }: HeroType) {
  return (
    <SectionWrapper>
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="font-heading text-5xl font-bold text-foreground">
          {headline}
        </h1>
        {subheadline && (
          <p className="mt-4 text-lg text-muted">{subheadline}</p>
        )}
        {cta && (
          <Button href={cta.url} style={cta.style} className="mt-8">
            {cta.label}
          </Button>
        )}
      </div>
    </SectionWrapper>
  )
}
```

```ts
// src/components/sections/Hero/schema.ts
import { defineType, defineField } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string', validation: r => r.required() }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'text', rows: 2 }),
    defineField({ name: 'backgroundImage', title: 'Background Image', type: 'imageWithAlt' }),
    defineField({ name: 'cta', title: 'Call to Action', type: 'cta' }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero', subtitle: 'Hero Section' }),
  },
})
```

**Key conventions:**
- Component and schema are co-located in the same folder
- Props type comes from sanity-typegen (auto-generated from schema)
- All text content is a prop (nothing hardcoded)
- All colors come from CSS variables via Tailwind
- `SectionWrapper` provides consistent vertical padding and max-width
- Schema includes `preview` config so editors see meaningful labels in Sanity Studio


### 3. Sanity Page Builder

The core Sanity pattern: a `page` document with a `sections` array field.

```ts
// src/lib/sanity/schemas/documents/page.ts
import { defineType, defineField } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Page Title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'featureGrid' },
        { type: 'testimonials' },
        { type: 'pricing' },
        { type: 'ctaBanner' },
        { type: 'richText' },
        { type: 'blogGrid' },
        { type: 'imageGallery' },
        { type: 'stats' },
        { type: 'faq' },
        { type: 'logoCloud' },
        { type: 'contactForm' },
      ],
    }),
  ],
})
```

**Page rendering in Next.js:**

```tsx
// src/components/PageBuilder.tsx
import { Hero } from './sections/Hero'
import { FeatureGrid } from './sections/FeatureGrid'
import { Testimonials } from './sections/Testimonials'
// ...all section imports

const componentMap: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  featureGrid: FeatureGrid,
  testimonials: Testimonials,
  // ...all section mappings
}

interface Section {
  _type: string
  _key: string
  [key: string]: any
}

export function PageBuilder({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections?.map((section) => {
        const Component = componentMap[section._type]
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`)
          return null
        }
        return <Component key={section._key} {...section} />
      })}
    </>
  )
}
```

```tsx
// src/app/[slug]/page.tsx
import { client } from '@/lib/sanity/client'
import { pageBySlugQuery, allPageSlugsQuery } from '@/lib/sanity/queries'
import { PageBuilder } from '@/components/PageBuilder'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

// Next.js 15: params is a Promise — must be awaited
export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await client.fetch(pageBySlugQuery, { slug })
  if (!page) notFound()

  return <PageBuilder sections={page.sections} />
}

// Pre-render all CMS pages at build time (ISR)
export async function generateStaticParams() {
  const slugs = await client.fetch(allPageSlugsQuery)
  return slugs.map((slug: string) => ({ slug }))
}

// SEO metadata from Sanity seo field
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const page = await client.fetch(pageBySlugQuery, { slug })
  if (!page) return {}

  return {
    title: page.seo?.title ?? page.title,
    description: page.seo?.description,
    openGraph: page.seo?.ogImage
      ? { images: [{ url: urlFor(page.seo.ogImage).width(1200).url() }] }
      : undefined,
  }
}
```


### 4. Shared Sanity Object Types

These are defined once and reused across every section schema:

```ts
// cta.ts — Call to Action
defineType({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Button Text', type: 'string', validation: r => r.required() }),
    defineField({ name: 'url', title: 'URL', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: { list: ['primary', 'secondary', 'outline', 'ghost'] },
      initialValue: 'primary',
    }),
    defineField({ name: 'newTab', title: 'Open in new tab', type: 'boolean', initialValue: false }),
  ],
})
```

```ts
// seo.ts — Page-level SEO
defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'description', title: 'Meta Description', type: 'text', rows: 3 }),
    defineField({ name: 'ogImage', title: 'Open Graph Image', type: 'image' }),
  ],
})
```

```ts
// imageWithAlt.ts — Accessible image
defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string', validation: r => r.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
})
```


### 5. Singleton Pattern (Navbar, Footer, Site Settings)

Global content that appears on every page uses Sanity singletons:

```ts
// src/lib/sanity/schemas/singletons/navbar.ts
defineType({
  name: 'navbar',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({
      name: 'links',
      title: 'Nav Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', type: 'string' }),
          defineField({ name: 'url', type: 'string' }),
        ],
      }],
    }),
    defineField({ name: 'cta', title: 'Nav CTA', type: 'cta' }),
  ],
})
```

Fetched once in the root layout and passed to the Navbar/Footer components.


### 6. Blog Architecture

Blog posts are separate Sanity documents (not page builder sections):

```ts
// post.ts
defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', type: 'imageWithAlt' }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'categories', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'body', type: 'portableTextBlock' }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
})
```

The `BlogGrid` section component references posts dynamically — it queries Sanity for the latest posts rather than having them manually added to the section.

---

## The Claude Pipeline (CLAUDE.md)

### Step 1: Import from Stitch
```
1. Call `list_projects` → display available projects
2. User confirms project
3. Call `list_screens` → enumerate all screens
4. For each screen:
   - `extract_design_context` → save Design DNA
   - `fetch_screen_code` → save HTML
   - `fetch_screen_image` → save screenshot
5. Generate/update DESIGN.md with aggregated Design DNA
```

### Step 2: Generate Theme
```
1. Parse Design DNA → extract colors, fonts, spacing, radius, shadows
2. Write/update src/styles/globals.css @theme block with all design tokens
   - No tailwind.config.ts needed — @theme IS the config in Tailwind v4
3. Map fonts from Design DNA → next/font imports in layout.tsx
   - Google Fonts (Inter, Sora, DM Sans, etc.) → next/font/google
   - Custom/unknown fonts → next/font/local, note in DESIGN.md for manual install
   - Assign CSS variable names: --font-heading, --font-body
4. Verify className variables applied to <html> tag in layout.tsx
```

### Step 3: Analyze & Plan Sections
```
1. For each screen, analyze HTML + screenshot
2. Identify distinct sections and classify them:
   - Hero, FeatureGrid, Testimonials, Pricing, CtaBanner,
     RichText, BlogGrid, ImageGallery, Stats, Faq, LogoCloud, ContactForm
3. Read COMPONENTS.md — identify what already exists
4. Create a build plan: which sections are new, which are reused
5. Present plan to user for confirmation before generating
```

### Step 4: Generate Components
```
For each NEW section type:
1. Create src/components/sections/[Name]/index.tsx
   - Props match Sanity schema fields
   - Use CSS variables via Tailwind for all styling
   - Mobile-first responsive design
   - SectionWrapper for consistent spacing
2. Create src/components/sections/[Name]/schema.ts
   - Co-located Sanity schema
   - Include preview config
   - Use shared types (cta, imageWithAlt, etc.)
3. Update componentMap in PageBuilder.tsx
```

### Step 5: Update Sanity Config
```
1. Import new schemas into src/lib/sanity/schemas/index.ts
2. Add new section types to page.sections.of array
3. Run sanity-typegen to regenerate TypeScript types
```

### Step 6: Wire Pages
```
1. Map Stitch screens → Next.js routes
2. Create/update GROQ queries in src/lib/sanity/queries.ts:
   - pageBySlugQuery (fetches page + all section data)
   - allPageSlugsQuery (for generateStaticParams)
   - navbarQuery + footerQuery (fetched in root layout)
   - allPostsQuery + postBySlugQuery (for blog)
   - allPostSlugsQuery (for blog generateStaticParams)
3. Verify generateStaticParams and generateMetadata on all dynamic routes
4. Confirm revalidation webhook endpoint works (test with Sanity webhook trigger)
5. Add Sanity image hostname to next.config.ts images.remotePatterns
```

### Step 7: Update Registry
```
1. Add all new components to COMPONENTS.md with:
   - Component name
   - Schema name (_type)
   - Props/fields list
   - Brief description
   - Which Stitch screen it was derived from
```

### 7. Revalidation Webhook

When an editor publishes a change in Sanity Studio, a webhook fires to tell Next.js to regenerate the affected pages. Without this, changes don't appear on the live site until the next full deploy.

```ts
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{ _type: string; slug?: { current: string } }>(
      req,
      process.env.SANITY_WEBHOOK_SECRET
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    // Revalidate the affected path based on document type
    if (body._type === 'page') {
      revalidatePath(`/${body.slug?.current}`)
    } else if (body._type === 'post') {
      revalidatePath(`/blog/${body.slug?.current}`)
      revalidatePath('/blog') // also revalidate blog index
    } else if (['navbar', 'footer', 'siteSettings'].includes(body._type)) {
      revalidatePath('/', 'layout') // revalidates all pages via layout
    }

    return NextResponse.json({ revalidated: true })
  } catch (err) {
    return new NextResponse('Revalidation error', { status: 500 })
  }
}
```

The webhook URL (`https://yoursite.com/api/revalidate`) and `SANITY_WEBHOOK_SECRET` are configured in the Sanity dashboard under API → Webhooks. Claude sets this up during Step 6 of the pipeline and documents the webhook URL in the README.


### 8. Sanity Studio Auth

The `/studio` route is protected by Sanity's own authentication — editors log in with their Sanity account. Access is controlled via the Sanity project dashboard (manage.sanity.io) where you invite team members by email and assign roles (admin, editor, viewer).

No additional auth code is required in the Next.js app. The embedded Studio handles it automatically.

---

## COMPONENTS.md Registry Format

```markdown
# Component Registry

## Sections

### Hero
- **Schema type:** `hero`
- **Fields:** headline (string), subheadline (text), backgroundImage (imageWithAlt), cta (cta)
- **Layout:** derived from Stitch design (e.g. centered, split, with-image)
- **Added:** 2026-04-04 from project "my-saas-site"

### FeatureGrid
- **Schema type:** `featureGrid`
- **Fields:** heading (string), subheading (text), features[] (icon, title, description)
- **Layout:** 3-column grid
- **Added:** 2026-04-04 from project "my-saas-site"

(etc.)
```

---

## Environment Variables

```env
# .env.local.example

# Sanity — get these from manage.sanity.io
NEXT_PUBLIC_SANITY_PROJECT_ID=        # Project ID (public, safe to expose)
NEXT_PUBLIC_SANITY_DATASET=production # Usually "production"
SANITY_API_TOKEN=                     # Read token (server-only, never expose publicly)
SANITY_WEBHOOK_SECRET=                # Random string — set same value in Sanity webhook config

# Per-project integrations (add as needed)
# RESEND_API_KEY=                     # For contact form email delivery
# CONTACT_EMAIL_TO=                   # Recipient for contact form submissions
# STRIPE_SECRET_KEY=                  # If Stripe integration added
```

---

## New Project Workflow (Human Steps)

1. Clone template: `npx degit your-username/stitch-site-template my-new-site`
2. `cd my-new-site && npm install`
3. Create Sanity project: `npx sanity init` (or reuse existing)
4. Copy `.env.local.example` → `.env.local`, fill in Sanity credentials
5. Open Claude Code: `claude`
6. Tell Claude: "Import Stitch project [name] and build the site"
7. Claude reads CLAUDE.md, runs the pipeline
8. `npm run dev` → review at localhost:3000
9. Iterate with Claude on any visual fixes
10. Deploy: `vercel deploy` or push to git

---

## Resolved Decisions

| Decision | Resolution | Rationale |
|----------|-----------|-----------|
| **Full web apps** | Template supports BOTH CMS page builder pages AND standard Next.js app routes. Integrations (Stripe, etc.) handled per-project as needed. | Projects are full Next.js + Sanity apps, not just content sites. |
| **Component reuse** | Components are generated fresh per project from each Stitch design. The template provides the architecture and shared types; each project defines its own sections. | Designs differ per project. What compounds is the process, not the components. |
| **Interactive elements** | Next.js Server Actions built into the template for forms, contact, newsletter. | Self-contained, no third-party dependencies. |
| **Sanity Studio** | Embedded at `/studio` route inside the Next.js app. | One deployment, simpler setup for editors. |
| **Image handling** | Stitch images are reference only. Claude uses them to understand layout/style. Final images uploaded by editors via Sanity Studio. | Stitch images are design-time assets, not production content. |
| **Navigation** | Sanity Navbar singleton with manually configured links. Supports both CMS pages and hardcoded app routes. | Hybrid approach — editors manage nav links, developers add app routes as needed. |
| **Preview** | Basic draft preview via Next.js draft mode. Visual editing can be added later. | Keeps initial complexity low. Sanity Presentation mode is a future enhancement. |
| **Template evolution** | Template stays architecture-only (no pre-built section components). It improves by refining the process, shared types, and CLAUDE.md instructions over time. | Since components are project-specific, backporting doesn't apply. The template is a starting point, not a component library. |

---

## App Routes vs CMS Pages

The template supports two routing patterns side by side:

**CMS Pages** (managed by editors in Sanity):
```
/                    → Homepage (page builder)
/[slug]              → Dynamic CMS pages (about, pricing, etc.)
/blog                → Blog index
/blog/[slug]         → Blog posts
```

**App Routes** (managed by developers in code):
```
/studio/[[...tool]]  → Embedded Sanity Studio
/dashboard           → Example app route (added per-project)
/api/...             → Server Actions, webhooks
```

This separation means content editors never touch code, and developers never manage marketing copy in git. Integrations like Stripe get their own route groups added as needed.

---

## Server Actions (Forms & Interactive Elements)

The template includes a lightweight Server Actions pattern:

```
src/
  actions/
    contact.ts       # Contact form submission
    newsletter.ts    # Newsletter signup
```

Each action validates input, processes it (send email, store data), and returns a typed result. Components call these directly — no API routes needed. The actual delivery method (email via Resend, storage via Sanity, etc.) is configured per-project via env vars.

Example pattern:
```ts
// src/actions/contact.ts
'use server'

import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function submitContactForm(formData: FormData) {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid form data' }

  // Per-project: send via Resend, store in Sanity, forward to CRM, etc.
  // Configured via env vars: CONTACT_EMAIL_TO, RESEND_API_KEY, etc.

  return { success: true }
}
```
