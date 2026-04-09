# Component Registry

Tracks all section components. Status: `BUILT` = schema written, component translated from Stitch HTML, typegen run.

Add an entry here after completing Phase J of `/build-screen`.

---

## Section Components

### Hero
- **Status:** BUILT
- **Schema type:** `hero`
- **File:** `src/components/sections/Hero/`
- **Fields:** overline, headline (req), headlineEmphasis, body, image (imageWithAlt), accentImage (imageWithAlt), primaryCta (cta), secondaryCta (cta), hasGradientBg (boolean)
- **Used by:** `homePage`
- **Layout:** Asymmetric `lg:grid-cols-12` — 6/12 text left, 6/12 overlapping images right. Accent image positioned `absolute -bottom-12 -left-12`. Background tonal strip on right side.
- **Built:** 2026-04-05 from Stitch screen "Home (Centered Unique Section)"

### ImageGallery
- **Status:** BUILT
- **Schema type:** `imageGallery`
- **File:** `src/components/sections/ImageGallery/`
- **Fields:** images[] (imageWithAlt)
- **Used by:** `homePage`
- **Layout:** `grid-cols-1 sm:grid-cols-2`, each image `aspect-[4/5] rounded-xl object-cover`. `bg-surface-container-low` section.
- **Built:** 2026-04-05 from Stitch screen "Home (Centered Unique Section)"

### EditorialBlock
- **Status:** BUILT
- **Schema type:** `editorialBlock`
- **File:** `src/components/sections/EditorialBlock/`
- **Fields:** heading (req), body (req), highlightText, pullQuote, image (imageWithAlt)
- **Used by:** `homePage`
- **Layout:** Without image — centered `max-w-3xl` with `border-t border-outline-variant/20` separator. With image — `lg:grid-cols-3`, 2/3 text + 1/3 image.
- **Built:** 2026-04-05 from Stitch screen "Home (Centered Unique Section)"

### FeatureGrid
- **Status:** BUILT
- **Schema type:** `featureGrid`
- **File:** `src/components/sections/FeatureGrid/`
- **Fields:** overline, heading (req), features[] (icon, title, description, linkLabel, linkUrl)
- **Used by:** `homePage`
- **Layout:** `grid-cols-1 md:grid-cols-3`. Cards `bg-surface-container-lowest p-10 rounded-xl`. Material icon + serif heading + body + animated link with `arrow_forward`. `bg-surface-container-low` section.
- **Built:** 2026-04-05 from Stitch screen "Home (Centered Unique Section)"

### TestimonialQuote
- **Status:** BUILT
- **Schema type:** `testimonialQuote`
- **File:** `src/components/sections/TestimonialQuote/`
- **Fields:** quote (req), attribution, image (imageWithAlt)
- **Used by:** `homePage`
- **Layout:** Centered `max-w-3xl`, `py-32`. Decorative `format_quote` icon at top. Italic serif quote. `text-outline tracking-widest uppercase` attribution.
- **Built:** 2026-04-05 from Stitch screen "Home (Centered Unique Section)"

### HeroAbout
- **Status:** BUILT
- **Schema type:** `heroAbout`
- **File:** `src/components/sections/HeroAbout/`
- **Fields:** overline, headline (req), headlineEmphasis, body, image (imageWithAlt)
- **Used by:** `aboutPage`
- **Layout:** `md:grid-cols-12` — 7/12 text left, 5/12 portrait right. Single image `aspect-[4/5] rounded-xl shadow-2xl`. Decorative `absolute -bottom-8 -left-8 w-48 h-48 bg-tertiary-container/30 rounded-full blur-3xl` below image. No background strip, no CTAs.
- **Built:** 2026-04-06 from Stitch screen "About Me (Updated CTA)"

### Philosophy
- **Status:** BUILT
- **Schema type:** `philosophy`
- **File:** `src/components/sections/Philosophy/`
- **Fields:** heading (req), body (req, multiline — paragraphs split by blank line), pullQuote
- **Used by:** `aboutPage`
- **Layout:** `bg-surface-container-low py-24`, `max-w-4xl` centered, left-aligned. Body split into `<p>` tags. Pull quote with `border-l-2 border-primary-container pl-8 italic font-heading text-2xl`.
- **Built:** 2026-04-06 from Stitch screen "About Me (Updated CTA)"

