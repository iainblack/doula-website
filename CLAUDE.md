# CLAUDE.md — Stitch Site Template

You are working inside a Next.js + Sanity site template designed to turn Google Stitch UI designs into fully wired, CMS-connected websites. Read this file fully before doing anything. It defines your process, conventions, and every step required to go from a fresh clone to a deployed site.

---

## What This Template Is

Every project built from this template follows the same pattern:
- UI is designed in **Google Stitch**, imported via MCP
- **Section components** are translated directly from Stitch HTML — each one is a React component with a co-located Sanity schema
- Each screen has its own **Sanity document type** with named fields matching that screen's sections
- **Sanity Studio** (embedded at `/studio`) is the CMS — editors update content per page
- **Next.js App Router** has one dedicated route file per screen, fetching its own typed query
- **Tailwind CSS v4** with `@theme` in `globals.css` is the single source of truth for all design tokens

**No page builder / sections array.** Pages have fixed structure in code; only content is editable in Sanity.

The primary goal is **pixel-perfect fidelity to the Stitch design**. The Stitch HTML is the blueprint — components are translated from it, not generated from scratch. This is what ensures the site matches the design.

Section components are generated fresh per project. What is reusable is this template's architecture, shared types, and this process.

---

## How to Start Every Session

When the user opens a session in this project, **always begin by checking state**:

```
1. Does .env.local exist and contain NEXT_PUBLIC_SANITY_PROJECT_ID?
   → NO: Run the First-Time Setup below
   → YES: Ask the user what they want to do:
       a) "Import a Stitch design and build the site" → Run /design-dna first, then /build-screen per screen
       b) "Continue working on the site" → Check COMPONENTS.md and DESIGN.md for current state, ask what needs doing
       c) "Deploy" → Run the Deployment Checklist
```

Never assume the project is in a ready state. Always check first.

## Skills (Slash Commands)

This project uses two skills that encode the full build process. Use these instead of the manual pipeline steps in Part 2.

| Skill | When to use |
|-------|-------------|
| `/design-dna` | Once per project — extracts Stitch design DNA, applies theme to globals.css, updates fonts in layout.tsx |
| `/build-screen` | Once per screen — builds all sections for one screen end-to-end: schema → component → register → typegen → query → route → seed → verify |
| `/review-screen` | After each `/build-screen` — runs 12 automated checks, deep subagent analysis, and guided manual checks (visual, mobile, text overflow, navigation, CMS); writes results to SCORECARD.md |
| `/retrospective` | After all screens are reviewed — synthesizes SCORECARD.md patterns, proposes targeted improvements to skill files, applies approved changes |

**Always build screens one at a time.** Do not attempt to generate components for multiple screens in a single session. Complete each screen fully (including Sanity seed content and visual verification) before starting the next.

The recommended screen order for this project:
1. **Home** — establishes the most sections and shared patterns
2. **About** — likely reuses Hero/CTA patterns
3. **Services** — likely reuses card/grid patterns
4. **Classes & Workshops** — likely reuses service patterns
5. **Testimonials** — standalone, isolated
6. **Contact** — form, isolated

---

## Part 1: First-Time Setup

Run this once per new project clone. Guide the user through each step interactively — do not skip steps or assume they've been done.

### Step 1.1 — Verify dependencies
```bash
node --version    # Should be 18+
npm --version
```
If Node is below 18, tell the user to upgrade before continuing.

```bash
npm install
```
Run this if `node_modules` doesn't exist.

### Step 1.2 — Create a Sanity project

Tell the user:
> "We need to create a Sanity project. This will give you a project ID and dataset. Run the following — it will open a browser to log in or create a free account."

```bash
npx sanity@latest init --env
```

When prompted:
- **Project name**: use the site/client name
- **Dataset**: `production`
- **Project output path**: choose current directory (`.`)
- This will write `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` directly to `.env.local`

If the user already has a Sanity project they want to reuse, they can skip this and enter the project ID manually.

### Step 1.3 — Set up API tokens

Two tokens are needed. Tell the user:
> "Go to manage.sanity.io → your project → API → Tokens → Add API token."

**Token 1 — Read token (for Next.js server-side fetching):**
- Name: `Next.js Server`
- Permissions: `Viewer`
- Add to `.env.local`: `SANITY_API_TOKEN=...`

**Token 2 — Seed token (for populating Sanity with Stitch content):**
- Name: `Seed Script`
- Permissions: `Editor`
- Add to `.env.local`: `SANITY_SEED_TOKEN=...`

Also add a webhook secret:
```
SANITY_WEBHOOK_SECRET=some-random-secret-string
```

### Step 1.4 — Verify the connection

```bash
npm run dev
```

