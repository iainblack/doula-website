# Design DNA — Home (Doula Website)

## Creative Direction

**"The Mindful Editorial"** — a luxury lifestyle publication aesthetic that prioritises calm, held space through expansive whitespace and intentional asymmetry. The palette is rooted in earth: warm creams, soft beiges, and muted browns that evoke groundedness and organic warmth. Depth is achieved through tonal layering (stacking surface tiers) rather than shadows or borders. Typography creates tension between the authoritative Noto Serif for storytelling and the clean Inter for functional information.

---

## Colors

| Token | Hex | Tailwind Class | Role |
|-------|-----|----------------|------|
| primary | #6d5b45 | `bg-primary` | Primary CTAs, solid buttons, section accents |
| primary-hover | #54442e | — | Hover/active state for primary |
| primary-foreground | #ffffff | `text-primary-foreground` | Text on primary backgrounds |
| primary-container | #c8b196 | `bg-primary-container` | Hero overlays, gradient endpoints, subtle highlights |
| on-primary-container | #54442e | `text-on-primary-container` | Text on primary-container backgrounds |
| secondary | #645d55 | `bg-secondary` | Secondary buttons, ghost variants |
| secondary-foreground | #ffffff | `text-secondary-foreground` | Text on secondary backgrounds |
| secondary-container | #ebe1d6 | `bg-secondary-container` | Soft section backgrounds, tag chips |
| background | #fbf9f4 | `bg-background` | Page background (warm off-white) |
| surface | #fbf9f4 | `bg-surface` | Primary canvas — same as background |
| surface-container-lowest | #ffffff | `bg-surface-container-lowest` | Cards floating on container-low sections |
| surface-container-low | #f5f3ee | `bg-surface-container-low` | Alternating section backgrounds |
| surface-container | #f0eee9 | `bg-surface-container` | Standard card/panel backgrounds |
| surface-container-high | #eae8e3 | `bg-surface-container-high` | Elevated cards, hover states |
| surface-container-highest | #e4e2dd | `bg-surface-container-highest` | Ghost button hover, maximum elevation |
| surface-dim | #dbdad5 | `bg-surface-dim` | Overlay scrims |
| surface-variant | #e4e2dd | `bg-surface-variant` | Botanical watermark tints (5% opacity) |
| foreground | #1b1c19 | `text-foreground` | Primary text — warm near-black, never pure black |
| muted | #4d453d | `text-muted` | Secondary text, captions, helper text |
| border | #d0c5b9 | `border-border` | Ghost border fallback (use at 20% opacity only) |
| outline | #7f766c | `text-outline` | Medium-emphasis borders, form underlines |
| outline-variant | #d0c5b9 | — | Low-emphasis ghost border at 20% opacity |
| tertiary | #675d50 | `bg-tertiary` | Tertiary accents |
| tertiary-container | #c0b3a4 | `bg-tertiary-container` | Tertiary soft backgrounds |
| error | #ba1a1a | `text-error` | Error states |
| error-container | #ffdad6 | `bg-error-container` | Error message backgrounds |

### Brand Gradient
Hero overlays and primary CTA blocks: `bg-gradient-to-br from-primary to-primary-container`

---

## Typography

| Token | Font Name | Source | Role |
|-------|-----------|--------|------|
| font-heading | Noto Serif | Google Fonts | Headlines, display text, section titles — conveys wisdom and heritage |
| font-body | Inter | Google Fonts | Body text, UI labels, navigation — ensures legibility and professionalism |

**Scale notes from design system:**
- Display large: ~3.5rem, tight tracking (`tracking-tight`) — editorial impact for hero headlines
- Overlines/labels above headlines: `text-xs uppercase tracking-widest text-muted`
- Body: `leading-relaxed` for extended reading comfort

---

## Spacing & Layout

| Token | Value | Usage |
|-------|-------|-------|
| spacing-section-y | 6rem | Vertical section padding — generous whitespace is a brand pillar |
| spacing-section-x | 2rem | Horizontal section padding |
| max-width-content | 1280px | Content container max-width |

**Layout philosophy:** Prefer 2/3 + 1/3 asymmetric splits over equal columns. When a section feels "full", double the padding. Minimum section padding is `py-24`.

