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
  imageGallery{
    images[]${imageProjection}
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
    items[]{ icon, title, description, certUrl }
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
    services[]{
      _key,
      icon,
      title,
      body,
      features[],
      pullQuote,
      pricingLabel,
      pricing,
      ctaLabel,
      ctaUrl,
      image ${imageProjection},
      sessions[]{ _key, duration, label }
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
    classes[]{ _key, title, date, time, location, description, price, ctaLabel, ctaUrl }
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
  logo,
  links[]{ label, url },
  cta{ label, url, style, newTab }
}`

export const footerQuery = `*[_type == "footer"][0]{
  links[]{ label, url },
  copyright
}`

// ── Blog ───────────────────────────────────────────────────────────────────
export const allPostSlugsQuery = `*[_type == "post"].slug.current`

export const allPostsQuery = `*[_type == "post"] | order(publishedAt desc){
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  author->{ name }
}`

export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0]{
  title,
  slug,
  excerpt,
  coverImage,
  author->{ name, image },
  publishedAt,
  categories,
  body,
  seo
}`

// ── Site settings ──────────────────────────────────────────────────────────
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteName,
  siteDescription,
  ogImage,
  socials,
  analyticsId
}`
