# /build-screen — Build One Screen End-to-End

Builds a single Stitch screen into a pixel-faithful, CMS-connected Next.js page.
Run once per screen. Complete each screen fully before starting the next.

**The rule: the Stitch HTML is the blueprint. Translate it — don't reinvent it.**

---

## Before starting

Ask the user: "Which screen do you want to build?" Show the screen list from DESIGN.md. Wait for confirmation.

---

## Phase A — Fetch the screen

Call both in parallel:
- `get_screen` → use the screen ID from DESIGN.md
- This returns `htmlCode.downloadUrl` and `screenshot.downloadUrl`

Fetch both URLs with `curl` or WebFetch. You need:
1. The raw HTML — this is your blueprint
2. The screenshot — this is your visual target

Do not write any code yet.

---

## Phase B — Map the sections

Read the HTML top to bottom. Identify each distinct section — a contiguous region with a single purpose. For each one, paste the **exact HTML block** into the plan (not a description of it — the actual HTML).

**Fidelity is the only criterion — not reuse.** For each section, check COMPONENTS.md then compare the Stitch HTML for this screen against the existing component (if any):

- **NEW** — component doesn't exist yet. Build it.
- **UPDATE** — component exists, but this screen's HTML differs in layout, structure, or visual treatment. Update the component to match this screen while keeping the existing screen working. If the layouts are too different to reconcile cleanly, create a screen-specific variant (e.g. `HeroAbout`).
- **SAME** — component exists and this screen's HTML is structurally identical. Safe to reuse without changes.

**Never mark a section SAME without reading the existing component and comparing it to the Stitch HTML.** Layout differences (grid proportions, image treatment, background, decorative elements) always require UPDATE or a new variant.

Present the plan to the user:

```
Screen: About Me
Route: /about

Sections:

UPDATE:
  1. Hero — layout differs from Home (7/12+5/12, single portrait, shadow-2xl, blur decoration, no bg strip)
     HTML: <section class="max-w-7xl mx-auto px-8 mb-32">...</section>

NEW:
  3. Certifications
     HTML: <section class="py-24 bg-surface overflow-hidden">...</section>

  5. CtaBanner
     HTML: <section class="max-w-7xl mx-auto px-8 mb-32">...</section>

SAME:
  2. EditorialBlock (layout and fields identical to built component)
  4. TestimonialQuote (layout and fields identical to built component)

Proceed?
```

Wait for confirmation.

---

## Phase C — Build each NEW or UPDATE section

For each NEW or UPDATE section, follow this exact sequence. Finish one section completely before starting the next.

For **UPDATE** sections: read the existing component file first, then apply the minimum changes needed to match this screen's HTML. The goal is not a clever abstraction — it's a component that renders correctly for every screen that uses it. If the two layouts cannot be reconciled without complex conditional logic, create a screen-specific component (e.g. `HeroAbout/index.tsx`) with its own schema type instead.

### C.1 — Identify the editable content

Read the section's HTML block. Ask: "What would a content editor need to change?"
- Text strings → string or text fields
- Images → imageWithAlt fields
- Links / CTAs → cta fields
- Repeated items → array fields

These are your schema fields. Only what's in the HTML — no speculative additions.

### C.2 — Write the schema

Create `src/components/sections/[Name]/schema.ts`.

Rules:
- `type: 'object'` always
- Field names match exactly what the component will destructure
- `validation: r => r.required()` on headline/title fields only; add `.max(N)` on short text fields
- Always include `preview` config
- Array item shapes defined inline with their own `preview`

### C.3 — Register the schema

Two files only (no PageBuilder anymore):

**`src/lib/sanity/schemas/index.ts`** — add import and add to `schemaTypes` array

**`src/lib/sanity/schemas/documents/[screenName]Page.ts`** — add a named field for this section:
```ts
defineField({ name: 'featureGrid', title: 'Feature Grid', type: 'featureGrid' })
```

If the page document doesn't exist yet, create it now:
```ts
// src/lib/sanity/schemas/documents/aboutPage.ts
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
    // sections added here
  ],
  preview: { prepare: () => ({ title: 'About Page' }) },
})
```

Also add the page document to `src/sanity/structure.ts` under Pages if not already there.

