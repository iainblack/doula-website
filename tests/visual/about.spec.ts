import { test, expect } from '@playwright/test'

async function waitForImages(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => [...document.images].filter(img => img.currentSrc).every(img => img.complete),
    { timeout: 10_000 }
  ).catch(() => {})
}

test.describe('About page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
    await waitForImages(page)
  })

  test('full page', async ({ page }) => {
    await expect(page).toHaveScreenshot('full-page.png', { fullPage: true })
  })

  test('hero about section', async ({ page }) => {
    const section = page.locator('[data-testid="hero-about-section"]')
    await expect(section).toHaveScreenshot('hero-about.png')
  })

  test('philosophy section', async ({ page }) => {
    const section = page.locator('[data-testid="philosophy-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('philosophy.png')
  })

  test('certifications section', async ({ page }) => {
    const section = page.locator('[data-testid="certifications-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('certifications.png')
  })

  test('testimonial quote section', async ({ page }) => {
    const section = page.locator('[data-testid="testimonial-quote-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('testimonial-quote.png')
  })

  test('cta banner section', async ({ page }) => {
    const section = page.locator('[data-testid="cta-banner-section"]')
    await section.scrollIntoViewIfNeeded()
    await waitForImages(page)
    await expect(section).toHaveScreenshot('cta-banner.png')
  })
})
