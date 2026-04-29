// ── Shared image projection ────────────────────────────────────────────────
const imageProjection = `{ image{ asset->{ _id, url }, hotspot, crop }, alt }`

// ── Home Page ──────────────────────────────────────────────────────────────
export const homePageQuery = `*[_type == "homePage"][0]{
  _id,
  seo,
  hero{
    overline,
    headline,
    headlineEmphasis,
    body,
    image ${imageProjection},
    accentImage ${imageProjection},
    primaryCta{ label, url, style, newTab },
    secondaryCta{ label, url, style, newTab }
  },
  editorialBlock{
    heading,
    body,
    highlightText,
    pullQuote,
    image ${imageProjection}
  },
  featureGrid{
    overline,
    heading,
    features[]{ icon, title, description, linkLabel, linkUrl }
  },
  testimonialQuote{
    quote,
    attribution,
    image ${imageProjection}
  }
}`

// ── About Page ─────────────────────────────────────────────────────────────
export const aboutPageQuery = `*[_type == "aboutPage"][0]{
  _id,
  seo,
  hero{
    overline,
    headline,
    headlineEmphasis,
    body,
    image ${imageProjection}
  },
  philosophy{
    heading,
    body,
    pullQuote
  },
  certifications{
    heading,
    subheading,
    items[]{ icon, title, description, certFile{ asset->{ _id, url } }, certUrl }
  },
  testimonialQuote{
    quote,
    attribution,
    image ${imageProjection},
    hasPillBackground
  },
  ctaBanner{
    image ${imageProjection},
    heading,
    headlineEmphasis,
    body,
    primaryCta{ label, url, style, newTab },
    secondaryCta{ label, url, style, newTab }
  }
}`

// ── Services Page ──────────────────────────────────────────────────────────
export const servicesPageQuery = `*[_type == "servicesPage"][0]{
  _id,
  seo,
  hero{
    overline,
    headline,
    headlineEmphasis,
    body,
    compact
  },
  serviceCards{
    packages[]{
      _key,
      "package": package->{
        _id,
        title,
        slug,
        icon,
        summary,
        pullQuote,
        features[],
        pricingLabel,
        pricing,
        variant,
        heroImage ${imageProjection},
        sessions[]{ _key, duration, label }
      }
    }
  },
  faq{
    heading,
    faqs[]{ _key, question, answer }
  }
}`

// ── Classes & Workshops Page ───────────────────────────────────────────────
export const classesPageQuery = `*[_type == "classesPage"][0]{
  _id,
  seo,
  hero{
    overline,
    headline,
    headlineEmphasis,
    body,
    image ${imageProjection},
    primaryCta{ label, url, style, newTab },
    secondaryCta{ label, url, style, newTab },
    compact
  },
  classList{
    classes[]{
      _key,
      "class": class->{ _id, title, slug, date, time, location, description, price, ctaLabel, ctaUrl, attendeeLimit }
    }
  },
  newsletterSignup{
    heading,
    body,
    buttonLabel
  }
}`

// ── Testimonials Page ─────────────────────────────────────────────────────
export const testimonialsPageQuery = `*[_type == "testimonialsPage"][0]{
  _id,
  seo,
  hero{
    overline,
    headline,
    headlineEmphasis,
    body,
    compact
  },
  testimonialGrid{
    testimonials[]{
      _key,
      variant,
      overline,
      rating,
      quote,
      body,
      attribution,
      attributionDetail,
      images[]{ image{ asset->{ _id, url }, hotspot, crop }, alt }
    }
  },
  ctaBanner{
    heading,
    body,
    primaryCta{ label, url, style, newTab },
    secondaryCta{ label, url, style, newTab }
  }
}`

// ── Contact Page ──────────────────────────────────────────────────────────
export const contactPageQuery = `*[_type == "contactPage"][0]{
  _id,
  seo,
  contactDetail{
    overline,
    headline,
    headlineEmphasis,
    body,
    contactMethods[]{ _key, icon, label, value, url },
    image{ image{ asset->{ _id, url }, hotspot, crop }, alt },
    pullQuote
  },
  contactForm{
    heading,
    buttonLabel,
    subjectOptions[]{ _key, label, value }
  }
}`

// ── Navbar & Footer (fetched in site layout) ───────────────────────────────
export const navbarQuery = `*[_type == "navbar"][0]{
  logo{ asset->{ _id, url, metadata{ dimensions } }, hotspot, crop },
  links[]{ label, url },
  cta{ label, url, style, newTab }
}`

export const footerQuery = `*[_type == "footer"][0]{
  links[]{ label, url },
  copyright
}`

// ── Class Registrations ────────────────────────────────────────────────────
// Returns all active registrations for the given class keys so the caller
// can group them and build a counts map (classKey → count).
export const activeRegistrationsQuery = `*[_type == "classRegistration" && classKey in $keys && status == "active"]{ classKey }`

// ── Service Packages ──────────────────────────────────────────────────────
export const allServicePackageSlugsQuery = `*[_type == "servicePackage"].slug.current`

export const servicePackageBySlugQuery = `*[_type == "servicePackage" && slug.current == $slug][0]{
  title,
  slug,
  icon,
  tagline,
  heroImage ${imageProjection},
  description,
  features[],
  pricingLabel,
  pricing,
  sessions[]{ _key, duration, label },
  ctaLabel,
  seo
}`

// ── Classes ───────────────────────────────────────────────────────────────
export const allClassesQuery = `*[_type == "class"] | order(date asc){
  _id, title, slug, date, time, location, description, price, ctaLabel, ctaUrl, attendeeLimit
}`

// ── Site settings ──────────────────────────────────────────────────────────
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteName,
  siteDescription,
  ogImage,
  socials,
  contactEmail,
  analyticsId
}`

// ── Site theme ─────────────────────────────────────────────────────────────
export const siteThemeQuery = `*[_type == "siteTheme"][0]{
  "colorPrimary": colorPrimary.hex,
  "colorPrimaryHover": colorPrimaryHover.hex,
  "colorPrimaryForeground": colorPrimaryForeground.hex,
  "colorBackground": colorBackground.hex,
  "colorSurface": colorSurface.hex,
  "colorForeground": colorForeground.hex,
  "colorMuted": colorMuted.hex,
  "colorBorder": colorBorder.hex
}`

export const contactEmailQuery = `*[_type == "siteSettings"][0].contactEmail`
