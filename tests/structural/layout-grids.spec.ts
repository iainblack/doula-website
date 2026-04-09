import { test, expect } from '@playwright/test'

// Structural tests run only at desktop viewport — they assert class presence
// for the most layout-critical responsive grids.
// These guard against accidental class removal, not visual regressions.

test.use({ viewport: { width: 1280, height: 800 } })

test('CSS layout tokens are applied on :root', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const sectionY = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--spacing-section-y').trim()
  )
  expect(sectionY).toBe('6rem')

  const maxWidth = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--max-width-content').trim()
  )
  expect(maxWidth).toBe('1280px')

  const sectionX = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--spacing-section-x').trim()
  )
  expect(sectionX).toBe('2rem')
})

test('Hero renders 12-col grid with 6/6 split at desktop', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const hero = page.locator('[data-testid="hero-section"]')
  await expect(hero).toBeVisible()
  await expect(hero.locator('[class*="lg:grid-cols-12"]')).toBeVisible()
  await expect(hero.locator('[class*="lg:col-span-6"]').first()).toBeVisible()
})

test('ServiceCards renders 4 cards in a 12-col grid', async ({ page }) => {
  await page.goto('/services')
  await page.waitForLoadState('networkidle')

  const section = page.locator('[data-testid="service-cards-section"]')
  await expect(section).toBeVisible()

  // All 4 card divs present (each has md:col-span-*)
  const cards = section.locator('[class*="md:col-span-"]')
  await expect(cards).toHaveCount(4)

  // FeaturedCard: col-span-8
  await expect(section.locator('[class*="md:col-span-8"]')).toBeVisible()
  // CompactCard: col-span-4
  await expect(section.locator('[class*="md:col-span-4"]')).toBeVisible()
  // HighlightedCard: col-span-5
  await expect(section.locator('[class*="md:col-span-5"]')).toBeVisible()
  // MediaCard: col-span-7
  await expect(section.locator('[class*="md:col-span-7"]')).toBeVisible()
})

test('ClassList renders 12-col 3-zone grid rows', async ({ page }) => {
  await page.goto('/classes')
  await page.waitForLoadState('networkidle')

  const section = page.locator('[data-testid="class-list-section"]')
  await expect(section).toBeVisible()

  // Schedule zone (col-span-3), title zone (col-span-6), cta zone (col-span-3)
  await expect(section.locator('[class*="md:col-span-3"]').first()).toBeVisible()
  await expect(section.locator('[class*="md:col-span-6"]').first()).toBeVisible()
})

test('TestimonialGrid renders all 3 layout variants', async ({ page }) => {
  await page.goto('/testimonials')
  await page.waitForLoadState('networkidle')

  const section = page.locator('[data-testid="testimonial-grid-section"]')
  await expect(section).toBeVisible()

  // AsymmetricLayout: lg:grid-cols-12
  await expect(section.locator('[class*="lg:grid-cols-12"]').first()).toBeVisible()
  // EditorialCardLayout: rounded-card
  await expect(section.locator('[class*="rounded-card"]').first()).toBeVisible()
  // GalleryGridLayout: lg:grid-cols-2
  await expect(section.locator('[class*="lg:grid-cols-2"]').first()).toBeVisible()
})

test('HeroAbout renders 12-col 7/5 split at desktop', async ({ page }) => {
  await page.goto('/about')
  await page.waitForLoadState('networkidle')

  const section = page.locator('[data-testid="hero-about-section"]')
  await expect(section).toBeVisible()
  await expect(section.locator('[class*="md:grid-cols-12"]')).toBeVisible()
  await expect(section.locator('[class*="md:col-span-7"]')).toBeVisible()
  await expect(section.locator('[class*="md:col-span-5"]')).toBeVisible()
})
