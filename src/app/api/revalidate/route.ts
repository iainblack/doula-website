import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: { current: string }
    }>(req, process.env.SANITY_WEBHOOK_SECRET)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 })
    }

    if (body._type === 'page') {
      const slug = body.slug?.current
      if (slug === 'home') {
        revalidatePath('/')
      } else if (slug) {
        revalidatePath(`/${slug}`)
      }
    } else if (body._type === 'post') {
      revalidatePath(`/blog/${body.slug?.current}`)
      revalidatePath('/blog')
    } else if (['navbar', 'footer', 'siteSettings'].includes(body._type)) {
      revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, type: body._type })
  } catch (err) {
    console.error('Revalidation error:', err)
    return new NextResponse('Revalidation error', { status: 500 })
  }
}