### Certifications
- **Status:** BUILT
- **Schema type:** `certifications`
- **File:** `src/components/sections/Certifications/`
- **Fields:** heading (req), subheading, items[] (icon, title, description, certUrl)
- **Used by:** `aboutPage`
- **Layout:** `bg-surface py-24`, heading + subheading above, then horizontal scrolling row of `w-[300px] snap-center bg-surface-container-lowest p-8 rounded-xl` cards. Each card: Material icon + serif title + body + optional "View Certificate" link.
- **Built:** 2026-04-06 from Stitch screen "About Me (Updated CTA)"

### TestimonialQuote (updated)
- **Status:** BUILT
- **Schema type:** `testimonialQuote`
- **File:** `src/components/sections/TestimonialQuote/`
- **Fields:** quote (req), attribution, image (imageWithAlt), hasPillBackground (boolean)
- **Used by:** `homePage`, `aboutPage`
- **Layout:** Default — centered `max-w-3xl py-32`, `format_quote` icon, italic serif quote, uppercase attribution. Pill variant (`hasPillBackground: true`) — `max-w-5xl`, `bg-primary-container/10 rounded-full p-12 md:p-20` with dot texture, filled quote icon, `text-on-primary-container` quote, `text-primary` attribution.
- **Updated:** 2026-04-06 to add pill background variant for About Me screen

### CtaBanner
- **Status:** BUILT
- **Schema type:** `ctaBanner`
- **File:** `src/components/sections/CtaBanner/`
- **Fields:** image (imageWithAlt), heading (req), headlineEmphasis, body, primaryCta (cta), secondaryCta (cta)
- **Used by:** `aboutPage`
- **Layout:** `max-w-7xl mx-auto px-8 mb-32`. Flex row: 1/3 `aspect-square rounded-xl` image + 2/3 `p-12` text. Heading supports italic emphasis in `text-primary`. Two CTA buttons: primary solid + secondary ghost border.
- **Built:** 2026-04-06 from Stitch screen "About Me (Updated CTA)"

### Hero (updated)
- **Status:** BUILT
- **Schema type:** `hero`
- **File:** `src/components/sections/Hero/`
- **Fields:** overline, headline (req), headlineEmphasis, body, image (imageWithAlt), accentImage (imageWithAlt), primaryCta (cta), secondaryCta (cta), hasGradientBg (boolean), **compact (boolean)**
- **Used by:** `homePage`, `servicesPage`
- **Layout:** Full-height asymmetric grid by default. When `compact: true` — simple centered `<header>` block with no min-height, no background strip. Used for interior page headers.
- **Updated:** 2026-04-06 to add compact variant for Services screen

### ServiceCards
- **Status:** BUILT
- **Schema type:** `serviceCards`
- **File:** `src/components/sections/ServiceCards/`
- **Fields:** services[] (icon, title, body, features[], pullQuote, pricingLabel, pricing, ctaLabel, ctaUrl, image (imageWithAlt), sessions[] (duration, label))
- **Used by:** `servicesPage`
- **Layout:** `md:grid-cols-12` bento grid. Index-based card rendering: [0] 8-col featured with image + feature checklist; [1] 4-col compact with pullquote; [2] 5-col inverted primary-bg with bullet features; [3] 7-col media with sessions grid + image.
- **Built:** 2026-04-06 from Stitch screen "Services (Updated Header & Section)"

### Faq
- **Status:** BUILT
- **Schema type:** `faq`
- **File:** `src/components/sections/Faq/`
- **Fields:** heading, faqs[] (question, answer)
- **Used by:** `servicesPage`
- **Layout:** `max-w-4xl mx-auto`, centered heading, `space-y-4` accordion list. Click-to-toggle with `+` icon rotation. Open answer shown in `bg-surface-container-low` panel. `'use client'` component.
- **Built:** 2026-04-06 from Stitch screen "Services (Updated Header & Section)"

### ClassList
- **Status:** BUILT
- **Schema type:** `classList`
- **File:** `src/components/sections/ClassList/`
- **Fields:** classes[] (title (req), date, time, location, description, price, ctaLabel, ctaUrl)
- **Used by:** `classesPage`
- **Layout:** `max-w-7xl mx-auto px-8`. `divide-y divide-outline-variant/30` list. Each row is `md:grid-cols-12`: 3-col schedule (date with calendar icon + time + location with pin icon), 6-col title + description, 3-col price + CTA button right-aligned.
- **Built:** 2026-04-06 from Stitch screen "Classes & Workshops (No Testimonials)"

