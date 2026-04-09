import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { client } from '@/lib/sanity/client'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    client.withConfig({ token: process.env.SANITY_API_TOKEN }),
    request.url,
  )

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  ;(await draftMode()).enable()
  redirect(redirectTo)
}
