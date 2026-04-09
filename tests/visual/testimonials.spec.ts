import { test, expect } from '@playwright/test'

async function waitForImages(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => [...document.images].filter(img => img.currentSrc).every(img => img.complete),
    { timeout: 10_000 }
  ).catch(() => {})
}

test.describe('Testimonials page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/testimonials')
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

  test('testimonial grid section', async ({ page }) => {
    const section = page.locator('[data-testid="testimonial-grid-section"]')
    await section.scrollIntoViewIfNeeded()
    await waitForImages(page)
    await expect(section).toHaveScreenshot('testimonial-grid.png')
  })

  test('testimonials cta banner section', async ({ page }) => {
    const section = page.locator('[data-testid="testimonials-cta-banner-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('testimonials-cta-banner.png')
  })
})
