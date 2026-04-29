import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 800 } })

test.describe('Cancel registration page', () => {
  test('shows an error when no token is provided', async ({ page }) => {
    await page.goto('/cancel-registration')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Something went wrong')).toBeVisible()
    await expect(page.getByText('This cancellation link is invalid or has expired.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Classes' })).toBeVisible()
  })

  test('shows an error for an unrecognised token', async ({ page }) => {
    await page.goto('/api/cancel-registration?token=not-a-real-token')
    await page.waitForLoadState('networkidle')

    await expect(page.getByText('Something went wrong')).toBeVisible()
    await expect(page.getByText('Cancellation link not found.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'View Classes' })).toBeVisible()
  })

  test('"View Classes" link returns to the classes page', async ({ page }) => {
    await page.goto('/cancel-registration')
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: 'View Classes' }).click()
    await expect(page).toHaveURL('/classes')
  })
})
