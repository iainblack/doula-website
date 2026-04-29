import { useEffect, useState, useCallback } from 'react'
import { useClient } from 'sanity'
import {
  Box,
  Card,
  Stack,
  Flex,
  Text,
  Heading,
  Badge,
  Spinner,
} from '@sanity/ui'
import { ChevronDownIcon } from '@sanity/icons'

type Registration = {
  _id: string
  classKey: string
  name: string
  email: string
  status: 'active' | 'cancelled'
  createdAt: string
}

type ClassEntry = {
  _id: string
  title?: string
  date?: string
  attendeeLimit?: number
}

const REGISTRATION_QUERY = `*[_type == "classRegistration"] | order(createdAt desc) {
  _id, classKey, name, email, status, createdAt
}`

const CLASSES_QUERY = `*[_type == "class"] | order(date asc) {
  _id, title, date, attendeeLimit
}`

export function AttendeesView() {
  const client = useClient({ apiVersion: '2025-01-01' })
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [workshops, setWorkshops] = useState<ClassEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    const [regs, classes] = await Promise.all([
      client.fetch<Registration[]>(REGISTRATION_QUERY),
      client.fetch<ClassEntry[]>(CLASSES_QUERY),
    ])
    setRegistrations(regs)
    setWorkshops(classes)
    setLoading(false)
  }, [client])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()

    const subscription = client
      .listen('*[_type == "classRegistration"]')
      .subscribe(() => fetchData())

    return () => subscription.unsubscribe()
  }, [client, fetchData])

  if (!loading && !workshops.length) {
    return (
      <Box padding={5}>
        <Text muted size={1}>
          No classes defined yet. Add Classes &amp; Workshops in the Content section first.
        </Text>
      </Box>
    )
  }

  return (
    <Box padding={5} style={{ maxWidth: 800 }}>
      <Stack space={5}>
        <Heading size={2}>Attendees</Heading>

        {loading ? (
          <Flex align="center" gap={2}>
            <Spinner muted />
            <Text muted size={1}>Loading…</Text>
          </Flex>
        ) : (
          <Stack space={4}>
            {workshops.map((cls) => {
              const classRegs = registrations.filter((r) => r.classKey === cls._id)
              const active = classRegs.filter((r) => r.status === 'active')
              const cancelled = classRegs.filter((r) => r.status === 'cancelled')
              const limit = cls.attendeeLimit ?? null
              const spotsLeft = limit !== null ? limit - active.length : null
              const isFull = spotsLeft !== null && spotsLeft <= 0

              return (
                <Card key={cls._id} border radius={2} overflow="hidden">
                  {/* Class header */}
                  <Card tone="transparent" padding={4} borderBottom>
                    <Flex align="flex-start" justify="space-between" gap={4}>
                      <Stack space={2}>
                        <Text size={2} weight="semibold">
                          {cls.title ?? 'Untitled Class'}
                        </Text>
                        {cls.date && (
                          <Text size={1} muted>
                            {cls.date}
                          </Text>
                        )}
                      </Stack>
                      <Flex align="center" gap={3} style={{ flexShrink: 0 }}>
                        {limit !== null && (
                          <Badge
                            tone={isFull ? 'critical' : 'positive'}
                            radius={6}
                            fontSize={0}
                          >
                            {isFull ? 'Full' : 'Open'}
                          </Badge>
                        )}
                        <Text size={1} muted style={{ whiteSpace: 'nowrap' }}>
                          {limit !== null
                            ? `${active.length} / ${limit} registered`
                            : `${active.length} registered`}
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>

                  {/* Active registrations */}
                  {active.length > 0 ? (
                    <Box>
                      {/* Table header */}
                      <Box
                        paddingX={4}
                        paddingY={3}
                        style={{ borderBottom: '1px solid var(--card-border-color)' }}
                      >
                        <Flex gap={4}>
                          <Box style={{ flex: '1 1 180px' }}>
                            <Text size={0} weight="semibold" muted style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Name
                            </Text>
                          </Box>
                          <Box style={{ flex: '1 1 220px' }}>
                            <Text size={0} weight="semibold" muted style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Email
                            </Text>
                          </Box>
                          <Box style={{ flex: '0 0 120px', textAlign: 'right' }}>
                            <Text size={0} weight="semibold" muted style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              Registered
                            </Text>
                          </Box>
                        </Flex>
                      </Box>

                      {/* Rows */}
                      {active.map((reg) => (
                        <Box
                          key={reg._id}
                          paddingX={4}
                          paddingY={3}
                          style={{ borderBottom: '1px solid var(--card-border-color)' }}
                        >
                          <Flex gap={4} align="center">
                            <Box style={{ flex: '1 1 180px' }}>
                              <Text size={1}>{reg.name}</Text>
                            </Box>
                            <Box style={{ flex: '1 1 220px' }}>
                              <Text size={1} muted>
                                <a
                                  href={`mailto:${reg.email}`}
                                  style={{ color: 'inherit', textDecoration: 'none' }}
                                >
                                  {reg.email}
                                </a>
                              </Text>
                            </Box>
                            <Box style={{ flex: '0 0 120px', textAlign: 'right' }}>
                              <Text size={1} muted style={{ whiteSpace: 'nowrap' }}>
                                {formatDate(reg.createdAt)}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Box padding={4}>
                      <Text size={1} muted>
                        No active registrations yet.
                      </Text>
                    </Box>
                  )}

                  {/* Cancelled registrations */}
                  {cancelled.length > 0 && (
                    <Box padding={4} style={{ borderTop: '1px solid var(--card-border-color)' }}>
                      <details>
                        <summary style={{ cursor: 'pointer', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ChevronDownIcon style={{ color: 'var(--card-muted-fg-color)', fontSize: 16, flexShrink: 0 }} />
                          <Text size={1} muted>
                            {cancelled.length} cancelled registration{cancelled.length !== 1 ? 's' : ''}
                          </Text>
                        </summary>
                        <Stack space={2} marginTop={3}>
                          {cancelled.map((reg) => (
                            <Flex key={reg._id} gap={4} align="center">
                              <Box style={{ flex: '1 1 180px' }}>
                                <Text size={1} muted style={{ textDecoration: 'line-through' }}>
                                  {reg.name}
                                </Text>
                              </Box>
                              <Box style={{ flex: '1 1 220px' }}>
                                <Text size={1} muted style={{ textDecoration: 'line-through' }}>
                                  {reg.email}
                                </Text>
                              </Box>
                              <Box style={{ flex: '0 0 120px', textAlign: 'right' }}>
                                <Text size={1} muted style={{ whiteSpace: 'nowrap' }}>
                                  {formatDate(reg.createdAt)}
                                </Text>
                              </Box>
                            </Flex>
                          ))}
                        </Stack>
                      </details>
                    </Box>
                  )}
                </Card>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
