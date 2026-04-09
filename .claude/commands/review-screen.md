# /review-screen — Quality Review for One Built Screen

Run this skill immediately after `/build-screen` completes for a screen.
It performs automated checks, guides manual visual and CMS review, and writes results to SCORECARD.md.

---

## Phase 0 — Setup

Ask the user: "Which screen are we reviewing?" and "What is the route? (e.g. `/` or `/about`)"

Read `COMPONENTS.md` to identify which section components were NEW (generated) vs. REUSE for this screen. Component-level checks in Phases 1 and 2 apply only to NEW sections. Registration and GROQ checks apply to all sections on the page.

---

## Phase 1 — Automated Shell Checks

Run every command below. Capture pass/fail and output for each. **Do not stop on failure — run all 13 and collect all results.**

### 1.1 — TypeScript
```bash
npx tsc --noEmit 2>&1 | head -60
```
PASS: zero output.
FAIL: any output. Note: errors in files outside `src/components/sections/` are pre-existing — flag separately, do not count against this screen's score.

### 1.2 — Production build
```bash
npm run build 2>&1 | tail -30
```
PASS: output contains "Route (app)" table, no error lines.
FAIL: output contains "Error:", "Type error:", or "Failed to compile".

### 1.3 — No hardcoded hex colors
```bash
grep -rn "#[0-9a-fA-F]\{3,6\}" src/components/sections/ --include="*.tsx" --include="*.ts"
```
PASS: no output.
FAIL: any match. Each match is a violation — colors must use Tailwind CSS variable classes (`bg-primary`, `text-muted`, etc.).

### 1.4 — No raw `<img>` tags
```bash
grep -rn "<img" src/components/sections/ --include="*.tsx"
```
PASS: no output.
FAIL: any match. All images must use `next/image`.

### 1.5 — Page document registered in Studio structure
```bash
grep -n "[screenName]Page\|homePage\|aboutPage\|servicesPage\|classesPage\|testimonialsPage\|contactPage" src/sanity/structure.ts
```
PASS: the page document type for this screen appears in `structure.ts`.
FAIL: missing — editors won't see this page in Studio navigation.

### 1.6 — No `...` spread in GROQ queries
```bash
grep -n "\.\.\." src/lib/sanity/queries.ts
```
PASS: no output.
FAIL: any match. The `...` placeholder from the template must be replaced with explicit field projections.