### NewsletterSignup
- **Status:** BUILT
- **Schema type:** `newsletterSignup`
- **File:** `src/components/sections/NewsletterSignup/`
- **Fields:** heading (req), body, buttonLabel
- **Used by:** `classesPage`
- **Layout:** `mt-32 bg-surface-container-low py-24`. `max-w-3xl mx-auto text-center`. Inline form: email input + submit button. Client component with submitted state.
- **Built:** 2026-04-06 from Stitch screen "Classes & Workshops (No Testimonials)"

### TestimonialGrid
- **Status:** BUILT
- **Schema type:** `testimonialGrid`
- **File:** `src/components/sections/TestimonialGrid/`
- **Fields:** testimonials[] (overline, rating, quote (req), body, attribution, attributionDetail, images[] (imageWithAlt))
- **Used by:** `testimonialsPage`
- **Layout:** `space-y-40 px-8 max-w-screen-2xl mx-auto`. Three index-based layouts: [0] `lg:grid-cols-12` 5/12 text + 7/12 stacked 2-col image grid; [1] centered editorial card `bg-surface-container-low rounded-card` with avatar + format_quote watermark; [2] `lg:grid-cols-2` left 12-col image grid (7+5) + right text with divider attribution.
- **Built:** 2026-04-08 from Stitch screen "Testimonials (Long-form)"

### TestimonialsCtaBanner
- **Status:** BUILT
- **Schema type:** `testimonialsCtaBanner`
- **File:** `src/components/sections/TestimonialsCtaBanner/`
- **Fields:** heading (req), body, primaryCta (cta), secondaryCta (cta)
- **Used by:** `testimonialsPage`
- **Layout:** `mt-48 max-w-screen-xl mx-auto px-8`. Inner `bg-primary-container/20 rounded-section py-24 px-12 text-center border border-primary/10`. Heading in `text-primary`, body in `text-on-primary-container`. Two CTA buttons centered.
- **Built:** 2026-04-08 from Stitch screen "Testimonials (Long-form)"

### ContactDetail
- **Status:** BUILT
- **Schema type:** `contactDetail`
- **File:** `src/components/sections/ContactDetail/`
- **Fields:** overline, headline (req), headlineEmphasis, body, contactMethods[] (icon, label, value, url), image (imageWithAlt), pullQuote
- **Used by:** `contactPage`
- **Layout:** `max-w-7xl mx-auto px-8 mb-20`. Flex row: left 5/12 (overline, large h1 with optional italic emphasis, body, contact methods list with Material icons), right 7/12 (aspect-[4/5] image with `absolute -bottom-8 -left-8` bg-primary pull quote card).
- **Built:** 2026-04-08 from Stitch screen "Contact"

### ContactForm
- **Status:** BUILT
- **Schema type:** `contactForm`
- **File:** `src/components/sections/ContactForm/`
- **Fields:** heading (req), buttonLabel, subjectOptions[] (label, value)
- **Used by:** `contactPage`
- **Layout:** `bg-surface-container-low py-24`. `max-w-4xl mx-auto px-8`. Centered heading + divider. `md:grid-cols-2 gap-x-12 gap-y-10` form: name, email, subject select (from CMS), message textarea, submit. Soft underline inputs. Success state with favorite icon. Uses `submitContactForm` server action. `'use client'` component.
- **Built:** 2026-04-08 from Stitch screen "Contact"

---

## Layout Components

### Navbar
- **Status:** BUILT
- **Schema type:** `navbar` (singleton)
- **File:** `src/components/layout/Navbar/`
- **Fields:** logo (image), links[] (label, url), cta (cta)
- **Layout:** Fixed, glassmorphism (`bg-surface/80 backdrop-blur-md`). Brand name italic serif. `max-w-7xl px-8 py-6`.

### Footer
- **Status:** BUILT (template default)
- **Schema type:** `footer` (singleton)
- **File:** `src/components/layout/Footer/`
- **Fields:** links[] (label, url), copyright (string)