---

## Border Radius

| Token | Value | Notes |
|-------|-------|-------|
| radius-sm | 0.125rem | Fine details, tags |
| radius-md | 0.375rem | Buttons, inputs — "md (0.375rem) roundedness" per design spec |
| radius-lg | 0.5rem | Cards, panels |
| radius-full | 9999px | Pills, avatars |

---

## Shadows

Ultra-diffused, low-opacity — tinted with `on-surface` (#1b1c19) to mimic natural light. Used only for floating elements (modals, dropdowns). Depth in regular layouts comes from tonal layering, not shadows.

| Token | Value |
|-------|-------|
| shadow-sm | `0 1px 2px rgba(27, 28, 25, 0.04)` |
| shadow-md | `0 4px 40px rgba(27, 28, 25, 0.05)` |
| shadow-lg | `0 10px 60px rgba(27, 28, 25, 0.06)` |

---

## Design Rules

**Reference these in every component. These are non-negotiable brand standards.**

### DO:
1. **Define section boundaries with tonal transitions** — shift from `bg-surface` to `bg-surface-container-low` between sections. Never use `border-t` or `border-b` to divide sections.
2. **Use tonal layering for card depth** — `bg-surface-container-lowest` card on `bg-surface-container-low` section = natural depth without shadows.
3. **Glassmorphism for Navbar** — `bg-surface/80 backdrop-blur-[20px]` on the sticky nav. Underlying content bleeds through softly.
4. **Brand gradient on hero overlays** — `bg-gradient-to-br from-primary to-primary-container` on hero background overlays and primary CTA blocks.
5. **Intentional asymmetry** — use `grid-cols-3 col-span-2` + `col-span-1` splits. Offset images from text blocks.
6. **Generous negative space** — default to `py-24`. When in doubt, add more whitespace.
7. **Botanical watermark texture** — `bg-surface-variant opacity-5` behind text blocks for subtle organic depth.
8. **Foreground text = `text-foreground` (#1b1c19)** — never `text-black` or `#000000`.
9. **Editorial overlines** — labels above headlines: `text-xs uppercase tracking-widest text-muted font-body`.
10. **Serif headlines** — all `<h1>`, `<h2>`, `<h3>` use `font-heading` (Noto Serif).

### DON'T:
1. **No 1px borders** to separate sections, header from hero, or footer from content.
2. **No pure black** — always `text-foreground`.
3. **No standard 3-equal-column grids** — they look like templates.
4. **No heavy drop shadows** — tonal layering only. `shadow-md`/`shadow-lg` reserved for floating modals.
5. **No 100% opaque borders on form inputs** — use `border-outline/20` (20% opacity) or a soft underline style.
6. **No hardcoded hex colors** in components — always CSS variable Tailwind classes.

---

## Component Patterns

### Buttons
- **Primary**: `bg-primary text-primary-foreground rounded-md hover:bg-primary-hover`
- **Ghost/Secondary**: `border border-border/20 text-foreground rounded-md hover:bg-surface-container-highest`

### Input Fields
- Soft underline: `border-b border-outline/40 bg-transparent focus:border-primary`
- Or filled: `bg-surface-container-low rounded-sm focus:bg-surface-container`
- Helper text: `text-xs text-muted mt-1`

### Cards
- `bg-surface-container-lowest rounded-lg p-6` — no border, tonal depth only

### Navbar
- `bg-surface/80 backdrop-blur-[20px]` sticky — glassmorphism
- Links: `text-foreground hover:text-primary`

### Editorial Accordion
- Title: `font-heading text-foreground` with `text-primary` icon indicator
- Expanded state: background shifts to `bg-surface-container-low`

---

## Screens

| ID | Title | Route | Purpose |
|----|-------|-------|---------|
| 201ebcf4ff8249ef8c929bc2de7f2ca0 | Home (Centered Unique Section) | `/` | Homepage — primary marketing page |
| a0bef00e674b469fb336fb537966f325 | About Me (Updated CTA) | `/about` | Doula bio and personal story |
| 12579713fc914513be07f0c643714231 | Services (Updated Header & Section) | `/services` | Service offerings and pricing |
| c38f49d7d6af44fb957461d37b7e0d68 | Classes & Workshops (No Testimonials) | `/classes` | Class listings and registration |
| 5f2df4f1e0cb413ba6544371876e564c | Testimonials (Long-form) | `/testimonials` | Client testimonials and reviews |
| b4155e54d85d47f5ad71eb7a244c9b87 | Contact | `/contact` | Contact form and booking |

### Recommended build order
1. **Home** — establishes all shared components with full variant flexibility
2. **About Me** — reuses Hero, EditorialBlock, TestimonialQuote, adds CtaBanner + Certifications
3. **Services** — reuses Hero, CtaBanner; adds ServiceCards, Faq
4. **Classes & Workshops** — reuses Hero; adds ClassGrid, NewsletterSignup
5. **Testimonials** — reuses Hero, CtaBanner; adds TestimonialGrid
6. **Contact** — reuses Hero; adds ContactDetail, ContactForm

---

## Section Inventory

Cross-screen component map. Generated before first build to ensure shared components are designed with all variants in mind. **Consult this before writing any schema or component.**

### Shared Components (2+ screens — must be designed for all variants upfront)

#### `Hero` — ALL 6 screens
| Screen | overline | headline | subheadline | body | image | primaryCta | secondaryCta | hasGradientBg |
|--------|----------|----------|-------------|------|-------|------------|--------------|---------------|
| Home | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ |
| About Me | ✓ tagline | ✓ | — | ✓ | ✓ headshot | — | — | — |
| Services | — | ✓ | ✓ | ✓ | — | — | — | — |
| Classes | — | ✓ | ✓ | ✓ | ✓ workshop | — | — | — |
| Testimonials | — | ✓ | ✓ | ✓ | — | — | — | — |
| Contact | — | ✓ | — | ✓ | — | — | — | — |

**All fields must be optional except `headline`.**

#### `EditorialBlock` — Home + About Me
| Screen | heading | body | pullQuote | image | highlightText |
|--------|---------|------|-----------|-------|---------------|
| Home ("What Makes Me Unique") | ✓ | ✓ | — | — | ✓ |
| About Me ("My Philosophy") | ✓ | ✓ | ✓ | ✓ right | — |

Layout: full-width when no image; 2/3 text + 1/3 image when image present.

#### `TestimonialQuote` — Home + About Me
| Screen | quote | attribution | image |
|--------|-------|-------------|-------|
| Home | ✓ | ✓ | — |
| About Me | ✓ | ✓ | ✓ |

#### `CtaBanner` — About Me + Services (strip) + Testimonials
| Screen | heading | body | primaryCta | secondaryCta |
|--------|---------|------|------------|--------------|
| About Me | ✓ | ✓ | "Let's Connect" | "View Packages" |
| Services (strip) | — | — | "Get in Touch" | — |
| Testimonials | ✓ | ✓ | "Schedule a Consultation" | "View All Services" |

`heading` and `body` must be optional to support the Services strip variant.

---

### Screen-Specific Components (1 screen only)

| Component | Screen | Fields |
|-----------|--------|--------|
| `ImageGallery` | Home | `images[]` (imageWithAlt) |
| `FeatureGrid` | Home | `heading`, `features[]` (icon, title, description, linkLabel, linkUrl) |
| `Certifications` | About Me | `heading`, `subheading`, `certifications[]` (icon, title, issuer, detail, certUrl) |
| `ServiceCards` | Services | `services[]` (icon, title, description, features[]`, pricing, cta?, image?) |
| `Faq` | Services | `heading?`, `faqs[]` (question, answer) |
| `ClassGrid` | Classes | `heading`, `subheading`, `body`, `classes[]` (title, date, time, location, description, price, ctaLabel, ctaUrl) |
| `NewsletterSignup` | Classes | `heading`, `body`, `buttonLabel` |
| `TestimonialGrid` | Testimonials | `testimonials[]` (rating, quote, body, attribution, images[]) |
| `ContactDetail` | Contact | `contactMethods[]` (icon, label, value, url), `image?`, `pullQuote?` |
| `ContactForm` | Contact | `heading`, `buttonLabel`, `subjectOptions[]` |