### C.4 — Write the component

Create `src/components/sections/[Name]/index.tsx`.

**Translate the Stitch HTML directly.** Do not write a component from scratch.

Process:
1. Take the exact section HTML block
2. Convert `class=` to `className=`
3. Replace hardcoded text with `{prop}` references
4. Replace `<img src="...">` with `<Image>` from `next/image` using `urlFor(image.image).url()`
5. Map Stitch color tokens to our CSS variable classes:
   - `text-on-surface` → `text-foreground`
   - `text-on-surface-variant` → `text-muted`
   - `bg-surface` → `bg-surface` (same)
   - `bg-surface-container-low` → `bg-surface-container-low` (same)
   - `text-on-primary` → `text-primary-foreground`
   - `border-outline-variant/20` → `border-outline-variant/20` (same)
   - Stitch `stone-*` utility classes (e.g. `text-stone-500`, `bg-stone-100`): map to the nearest semantic token. `text-stone-500` → `text-muted`, `bg-stone-100` → `bg-surface-container-low`, `text-stone-800` → `text-foreground`. Do NOT keep `stone-*` classes — they bypass the theme and will break on dark mode.
6. Wrap in the section's own outer `<section>` tag — do NOT use SectionWrapper (the Stitch HTML already has the right outer container)
7. Add `'use client'` only if the component uses hooks or browser events

Props interface: inline for now (will be replaced with generated type in Phase D).

Optional fields: always use optional chaining and conditional rendering.

### C.5 — TypeScript check

```bash
npx tsc --noEmit 2>&1 | head -50
```

Fix all errors before moving to the next section.

---

## Phase D — Run typegen

After ALL sections for this screen are built and TypeScript is clean:

```bash
npx sanity schema extract --enforce-required-fields
npx sanity typegen generate
```

Then update each new component to import its generated type:
```ts
import type { Hero as HeroType } from '@/types/sanity.generated'
export function Hero({ headline, ... }: HeroType) {
```

Remove the inline props interfaces. Run `npx tsc --noEmit` again.

---

## Phase E — Write the GROQ query

Open `src/lib/sanity/queries.ts`. Add or update the query for this screen.

Each screen has its own named query:
```ts
export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  seo,
  hero{
    overline, headline, headlineEmphasis, body,
    image{ image{ asset->{ _id, url }, hotspot, crop }, alt },
    primaryCta{ label, url, style, newTab }
  },
  editorialBlock{ heading, body, pullQuote, image{ image{ asset->{ _id, url }, hotspot, crop }, alt } },
  // ...
}`
```

Rules:
- Always explicit field projections — never `...` spread
- Always dereference image assets: `asset->{ _id, url }`
- Always project `hotspot` and `crop` alongside images

---

## Phase F — Wire the Next.js route

Create (or update) the page route for this screen.

File locations:
- Home → `src/app/(site)/page.tsx`
- About → `src/app/(site)/about/page.tsx`
- Services → `src/app/(site)/services/page.tsx`
- Classes → `src/app/(site)/classes/page.tsx`
- Testimonials → `src/app/(site)/testimonials/page.tsx`
- Contact → `src/app/(site)/contact/page.tsx`

Each route file:
1. Fetches its specific page query
2. Renders each section directly — no PageBuilder, no componentMap:
   ```tsx
   const page = await client.fetch(aboutPageQuery)
   return (
     <>
       {page.hero && <Hero {...page.hero} />}
       {page.editorialBlock && <EditorialBlock {...page.editorialBlock} />}
     </>
   )
   ```
3. Has `generateMetadata` that reads `page.seo`

---

## Phase G — TypeScript smoke test

```bash
npx tsc --noEmit
```

Zero errors required.

---

## Phase H — Seed content from Stitch

### H.0 — First screen only: seed settings (navbar + footer)

**Check first:** does `scripts/seed-settings.mjs` already exist? If yes, skip this step.

If this is the **first screen built in the project**, create `scripts/seed-settings.mjs` before the page seed. The navbar and footer are global singletons shared across all pages — they must be seeded once so every page renders with a working header and footer.

Settings seed structure:
```js
import { createClient } from '@sanity/client'
process.loadEnvFile('.env.local')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_SEED_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Navbar — extract link labels and URLs from Stitch HTML <nav> or <header> elements
await client.createOrReplace({
  _type: 'navbar',
  _id: 'navbar',  // fixed singleton ID
  links: [
    { _key: 'about', _type: 'object', label: 'About', url: '/about' },
    // ... one entry per nav link found in the Stitch HTML
  ],
  cta: { _type: 'cta', label: 'Book a Consultation', url: '/contact', style: 'primary' },
})