Navigate to `localhost:3000/studio`. The user should see the Sanity Studio login screen. If they see an error, check:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` is set correctly
- The Sanity project exists at manage.sanity.io
- CORS: go to manage.sanity.io → API → CORS Origins → add `http://localhost:3000`

Once `/studio` loads successfully, first-time setup is complete. Tell the user:
> "Setup is complete. The site is running and connected to Sanity. Ready to import your Stitch design."

---

## Part 2: The Stitch Pipeline

> **Use the skills instead of these steps.** The `/design-dna` and `/build-screen` skills encode this process with tighter checkpoints and a schema-first order that prevents the most common failure modes. The steps below are retained as reference only.
>
> The key difference from the steps below: **build one screen at a time**, and within each screen, **write schema before component**, **register in all 3 files before writing the component**, and **run typegen per screen** (not once at the end for all screens).

Run this when the user wants to build the site from a Stitch design. Work through all 7 steps in order. Do not skip ahead.

### Step 2.1 — Import from Stitch

Call `list_projects` via the Stitch MCP. Show the user their available projects and ask them to confirm which one to use.

Once confirmed:
- Call `list_screens` to enumerate all screens in the project
- For **each screen** (run in parallel where possible):
  - `extract_design_context` → captures Design DNA
  - `fetch_screen_code` → raw HTML
  - `fetch_screen_image` → base64 screenshot
- Aggregate all Design DNA results and write/update `DESIGN.md`

`DESIGN.md` should document:
- All colors with hex values and their semantic role (primary, background, surface, etc.)
- Font names, weights, and their roles (heading, body)
- Spacing values, border radii, shadow values
- A list of all screens imported and their purpose

Tell the user:
> "Imported [N] screens. Design DNA captured. Here's what I found: [brief summary of colors and fonts]. Moving on to theme generation."

### Step 2.2 — Generate Theme

Parse the Design DNA and write all values into `src/styles/globals.css` inside the `@theme {}` block.

**Rules:**
- Use semantic variable names (`--color-primary`, not `--color-4f46e5`)
- Always define: primary, primary-hover, primary-foreground, secondary, secondary-foreground, background, surface, border, foreground, muted
- Always define: font-heading, font-body
- Always define: radius-sm, radius-md, radius-lg, radius-full
- Always define: shadow-sm, shadow-md, shadow-lg
- Always define: spacing-section-y, spacing-section-x, max-width-content

**Font loading:**
Map Stitch font names to `next/font` imports in `src/app/layout.tsx`:
- Google Fonts (Inter, Sora, DM Sans, Geist, etc.) → `next/font/google`
- Unknown/custom fonts → `next/font/local`, note in `DESIGN.md` that font files need to be added manually

Apply font variables to the `<html>` tag:
```tsx
<html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
```

After writing the theme, confirm to the user:
> "Theme generated. Primary: [hex], accent: [hex], fonts: [heading] / [body]. All design tokens are now in globals.css."

### Step 2.3 — Analyse & Plan Sections

Read all screen HTML and screenshots. For each screen, identify distinct **sections** — contiguous regions of the page that serve a single purpose.

Classify each section into one of these types (or name a new type if genuinely novel):
- `Hero` — primary page header with headline, subheadline, CTA
- `FeatureGrid` — grid of features/benefits with icons or images
- `Testimonials` — social proof, quotes, reviews
- `Pricing` — pricing tiers, comparison table
- `CtaBanner` — standalone call-to-action block
- `RichText` — long-form text content (blog body, about page)
- `BlogGrid` — grid of blog post cards
- `ImageGallery` — image grid or carousel
- `Stats` — key numbers or metrics
- `Faq` — accordion-style questions and answers
- `LogoCloud` — row of partner/client logos
- `ContactForm` — contact form section
- `Navbar` — site navigation (layout component)
- `Footer` — site footer (layout component)

Then read `COMPONENTS.md`. If a section type already exists in the registry, it will be reused — do not regenerate it unless the user asks.

**Present a build plan to the user before writing any code:**
```
I found the following sections across your [N] screens:

NEW (to be generated):
  - Hero (Screen 1 — split layout with image)
  - FeatureGrid (Screen 1 — 3-column with icons)
  - Pricing (Screen 2 — 3-tier with monthly/annual toggle)
  - ...

REUSED (already in COMPONENTS.md):
  - Navbar
  - Footer
  - ...

Shall I proceed?
```

Wait for the user to confirm before generating anything.

### Step 2.4 — Generate Components

For **each NEW section type**, generate two files:

**`src/components/sections/[Name]/index.tsx`**
- Export a named React component
- Props interface matches the Sanity schema fields exactly
- Use Tailwind classes that reference CSS variables (`bg-primary`, `text-muted`, `rounded-lg`)
- Never hardcode colors, fonts, or spacing — always use theme variables
- Wrap in `<SectionWrapper>` for consistent vertical padding and max-width
- Mobile-first responsive — design for small screens first, use `md:` and `lg:` breakpoints
- Handle optional fields gracefully (use optional chaining, conditional rendering)
- Type props using the auto-generated types from `src/types/sanity.generated.ts` once typegen is run

