import { draftMode } from 'next/headers'
import { client, draftClient } from './client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sanityFetch<T = any>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const { isEnabled } = await draftMode()
  const activeClient = isEnabled ? draftClient : client
  return activeClient.fetch<T>(query, params ?? {})
}
