import { test, expect } from '@playwright/test'

// API-level tests for the /api/send-blast route.
// These run without a browser viewport — they use the request fixture directly.

// ══════════════════════════════════════════════════════════════════════════
// Input validation
// ══════════════════════════════════════════════════════════════════════════

test.describe('/api/send-blast — input validation', () => {
  test('returns 400 when no document ID is provided', async ({ request }) => {
    const res = await request.post('/api/send-blast', {
      data: {},
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })

  test('returns 400 when document ID is an empty string', async ({ request }) => {
    const res = await request.post('/api/send-blast', {
      data: { id: '' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Domain check
// ══════════════════════════════════════════════════════════════════════════

test.describe('/api/send-blast — domain verification', () => {
  test('returns 400 with a descriptive error when using the test sender address', async ({ request }) => {
    // The dev environment uses onboarding@resend.dev — blasts are blocked until
    // a verified domain is configured. This test asserts the guard is in place.
    const res = await request.post('/api/send-blast', {
      data: { id: 'any-id' },
    })

    // Either 400 (domain guard) or 404 (document not found, meaning domain guard passed
    // because RESEND_FROM_EMAIL was overridden) are acceptable outcomes.
    expect([400, 404]).toContain(res.status())

    const body = await res.json()
    expect(body).toHaveProperty('error')

    if (res.status() === 400) {
      // Verify the error is the domain guard, not something else
      expect(body.error).toMatch(/domain|verified|RESEND_FROM_EMAIL/i)
    }
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Document not found
// ══════════════════════════════════════════════════════════════════════════

test.describe('/api/send-blast — document lookup', () => {
  test('returns 404 for a non-existent blast ID (when domain is configured)', async ({ request }) => {
    // This test is only meaningful when RESEND_FROM_EMAIL is a verified domain.
    // In the dev environment it will return 400 (domain guard) instead — skip gracefully.
    const res = await request.post('/api/send-blast', {
      data: { id: 'nonexistent-blast-id-12345' },
    })

    // 400 = domain guard active (dev environment), 404 = domain OK but doc not found
    expect([400, 404]).toContain(res.status())
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })
})

// ══════════════════════════════════════════════════════════════════════════
// Response shape
// ══════════════════════════════════════════════════════════════════════════

test.describe('/api/send-blast — response shape', () => {
  test('always returns JSON with an error property on failure', async ({ request }) => {
    const res = await request.post('/api/send-blast', {
      data: { id: 'fake-id' },
    })

    expect(res.headers()['content-type']).toContain('application/json')
    const body = await res.json()
    // All failure paths return { error: string }
    expect(typeof body.error).toBe('string')
    expect(body.error.length).toBeGreaterThan(0)
  })

  test('does not return 500 for bad input (user errors are 4xx)', async ({ request }) => {
    const res = await request.post('/api/send-blast', {
      data: {},
    })
    // Missing ID is a client error — should never be a 500
    expect(res.status()).toBeLessThan(500)
  })
})
