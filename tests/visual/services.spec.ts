import { test, expect } from '@playwright/test'

async function waitForImages(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => [...document.images].filter(img => img.currentSrc).every(img => img.complete),
    { timeout: 10_000 }
  ).catch(() => {})
}

test.describe('Services page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/services')
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

  test('service cards section', async ({ page }) => {
    const section = page.locator('[data-testid="service-cards-section"]')
    await section.scrollIntoViewIfNeeded()
    await waitForImages(page)
    await expect(section).toHaveScreenshot('service-cards.png')
  })

  test('faq section', async ({ page }) => {
    const section = page.locator('[data-testid="faq-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('faq.png')
  })
})
