import { test, expect } from '@playwright/test'

async function waitForImages(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => [...document.images].filter(img => img.currentSrc).every(img => img.complete),
    { timeout: 10_000 }
  ).catch(() => {})
}

test.describe('Classes page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/classes')
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

  test('class list section', async ({ page }) => {
    const section = page.locator('[data-testid="class-list-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('class-list.png')
  })

  test('newsletter signup section', async ({ page }) => {
    const section = page.locator('[data-testid="newsletter-signup-section"]')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toHaveScreenshot('newsletter-signup.png')
  })
})