// Footer — extract links and copyright text from Stitch HTML <footer> element
await client.createOrReplace({
  _type: 'footer',
  _id: 'footer',  // fixed singleton ID
  links: [
    { _key: 'contact', _type: 'object', label: 'Contact', url: '/contact' },
  ],
  copyright: '© 2026 [Business Name]. All rights reserved.',
})
```

Add to `package.json`:
```json
"seed:settings": "node scripts/seed-settings.mjs"
```

Run it: `npm run seed:settings`

---

### H.1 — Per-screen seed

Write `scripts/seed-[screen].mjs` using the Stitch HTML content extracted in Phase A.

**Include ALL sections in the seed document — both NEW and REUSE.** The seed script writes the entire page document in one `createOrReplace` call. A REUSE section still needs its content seeded; only its schema and component are being reused, not its data.

For each section, map the hardcoded text and image URLs from the HTML to schema fields:
- Text strings → string/text field values
- `<img src="https://lh3.googleusercontent.com/aida-public/...">` → download via `fetch` + upload via `client.assets.upload()`
- Links/buttons → cta field values

Seed script structure:
```js
import { createClient } from '@sanity/client'
process.loadEnvFile('.env.local')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  token: process.env.SANITY_SEED_TOKEN,  // Editor token — separate from SANITY_API_TOKEN
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function uploadImage(url, filename) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeedScript/1.0)' },
  })
  if (!response.ok) throw new Error(`Failed to fetch: ${url} (${response.status})`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename })
  return asset._id
}

// Build and upsert the page document
await client.createOrReplace({
  _type: '[screen]Page',
  _id: '[screen]Page',   // fixed ID = singleton
  hero: { ... },
  editorialBlock: { ... },
  // ...
})
```

Add a script entry to `package.json`:
```json
"seed:[screen]": "node scripts/seed-[screen].mjs"
```

Run it: `npm run seed:[screen]`

After running: reload `localhost:3000/[route]`. Every section should render immediately with real content from the Stitch design.

If a section is blank: add `console.log(page)` temporarily to the route to verify the GROQ query shape.

---

## Phase I — Visual diff

Open the Stitch screenshot alongside `localhost:3000/[route]`.

Compare section by section. For any layout that doesn't match: go back to the HTML, find what's different, fix it in the component. The screenshot is the acceptance criterion — not the TypeScript passing.

---

## Phase J — Update COMPONENTS.md

For each section built:
```markdown
### [ComponentName]
- **Status:** BUILT
- **Schema type:** `[name]`
- **File:** `src/components/sections/[Name]/`
- **Fields:** [field (type), ...]
- **Used by:** [page document name(s)]
- **Built:** [date] from Stitch screen "[title]"
```

If this screen reused an existing component and needed new fields, note that too.

---

## Phase K — Report

> "Screen '[title]' is complete.
> - Route: localhost:3000/[route]
> - Sections built: [list]
> - Sections reused: [list]
>
> Next: [recommend next screen from DESIGN.md]"

---

## Conventions quick-reference

| Rule | Detail |
|------|--------|
| Blueprint | Translate Stitch HTML — don't reinvent. Fidelity > reuse. |
| Color tokens | Map Stitch tokens to our CSS variables (see Phase C.4) |
| Images | `next/image` + `urlFor()` always |
| Optional fields | Optional chaining + conditional render always |
| Schema type | Always `type: 'object'` for sections |
| Registration | schemas/index.ts + page document — no PageBuilder |
| Route pattern | One dedicated route file per screen |
| Query pattern | One named query per screen with explicit projections |
| Typegen | Run after all sections for a screen are registered and TS-clean |
| Visual check | Screenshot is the acceptance criterion |
