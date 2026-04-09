# /design-dna — Extract Stitch Design DNA and Apply Theme

Run this skill ONCE at the start of a project, before building any screens.
It extracts design tokens from Stitch and applies them to the codebase.

---

## What this skill does

1. Calls `list_projects` → `list_screens` to discover the project
2. Extracts theme tokens from the project's `designTheme` field
3. Writes `DESIGN.md` with colors, fonts, spacing, and screen list
4. Rewrites the `@theme` block in `src/styles/globals.css`
5. Updates `src/app/layout.tsx` with the correct `next/font` imports
6. Verifies TypeScript is clean

That's it. Section planning happens in `/build-screen` where you have the actual HTML.

---

## Steps

### Step 1 — Confirm the project

Call `list_projects`. Show the user the available projects and ask which one to use. Wait for confirmation.

### Step 2 — List screens

Call `list_screens` for the confirmed project. Display the screen titles, IDs, and note their routes.

### Step 3 — Extract design tokens

The design context lives in the project's `designTheme` field from `list_projects` / `get_project`. You already have it — no per-screen calls needed for theme extraction.

Extract:
- `namedColors` → semantic color map
- `headlineFont` / `bodyFont` → typography
- `spacingScale` → derive section spacing
- `roundness` → border radius scale
- `designMd` → creative direction and design rules

### Step 4 — Write DESIGN.md

```markdown
# Design DNA — [Project Name]

## Creative Direction
[2-3 sentence summary from designMd]

## Colors
| Token | Hex | Tailwind Class | Role |
...

## Typography
| Token | Font | Source | Role |
...

## Spacing & Layout
| Token | Value | Usage |
...

## Border Radius
| Token | Value |
...

## Shadows
| Token | Value |
...

## Design Rules
[Key do's and don'ts from designMd — these must be referenced when building components]

## Screens
| ID | Title | Route | Purpose |
...
```

Include ALL screens in the table with their IDs — `/build-screen` uses these IDs to call `get_screen`.

Recommended build order (most complex first):

### Step 5 — Rewrite globals.css @theme block

Read `src/styles/globals.css`. Replace the `@theme { ... }` block.

Rules:
- Semantic names only — `--color-primary`, never `--color-6d5b45`
- Always define: `primary`, `primary-hover`, `primary-foreground`, `secondary`, `secondary-foreground`, `background`, `surface`, all `surface-container-*` tiers, `foreground`, `muted`, `border`, `outline`, `outline-variant`
- Font fallbacks (next/font overrides at runtime)
- Spacing: `spacing-section-y`, `spacing-section-x`, `max-width-content`
- Radius: `radius-sm`, `radius-md`, `radius-lg`, `radius-full`
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`
- Never use `var()` inside `@theme` — literal values only

Also add any custom tokens needed for this design (e.g. `tracking-extra-wide` for wide letter-spacing overlines).

### Step 6 — Update layout.tsx fonts

Read `src/app/layout.tsx`. Replace font imports with the actual fonts from the design.

- Google Fonts → `next/font/google`
- Unknown fonts → `next/font/local`, note in DESIGN.md that files need to be added
- Each font gets its own `variable` name
- Both variables applied to `<html>` tag
- Material Symbols (if used by design) → add as `<link>` in `<head>`, not via next/font

### Step 7 — Verify

```bash
npx tsc --noEmit
```

Fix any errors before finishing.

### Step 8 — Report

> "Design DNA applied.
> Primary: [hex] | Background: [hex]
> Heading: [font] | Body: [font]
> [N] screens ready to build.
>
> Recommended build order: [list]
> Run `/build-screen` to start."
