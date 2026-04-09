# Stitch Site Template

A Next.js + Sanity template for turning Google Stitch UI designs into production websites. Claude reads `CLAUDE.md` and handles the full pipeline — you focus on the design.

## Quick Start

```bash
# 1. Clone this template (no git history)
npx degit your-username/stitch-site-template my-new-site
cd my-new-site
npm install

# 2. Open Claude Code
claude
```

Tell Claude: **"Set up this project"** — it will walk you through connecting Sanity and getting the dev server running.

Then tell Claude: **"Import Stitch project [your project name] and build the site"** — it handles the rest.

## What Claude Does

1. Imports your Stitch design via MCP (screens, HTML, Design DNA)
2. Generates your theme — all colours, fonts, and spacing into `globals.css`
3. Analyses each screen and identifies reusable sections
4. Builds React components + Sanity schemas for each section
5. Wires up all pages, queries, and routes
6. Guides you through Sanity content setup and deployment

## Stack

- **Next.js 15** — App Router, TypeScript
- **Tailwind CSS v4** — CSS-first, `@theme` block for design tokens
- **Sanity v3** — Embedded Studio at `/studio`, page builder pattern
- **Vercel** — Deployment

## Environment Variables

Copy `.env.local.example` to `.env.local`. Claude will help you fill these in:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_WEBHOOK_SECRET=
```

## Project Structure

```
src/
  app/               # Next.js routes
  actions/           # Server Actions (forms)
  components/
    sections/        # Generated per project from Stitch
    layout/          # Navbar, Footer
    ui/              # Shared atoms (Button, Card, SectionWrapper)
  lib/sanity/        # Client, queries, schemas
  styles/            # globals.css — single source of truth for design tokens
  types/             # Auto-generated Sanity types
CLAUDE.md            # Pipeline instructions (Claude reads this)
COMPONENTS.md        # Registry of generated sections
DESIGN.md            # Design DNA from Stitch
```

## Manual Steps

Claude automates everything it can. The only things that require you:

- **Sanity login** — `npx sanity@latest init` opens a browser
- **API token** — generated at manage.sanity.io
- **Vercel deploy** — add env vars in Vercel's UI before first deploy
- **Webhook URL** — update in Sanity dashboard after getting the production URL
- **CORS** — add your production domain in manage.sanity.io → API → CORS Origins
