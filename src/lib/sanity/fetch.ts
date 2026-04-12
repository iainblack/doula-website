import { draftMode } from 'next/headers'
import { client, draftClient } from './client'

export async function sanityFetch<T = any>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const { isEnabled } = await draftMode()
  const activeClient = isEnabled ? draftClient : client
  return activeClient.fetch<T>(query, params ?? {})
}