**`src/components/sections/[Name]/schema.ts`**
- Export a named Sanity schema using `defineType`
- `type: 'object'` (sections are objects within a page's `sections` array, not top-level documents)
- Fields match the component's props exactly
- Use shared object types wherever applicable: `cta`, `seo`, `imageWithAlt`, `portableTextBlock`
- Add `validation: r => r.required()` on required fields
- Always include a `preview` config so editors see meaningful labels in Studio:
  ```ts
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || '[Section Name]', subtitle: '[Section Name] Section' }),
  }
  ```

After generating each component, immediately:
1. Add it to the `componentMap` in `src/components/PageBuilder.tsx`
2. Import its schema in `src/lib/sanity/schemas/index.ts`
3. Add `{ type: '[schemaName]' }` to the `sections.of` array in `src/lib/sanity/schemas/documents/page.ts`

### Step 2.5 — Run Type Generation

After all schemas are registered:

```bash
npx sanity@latest schema extract --enforce-required-fields
npx sanity-typegen generate
```

This regenerates `src/types/sanity.generated.ts`. All component props should now be typed from the Sanity schema.

If typegen fails, check:
- All schemas are imported in `src/lib/sanity/schemas/index.ts`
- No circular references in schema definitions
- `sanity.config.ts` is pointing to the correct schema index

### Step 2.6 — Wire Pages & Queries

**Map Stitch screens to Next.js routes:**
- Homepage screen → `src/app/page.tsx` (fetches page with slug `"home"`)
- Other full-page screens → handled by `src/app/[slug]/page.tsx`
- Blog index screen → `src/app/blog/page.tsx`
- Blog post screen → `src/app/blog/[slug]/page.tsx`

**Write or update GROQ queries in `src/lib/sanity/queries.ts`:**

Every query must project all fields needed by its components — do not use `*` projections in production queries. Write explicit field projections.

Required queries:
```ts
// All page slugs (for generateStaticParams)
export const allPageSlugsQuery = `*[_type == "page"].slug.current`

// Full page with all section data
export const pageBySlugQuery = `*[_type == "page" && slug.current == $slug][0]{
  title,
  slug,
  seo,
  sections[]{
    _type,
    _key,
    // ... project all fields for each section type
  }
}`

// Navbar and footer (fetched in root layout)
export const navbarQuery = `*[_type == "navbar"][0]{ logo, links, cta }`
export const footerQuery = `*[_type == "footer"][0]{ ... }`

// Blog
export const allPostsQuery = `*[_type == "post"] | order(publishedAt desc){ title, slug, excerpt, coverImage, publishedAt, author->{ name } }`
export const allPostSlugsQuery = `*[_type == "post"].slug.current`
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{ ... }`
```

**Verify all dynamic routes have both `generateStaticParams` and `generateMetadata`.**

**Add Sanity image domains to `next.config.ts`:**
```ts
images: {
  remotePatterns: [{ hostname: 'cdn.sanity.io' }]
}
```

### Step 2.7 — Update the Component Registry

Update `COMPONENTS.md` with every component that was generated:

```markdown
### [ComponentName]
- **Schema type:** `[schemaName]`
- **File:** `src/components/sections/[Name]/`
- **Fields:** [field: type, field: type, ...]
- **Layout:** [describe the visual layout derived from Stitch]
- **Added:** [date] from Stitch project "[project name]"
```

---

## Part 3: Post-Pipeline Verification

After the pipeline completes, run through this checklist **before** telling the user the site is ready.

### Step 3.1 — Dev server smoke test
```bash
npm run dev
```

Check:
- [ ] `localhost:3000` loads without errors (may be empty if no Sanity content yet)
- [ ] `localhost:3000/studio` loads the Sanity Studio
- [ ] No TypeScript errors in the terminal
- [ ] No missing module errors

Fix any errors before proceeding.

### Step 3.2 — Create seed content in Sanity

Tell the user:
> "The site is running but has no content yet. Let's create the minimum content needed to see it working. Go to localhost:3000/studio."

Walk the user through:

1. **Navbar** — Settings → Navigation. Add logo, nav links, and CTA button
2. **Footer** — Settings → Footer. Add links and copyright text
3. **Homepage** — Pages → New Page. Set slug to `home`. Add the Hero section and fill in headline + CTA. Publish.

After publishing, reload `localhost:3000`. The homepage should now render with real content.

### Step 3.3 — Set up the revalidation webhook

Tell the user:
> "Now we need to connect Sanity to Next.js so that when you publish content, the live site updates automatically. This takes 2 minutes."

Instruct them to:
1. Go to manage.sanity.io → your project → API → Webhooks
2. Click "Create webhook"
3. **Name**: "Next.js Revalidate"
4. **URL**: `https://your-deployed-site.com/api/revalidate` (for now, note this — they'll complete it after deployment)
5. **Trigger on**: Create, Update, Delete
6. **Filter**: Leave empty (trigger on all document types)
7. **Secret**: Use the same value as `SANITY_WEBHOOK_SECRET` in `.env.local`
8. Save

Note: The webhook URL needs the production domain, so remind the user to update it after deployment.

---

## Part 4: Deployment

### Step 4.1 — Push to GitHub

If no git remote is set up:
```bash
git init
git add .
git commit -m "Initial site from Stitch design: [project name]"
```
Tell the user to create a new repo on GitHub and add the remote:
```bash
git remote add origin https://github.com/[username]/[repo-name].git
git push -u origin main
```

### Step 4.2 — Deploy to Vercel

Tell the user to go to vercel.com → New Project → Import the GitHub repo.

Before clicking Deploy, they must add environment variables in Vercel's UI:
```
NEXT_PUBLIC_SANITY_PROJECT_ID   = [value from .env.local]
NEXT_PUBLIC_SANITY_DATASET      = production
SANITY_API_TOKEN                = [value from .env.local]
SANITY_WEBHOOK_SECRET           = [value from .env.local]
```

Then deploy.

### Step 4.3 — Post-deployment steps

Once deployed, run through:

1. **CORS** — manage.sanity.io → API → CORS Origins → Add `https://your-vercel-url.vercel.app`
2. **Webhook URL** — update the Sanity webhook URL from Step 3.3 to the real production URL
3. **Test revalidation** — make a small change in Sanity Studio, publish it, and verify it appears on the live site within 5–10 seconds
4. **Custom domain** (if applicable) — add it in Vercel, then add it to Sanity CORS origins as well

Tell the user:
> "The site is live. Any content published in Sanity Studio at [url]/studio will automatically appear on the live site. To make code changes, push to the GitHub repo and Vercel will redeploy automatically."

---

## Conventions Reference

Always follow these conventions when generating code. Do not deviate.

### Component conventions
- Components in `sections/` always accept typed props from Sanity schema
- Never hardcode content strings, colors, or spacing values
- Always use `SectionWrapper` for vertical rhythm
- Always handle optional fields — never assume a field is populated
- Mobile-first: base styles are mobile, use `md:` and `lg:` for larger screens
- Images always use `next/image` with `urlFor()` from the Sanity client

### Schema conventions
- Section schemas are always `type: 'object'` (not `document`)
- Always use shared types: `cta`, `imageWithAlt`, `seo`, `portableTextBlock`
- Always include `preview` config on every section schema
- Validation: `required()` on headline/title fields, optional on everything else
- Field order in Studio should match visual top-to-bottom order of the component

### Styling conventions
- All colours via Tailwind classes that map to CSS variables: `bg-primary`, `text-muted`, `border-border`
- All fonts via: `font-heading`, `font-body`
- All border radii via: `rounded-sm`, `rounded-md`, `rounded-lg`
- Never use arbitrary Tailwind values `[#abc123]` or `[16px]` — add to `@theme` instead
- Section vertical padding: `py-[--spacing-section-y]`
- Section max-width: `max-w-[--max-width-content] mx-auto px-[--spacing-section-x]`

### GROQ query conventions
- Always use explicit field projections — never `*` in production
- Dereference references inline: `author->{ name, image }`
- Always filter by `_type` first for performance
- Order posts by `publishedAt desc`

---

## Adding Per-Project Integrations

The template ships with stubs for common integrations. Add these as needed:

### Stripe
```bash
npm install stripe @stripe/stripe-js
```
Add to `.env.local`:
```
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```
Add a `(app)` route group for checkout/billing pages that sit outside the CMS page builder.

### Email (Resend)
```bash
npm install resend
```
Add to `.env.local`:
```
RESEND_API_KEY=
CONTACT_EMAIL_TO=
```
Update `src/actions/contact.ts` to use Resend for delivery.

### Analytics
Add `NEXT_PUBLIC_GA_ID` or similar to `.env.local` and inject the script in `layout.tsx`.

---

## Quick Reference

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Open Sanity Studio | `localhost:3000/studio` |
| Regenerate types | `npx sanity-typegen generate` |
| Deploy | Push to GitHub (Vercel auto-deploys) |
| Add new section | Generate component + schema, register in PageBuilder + schemas/index.ts + page.ts, run typegen |
| Change theme colours | Edit `@theme` block in `src/styles/globals.css` |