### 1.7 — Registration consistency across both files
```bash
# Schemas registered in schemas/index.ts:
grep "components/sections" src/lib/sanity/schemas/index.ts

# Named section fields in the page document:
grep "name:" src/lib/sanity/schemas/documents/[screenName]Page.ts
```
PASS: every section schema imported in `schemas/index.ts` has a corresponding named `defineField` in the page document, and vice versa.
FAIL: any asymmetry — a schema imported but not in the page document (won't appear in Studio), or a field in the page doc that has no registered schema (Studio error).

Note: replace `[screenName]Page.ts` with the actual filename, e.g. `homePage.ts`, `aboutPage.ts`.

### 1.8 — Schema `preview` config on all section schemas
```bash
grep -rL "preview:" src/components/sections/*/schema.ts 2>/dev/null
```
PASS: no output (`-L` lists files that do NOT match — no output means all have `preview:`).
FAIL: any file listed is missing a `preview:` block.

### 1.9 — Section schemas use `type: 'object'`
```bash
grep -rn "type: 'document'" src/components/sections/*/schema.ts 2>/dev/null
```
PASS: no output.
FAIL: any match. Sections must be `type: 'object'`, never `type: 'document'`.

### 1.10 — No arbitrary Tailwind values
```bash
grep -rn "className.*\[[0-9]" src/components/sections/ --include="*.tsx"
```
Note: `py-[--spacing-section-y]` and similar CSS variable refs (containing `--`) are **acceptable**. Only flag numeric arbitrary values like `[16px]`, `[340px]`, or `[#abc]`.

PASS: no matches, or only matches containing `--` (CSS variable references).
FAIL: any match with a numeric or hex arbitrary value.

### 1.11 — Short text fields have character limits
```bash
grep -rn "r\.max\|\.max(" src/components/sections/*/schema.ts 2>/dev/null
```
This is a signal check — absence of `.max()` doesn't auto-fail, but cross-reference: do headline, CTA label, and nav link fields have `validation: r => r.required().max(N)`? If none of the new schemas have any `.max()` validations, flag as Med severity.

### 1.12 — Mobile-first responsive classes present
```bash
grep -rn "md:\|lg:" src/components/sections/*/index.tsx 2>/dev/null
```
PASS: every `index.tsx` with a multi-column or layout-shifting design has at least one `md:` or `lg:` class.
FAIL: a component with a multi-column Stitch design has no responsive breakpoint classes. If all components are single-column by design, note "single-column layout — responsive classes not required."

### 1.13 — Seed scripts exist and are registered
```bash
# Per-screen seed:
ls scripts/seed-[screen].mjs 2>/dev/null
grep "seed:[screen]" package.json

# Settings seed (navbar + footer — required on every project):
ls scripts/seed-settings.mjs 2>/dev/null
grep "seed:settings" package.json
```
PASS: per-screen seed file exists AND is in `package.json`; `seed-settings.mjs` exists AND is in `package.json`.
FAIL: missing either the screen seed or the settings seed. Without them, content must be entered manually in Studio — defeating the automation goal.

Note: `seed-settings.mjs` is created once on the first screen and reused for all subsequent screens. If reviewing a screen other than the first, it must already exist.

---

## Phase 2 — Explore Subagent: Deep Component Analysis

Spawn an **Explore subagent** with the prompt below. Pass it the exact file paths of the NEW section components and schemas built in this screen.

---

**Subagent prompt (fill in [paths] before sending):**

> You are a code reviewer for a Next.js + Sanity + Tailwind v4 project. Review the files listed below and return a structured report. Do not edit any files.
>
> **Files to review:**
> - `[src/components/sections/Name/index.tsx]` (repeat for each new section)
> - `[src/components/sections/Name/schema.ts]` (repeat for each new section)
> - `src/lib/sanity/queries.ts`
>
> **Component checks (each index.tsx):**
> 1. Props are destructured directly in the function signature — not via a single `props` object
> 2. Every image uses `next/image`, not `<img>`
> 3. Every image uses `urlFor(x.image).url()` for src and `x.alt` for alt text
> 4. Optional fields use `?.` before accessing sub-properties
> 5. Optional fields are wrapped in conditional renders: `{field && <div>...</div>}`
> 6. No hardcoded content strings (marketing copy, names, sentences) — only structural strings like class names are acceptable
> 7. `'use client'` is only present if the component uses `useState`, `useEffect`, `useRef`, event handlers, or browser APIs
> 8. Component is a named export, not a default export
> 9. Text that could overflow (headlines, card titles, nav labels, button text) uses `truncate`, `line-clamp-X`, or `overflow-hidden` as appropriate
>
> **Schema checks (each schema.ts):**
> 1. Top-level `type: 'object'`
> 2. `preview` block present with both `select` and `prepare`
> 3. `prepare` returns both `title` and `subtitle`
> 4. The field referenced in `select.title` exists in the `fields` array
> 5. Array item objects have their own `preview` config
> 6. `validation: r => r.required()` only on headline/title fields — not on body text, images, CTAs, or optional content
> 7. Short text fields (headline, CTA label, nav label, card title) have `.max(N)` in their validation
>
> **Query checks (queries.ts):**
> 1. No `...` spread in any exported query string
> 2. The screen's dedicated query (e.g. `homePageQuery`, `aboutPageQuery`) has an explicit projection for every named section field in the page document — no section field is missing from the query
> 3. Image projections include `{ asset->{ _id, url }, hotspot, crop }` — not just bare `image`
>
> **Return format:** A markdown table with columns: File | Check | Result (PASS/FAIL) | Detail (quote the offending code on FAIL, "—" on PASS).
> End with: "X of Y checks passed."

---

Collect the subagent's table. Paste it verbatim into the SCORECARD.md entry.

---

## Phase 3 — Manual Checks

Present each prompt to the user. Record their responses. Do not skip any section.

> **Before starting:** confirm the dev server is running at `localhost:3000`. If not, run `npm run dev` in a separate terminal first.

### 3.1 — Visual fidelity

> "Open `localhost:3000/[route]` in your browser. Alongside it, open the Stitch screenshot for this screen.
>
> For each section, score visual fidelity **1–5**:
> - **1** = major deviation (wrong layout, section missing, columns wrong)
> - **2** = noticeable issues (wrong spacing rhythm, wrong font weight, wrong color)
> - **3** = close, minor issues (slightly off padding, small color discrepancy)
> - **4** = very close, only pixel-level differences
> - **5** = pixel-perfect
>
> Score each section and note specific differences:"

For each new section, ask: "Section **[Name]** — score and differences?"

### 3.2 — Design rules audit

> "Open `DESIGN.md` and read the **Design Rules** section. For each rule, check the rendered page in your browser.
>
> Pay particular attention to:
> - **Borders**: Open DevTools → inspect section edges. Any `1px solid` borders? (Should use tonal background changes instead)
> - **Shadows**: Any `box-shadow` or `drop-shadow` on non-floating elements? (Should use tonal layering)
> - **Typography scale**: Are heading sizes using the defined scale?
> - **Color usage**: Are accent colors only used as specified in DESIGN.md?
>
> List any design rule violations you find."

### 3.3 — Mobile responsiveness

> "In your browser, open DevTools (F12) → click the device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M).
>
> Test at these three widths. For each, score layout **1–5** (1=broken, 3=acceptable, 5=designed for this size) and note specific issues:
>
> - **375px** (iPhone SE) — check: text readable? columns stacked? images not cropped? no horizontal scroll?
> - **430px** (iPhone 15 Pro Max) — same checks
> - **768px** (iPad) — check: is this a good middle state, or does it look like a stretched mobile or compressed desktop?
>
> Also check: does any text overflow its container horizontally? Any elements clipping outside the viewport? Any touch targets under 44px tall?"

### 3.4 — Text overflow

> "We're going to stress-test the text fields. Go to `localhost:3000/studio`, open this page's content, and for each text field:
>
> 1. **Short test**: Replace the content with 1–2 words (e.g. 'Hi'). Publish. Reload `localhost:3000/[route]`. Does the layout hold?
> 2. **Long test**: Replace with a very long string — paste the same sentence 5 times in a row. Publish. Reload. Does the text truncate or wrap gracefully, or does it overflow and break the layout?
>
> Also check: does Sanity Studio show a character count or limit warning for headline/CTA fields? (It should — missing `.max()` validation means no guard for editors.)
>
> List any fields that broke the layout, or any fields missing Studio char limits."

### 3.5 — Navigation

> "Click every link in the Navbar on `localhost:3000/[route]`.
>
> For each link:
> - Does the correct page load?
> - Does the nav show an active/current state for the current page?
> - Any 404s?
>
> Then test keyboard navigation: press **Tab** from the top of the page. Do focus indicators appear? Can you reach all nav links and CTAs via keyboard?
>
> If the screen has in-page anchor links (e.g. 'scroll to contact'), click them and confirm they scroll to the right section."

### 3.6 — CMS usability

> "Stay in Sanity Studio at `localhost:3000/studio`. Open this page and click into each section.
>
> For each field, evaluate:
> 1. Is the **field label** clear to a non-technical client? ('Subheadline' is fine; 'cta' is not)
> 2. Is the **field order** logical — does it match top-to-bottom page order?
> 3. Are **optional fields** clearly distinguishable from required ones? (Required = red asterisk in Studio)
> 4. For **image fields**: does the upload flow work? Is hotspot cropping available?
>
> Rate overall CMS usability **1–5** (1 = a client would be confused without training; 5 = a client could use it without any explanation).
>
> List specific field label or ordering improvements."

### 3.7 — Content round-trip

> "Final check. In Sanity Studio, ensure all fields are filled and the page is **Published** (not just saved as draft). Then:
>
> - Hard-reload `localhost:3000/[route]` (Cmd+Shift+R / Ctrl+Shift+R)
>
> Confirm each item:
> - [ ] Page renders with all published content visible
> - [ ] No blank sections (would indicate a missing GROQ projection or a conditional render blocking an always-present section)
> - [ ] All images load (check Network tab — they should come from `cdn.sanity.io`)
> - [ ] No errors in the browser console (F12 → Console tab)
> - [ ] Page title in browser tab matches the SEO title set in Studio"

---

## Phase 4 — Write SCORECARD.md

Read `SCORECARD.md`. If it does not exist, create it with the full template structure below, then append this screen's entry.

If it exists, append a new screen entry following the template. Also update the **Summary table** at the top.

**Summary table row format:**
```
| [Screen Name] | /[route] | YYYY-MM-DD | X/12 | X.X/5 | X.X/5 | X/5 | X (XH XM XL) |
```
Visual score = average across all sections. Mobile score = average across 3 breakpoints.

**Per-screen entry template:**

```markdown
---

### [SCREEN NAME] — /[route]

**Date:** YYYY-MM-DD
**Stitch screen title:** [title]
**Sections built (NEW):** [SectionA], [SectionB]
**Sections reused (REUSE):** [SectionC] or "none"

#### Automated Checks

| # | Check | Result | Detail |
|---|-------|--------|--------|
| 1 | TypeScript | PASS/FAIL | [error summary or —] |
| 2 | Production build | PASS/FAIL | [error lines or —] |
| 3 | No hardcoded hex colors | PASS/FAIL | [file:line or —] |
| 4 | No raw `<img>` tags | PASS/FAIL | [file:line or —] |
| 5 | Page document in Studio structure | PASS/FAIL | [missing or —] |
| 6 | No `...` spread in GROQ | PASS/FAIL | [line number or —] |
| 7 | Registration consistency | PASS/FAIL | [mismatch detail or —] |
| 8 | Schema `preview` config | PASS/FAIL | [missing schema or —] |
| 9 | Schema `type: 'object'` | PASS/FAIL | [file:line or —] |
| 10 | No arbitrary Tailwind values | PASS/FAIL | [file:line or —] |
| 11 | Char limits on short text fields | PASS/FAIL/WARN | [missing fields or —] |
| 12 | Mobile-first responsive classes | PASS/FAIL | [component or —] |
| 13 | Seed script exists and registered | PASS/FAIL | [missing file or entry or —] |

**Score: X/13**

#### Explore Subagent Report

| File | Check | Result | Detail |
|------|-------|--------|--------|
| [paste subagent table rows here] | | | |

**Score: X/Y**

#### Visual Fidelity

| Section | Score (1–5) | Differences |
|---------|-------------|-------------|
| [Section] | [score] | [description or "none"] |

**Average: X.X/5** | **Lowest: X/5**

#### Design Rules Audit

| Rule | Honored | Notes |
|------|---------|-------|
| [rule] | Yes/No | [detail or —] |

#### Mobile Responsiveness

| Breakpoint | Score (1–5) | Issues |
|------------|-------------|--------|
| 375px (iPhone SE) | [score] | [issues or "none"] |
| 430px (iPhone Pro Max) | [score] | [issues or "none"] |
| 768px (iPad) | [score] | [issues or "none"] |

**Average mobile score: X.X/5**

#### Text Overflow

| Field | Short value OK | Long value OK | Studio char limit | Notes |
|-------|---------------|---------------|-------------------|-------|
| [field] | Yes/No | Yes/No | Yes/No | [notes or —] |

#### Navigation

| Link | Destination | Loads | Active state | Notes |
|------|-------------|-------|-------------|-------|
| [label] | /[route] | Yes/No | Yes/No | [notes or —] |

Keyboard navigation: [PASS / FAIL — detail]

#### CMS Usability

**Score: X/5**

| Field | Label clear | Order logical | Notes |
|-------|-------------|---------------|-------|
| [field] | Yes/No | Yes/No | [notes or —] |

Improvements:
- [list or "none"]

#### Content Round-Trip

- [ ] Page renders with all published content
- [ ] No blank sections
- [ ] Images load from cdn.sanity.io
- [ ] No browser console errors
- [ ] Page title matches SEO field

Notes: [any failures or "all passed"]

#### Issues Log

| # | Severity | Category | Description | Fixed? |
|---|----------|----------|-------------|--------|
| 1 | High/Med/Low | Auto/Visual/Schema/CMS/Query/Mobile | [description] | Yes/No/Deferred |

**Severity definitions:**
- **High**: convention violation (hardcoded color, wrong schema type, broken registration, page document missing from Studio structure, missing responsive classes)
- **Med**: quality deviation (visual score ≤ 2, incomplete GROQ projection, missing char limits, CMS score ≤ 2, layout breaks on mobile)
- **Low**: improvement opportunity (field label clarity, minor visual discrepancy, nice-to-have char limit)
```

---

## Phase 5 — Report

Tell the user:

> "Review complete for **[Screen Name]**.
>
> Automated: **X/13** | Visual: **X.X/5** | Mobile: **X.X/5** | CMS: **X/5**
> Issues: **X total** (X High, X Med, X Low)
>
> Results written to SCORECARD.md."

If any **High** severity issues exist:
> "**There are X High severity issues that should be fixed before building the next screen:**
> [list each High issue]
> These are convention violations that will compound if carried into subsequent screens."

If all checks passed:
> "Clean build. Ready for the next screen — run `/build-screen` to continue."

Otherwise:
> "Run `/build-screen` for the next screen when ready, or address the issues above first. Run `/retrospective` when all screens are complete."
