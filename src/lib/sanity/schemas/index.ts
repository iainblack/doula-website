// Object types
import { cta } from './objects/cta'
import { seo } from './objects/seo'
import { imageWithAlt } from './objects/imageWithAlt'
import { portableTextBlock } from './objects/portableTextBlock'

// Page documents — one per screen
import { homePage } from './documents/homePage'
import { aboutPage } from './documents/aboutPage'
import { servicesPage } from './documents/servicesPage'
import { classesPage } from './documents/classesPage'
import { testimonialsPage } from './documents/testimonialsPage'
import { contactPage } from './documents/contactPage'

// Other content documents
import { post } from './documents/post'
import { author } from './documents/author'
import { classRegistration } from './documents/classRegistration'

// Singletons — co-located with their layout components
import { navbar } from '../../../components/layout/Navbar/schema'
import { footer } from '../../../components/layout/Footer/schema'
import { siteSettings } from './singletons/siteSettings'

// Section object schemas — embedded in page documents
import { hero } from '../../../components/sections/Hero/schema'
import { imageGallery } from '../../../components/sections/ImageGallery/schema'
import { editorialBlock } from '../../../components/sections/EditorialBlock/schema'
import { featureGrid } from '../../../components/sections/FeatureGrid/schema'
import { testimonialQuote } from '../../../components/sections/TestimonialQuote/schema'
import { heroAbout } from '../../../components/sections/HeroAbout/schema'
import { philosophy } from '../../../components/sections/Philosophy/schema'
import { certifications } from '../../../components/sections/Certifications/schema'
import { ctaBanner } from '../../../components/sections/CtaBanner/schema'
import { serviceCards } from '../../../components/sections/ServiceCards/schema'
import { faq } from '../../../components/sections/Faq/schema'
import { classList } from '../../../components/sections/ClassList/schema'
import { newsletterSignup } from '../../../components/sections/NewsletterSignup/schema'
import { testimonialGrid } from '../../../components/sections/TestimonialGrid/schema'
import { testimonialsCtaBanner } from '../../../components/sections/TestimonialsCtaBanner/schema'
import { contactDetail } from '../../../components/sections/ContactDetail/schema'
import { contactForm } from '../../../components/sections/ContactForm/schema'

export const schemaTypes = [
  // Objects (must be listed before types that reference them)
  cta,
  seo,
  imageWithAlt,
  portableTextBlock,
  // Section objects
  hero,
  imageGallery,
  editorialBlock,
  featureGrid,
  testimonialQuote,
  heroAbout,
  philosophy,
  certifications,
  ctaBanner,
  serviceCards,
  faq,
  classList,
  newsletterSignup,
  testimonialGrid,
  testimonialsCtaBanner,
  contactDetail,
  contactForm,
  // Page documents
  homePage,
  aboutPage,
  servicesPage,
  classesPage,
  testimonialsPage,
  contactPage,
  // Other content
  post,
  author,
  classRegistration,
  // Singletons
  navbar,
  footer,
  siteSettings,
]
