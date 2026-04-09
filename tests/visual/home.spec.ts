import { test, expect } from '@playwright/test'

// Only waits for images that have started loading (currentSrc set = not lazy-pending)
async function waitForImages(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => [...document.images].filter(img => img.currentSrc).every(img => img.complete),
    { timeout: 10_000 }
  ).catch(() => {})
}

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await waitForImages(page)
  })

  test('full page', async ({ page }) => {
    await expect(page).toHaveScreenshot('full-page.png', { fullPage: true })
  })

  test('hero section', async ({ page }) => {
    const section = page.locator('[data-testid="hero-section"]')
    await expect(section).toHaveScreenshot('hero.png')
  })

  test('image gallery section', async ({ page }) => {
    const section = page.locator('[data-testid="image-gallery-section"]')
    // Section only renders when imageGallery data is seeded — skip if absent
    if (await section.count() === 0) test.skip()
    await section.scrollIntoViewIfNeeded()
    await waitForImages(page)
    await expect(section).toHaveScreenshot('image-gallery.png')
  })

  test('editorial block section', async ({ page }) => {
    const section = page.locator('[data-testid="editorial-block-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('editorial-block.png')
  })

  test('feature grid section', async ({ page }) => {
    const section = page.locator('[data-testid="feature-grid-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('feature-grid.png')
  })

  test('testimonial quote section', async ({ page }) => {
    const section = page.locator('[data-testid="testimonial-quote-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('testimonial-quote.png')
  })
})
