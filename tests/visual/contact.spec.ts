import { test, expect } from '@playwright/test'

async function waitForImages(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => [...document.images].filter(img => img.currentSrc).every(img => img.complete),
    { timeout: 10_000 }
  ).catch(() => {})
}

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    await waitForImages(page)
  })

  test('full page', async ({ page }) => {
    await expect(page).toHaveScreenshot('full-page.png', { fullPage: true })
  })

  test('contact detail section', async ({ page }) => {
    const section = page.locator('[data-testid="contact-detail-section"]')
    await waitForImages(page)
    await expect(section).toHaveScreenshot('contact-detail.png')
  })

  test('contact form section', async ({ page }) => {
    const section = page.locator('[data-testid="contact-form-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('contact-form.png')
  })
})
