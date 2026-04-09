# Build Quality Scorecard

This file tracks quality review results for every screen built in this project.
Updated automatically by `/review-screen`. Read by `/retrospective`.

---

## Summary

| Screen | Route | Date | Auto (13) | Visual | Mobile | CMS | Issues |
|--------|-------|------|-----------|--------|--------|-----|--------|
| Home | / | 2026-04-06 | 13/13 (1 fixed) | Passed inspection | — | — | 1H fixed, 3M, 3L |

---

## Per-Screen Results

### HOME — /

**Date:** 2026-04-06
**Stitch screen title:** Home (Centered Unique Section)
**Sections built (NEW):** Hero, ImageGallery, EditorialBlock, FeatureGrid, TestimonialQuote
**Sections reused (REUSE):** none

#### Automated Checks

| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | TypeScript | PASS | — |
| 2 | Production build | PASS | — |
| 3 | No hardcoded hex colors | PASS | — |
| 4 | No raw `<img>` tags | PASS | — |
| 5 | Page document in Studio structure | PASS | — |
| 6 | No `...` spread in GROQ | PASS | — |
| 7 | Registration consistency | PASS | All 5 schemas match all 5 page document fields |
| 8 | Schema `preview` config | PASS | — |
| 9 | Schema `type: 'object'` | PASS | — |
| 10 | No arbitrary Tailwind values | ~~FAIL~~ → PASS | Fixed: `min-h-[640px]`, `min-h-[720px]`, `border-[12px]` moved to `@theme` tokens |
| 11 | Char limits on short text fields | WARN | `overline`, `attribution`, `icon`, `linkLabel` missing `.max()` |
| 12 | Mobile-first responsive classes | PASS | — |
| 13 | Seed scripts exist and registered | PASS | `seed-home.mjs` + `seed-settings.mjs` both present |

**Score: 13/13** (after fix)

#### Explore Subagent Report

| File | Check | Result | Detail |
|------|-------|--------|--------|
| Hero/index.tsx | Props destructured in signature | PASS | — |
| Hero/index.tsx | Uses next/image | PASS | — |
| Hero/index.tsx | urlFor() + alt text | PASS | — |
| Hero/index.tsx | Optional fields use `?.` | PASS | — |
| Hero/index.tsx | Optional fields conditionally rendered | PASS | — |
| Hero/index.tsx | No hardcoded marketing copy | PASS | — |
| Hero/index.tsx | `'use client'` only when needed | PASS | — |
| Hero/index.tsx | Named export | PASS | — |
| Hero/index.tsx | Text overflow handling | FAIL | h1 and body `<p>` missing `line-clamp` or `overflow-hidden` |
| Hero/schema.ts | `type: 'object'` | PASS | — |
| Hero/schema.ts | `preview` with select + prepare | PASS | — |
| Hero/schema.ts | prepare returns title + subtitle | PASS | — |
| Hero/schema.ts | select.title field exists | PASS | — |
| Hero/schema.ts | Array items have preview | PASS | No arrays |
| Hero/schema.ts | required() only on headline fields | FAIL | `body` marked required — should be optional |
| Hero/schema.ts | Short text fields have `.max()` | FAIL | `overline` missing `.max()` |
| ImageGallery/index.tsx | All component checks | PASS | — |
| ImageGallery/schema.ts | select.title field exists | FAIL | `select: { images: 'images' }` — no title field mapped |
| ImageGallery/schema.ts | Array items have preview | FAIL | `{ type: 'imageWithAlt' }` items have no inline preview config |
| EditorialBlock/index.tsx | Text overflow handling | FAIL | h2 and body `<p>` missing overflow handling |
| EditorialBlock/schema.ts | required() only on headline fields | FAIL | `body` marked required — should be optional |
| EditorialBlock/schema.ts | Short text fields have `.max()` | FAIL | `highlightText` missing `.max()` |
| FeatureGrid/index.tsx | `'use client'` only when needed | FAIL | Present but no hooks/events used |
| FeatureGrid/index.tsx | Text overflow handling | FAIL | Feature titles, descriptions, link labels missing overflow handling |
| FeatureGrid/schema.ts | Short text fields have `.max()` | FAIL | `icon`, `linkLabel` missing `.max()` |
| TestimonialQuote/index.tsx | Text overflow handling | FAIL | Quote and attribution missing overflow handling |
| TestimonialQuote/schema.ts | select.title field exists | FAIL | `attribution` is optional — Studio label may be blank |
| TestimonialQuote/schema.ts | Short text fields have `.max()` | FAIL | `attribution` missing `.max()` |
| queries.ts | All query checks | PASS | — |

**Score: 60/89**

#### Visual Fidelity

Visual inspection passed. Formal per-section scoring skipped.

#### Manual Checks (3.2–3.7)

Skipped — user confirmed page looks good visually.

#### Issues Log

| # | Severity | Category | Description | Fixed? |
|---|----------|----------|-------------|--------|
| 1 | High | Auto | Hero: pixel values `min-h-[640px]`, `min-h-[720px]`, `border-[12px]` hardcoded instead of `@theme` tokens | Yes |
| 2 | Med | Schema | Hero + EditorialBlock: `body` field marked `required()` — should be optional | No |
| 3 | Med | Component | FeatureGrid: `'use client'` present with no hooks or browser APIs | No |
| 4 | Med | Component | Hero, EditorialBlock, FeatureGrid, TestimonialQuote: overflow-risk text fields missing `line-clamp`/`overflow-hidden` | No |
| 5 | Low | Schema | Missing `.max()` on: `overline`, `attribution`, `icon`, `linkLabel`, `highlightText` | No |
| 6 | Low | Schema | ImageGallery: array items missing inline `preview` config; `select` field doesn't map to a title | No |
| 7 | Low | Schema | TestimonialQuote: preview `select.title` maps to optional `attribution` — Studio label may be blank | No |
