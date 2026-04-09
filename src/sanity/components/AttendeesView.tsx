import { useEffect, useState, useCallback } from 'react'
import { useClient } from 'sanity'

type Registration = {
  _id: string
  classKey: string
  name: string
  email: string
  status: 'active' | 'cancelled'
  createdAt: string
}

type ClassInfo = {
  _key: string
  title?: string
  date?: string
  attendeeLimit?: number
}

type ViewProps = {
  document: {
    displayed: {
      classList?: {
        classes?: ClassInfo[]
      }
    }
  }
}

const REGISTRATION_QUERY = `*[_type == "classRegistration"] | order(createdAt desc) {
  _id, classKey, name, email, status, createdAt
}`

export function AttendeesView({ document: { displayed } }: ViewProps) {
  const client = useClient({ apiVersion: '2025-01-01' })
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  const classes: ClassInfo[] = displayed?.classList?.classes ?? []

  const fetchRegistrations = useCallback(async () => {
    const result = await client.fetch<Registration[]>(REGISTRATION_QUERY)
    setRegistrations(result)
    setLoading(false)
  }, [client])

  useEffect(() => {
    fetchRegistrations()

    // Subscribe to live mutations on classRegistration documents
    const subscription = client
      .listen('*[_type == "classRegistration"]')
      .subscribe(() => fetchRegistrations())

    return () => subscription.unsubscribe()
  }, [client, fetchRegistrations])

  if (!classes.length) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>No classes defined yet. Add classes in the Editor tab first.</p>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>Attendees</h2>
      {loading ? (
        <p style={styles.loadingText}>Loading…</p>
      ) : (
        <div style={styles.stack}>
          {classes.map((cls) => {
            const classRegs = registrations.filter((r) => r.classKey === cls._key)
            const active = classRegs.filter((r) => r.status === 'active')
            const cancelled = classRegs.filter((r) => r.status === 'cancelled')
            const limit = cls.attendeeLimit ?? null
            const spotsLeft = limit !== null ? limit - active.length : null
            const isFull = spotsLeft !== null && spotsLeft <= 0

            return (
              <div key={cls._key} style={styles.card}>
                {/* Class header */}
                <div style={styles.cardHeader}>
                  <div>
                    <h3 style={styles.className}>{cls.title ?? 'Untitled Class'}</h3>
                    {cls.date && <p style={styles.classDate}>{cls.date}</p>}
                  </div>
                  <div style={styles.badgeGroup}>
                    <span style={{ ...styles.badge, ...(isFull ? styles.badgeFull : styles.badgeOpen) }}>
                      {isFull ? 'Full' : 'Open'}
                    </span>
                    <span style={styles.countBadge}>
                      {limit !== null
                        ? `${active.length} / ${limit} registered`
                        : `${active.length} registered`}
                    </span>
                  </div>
                </div>

                {/* Active registrations */}
                {active.length > 0 ? (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={{ ...styles.th, ...styles.thRight }}>Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.map((reg) => (
                        <tr key={reg._id} style={styles.tr}>
                          <td style={styles.td}>{reg.name}</td>
                          <td style={{ ...styles.td, ...styles.tdMuted }}>
                            <a href={`mailto:${reg.email}`} style={styles.emailLink}>
                              {reg.email}
                            </a>
                          </td>
                          <td style={{ ...styles.td, ...styles.tdMuted, ...styles.tdRight }}>
                            {formatDate(reg.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={styles.emptyClassText}>No active registrations yet.</p>
                )}

                {/* Cancelled registrations — collapsed by default */}
                {cancelled.length > 0 && (
                  <details style={styles.cancelled}>
                    <summary style={styles.cancelledSummary}>
                      {cancelled.length} cancelled registration{cancelled.length !== 1 ? 's' : ''}
                    </summary>
                    <table style={{ ...styles.table, marginTop: 8 }}>
                      <tbody>
                        {cancelled.map((reg) => (
                          <tr key={reg._id} style={styles.tr}>
                            <td style={{ ...styles.td, ...styles.tdStrike }}>{reg.name}</td>
                            <td style={{ ...styles.td, ...styles.tdMuted, ...styles.tdStrike }}>
                              {reg.email}
                            </td>
                            <td style={{ ...styles.td, ...styles.tdMuted, ...styles.tdRight }}>
                              {formatDate(reg.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </details>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
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

// Inline styles — no Tailwind in Studio components
const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '32px',
    maxWidth: '800px',
    fontFamily: 'system-ui, sans-serif',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#101112',
    marginBottom: '24px',
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    border: '1px solid #e6e8eb',
    borderRadius: '8px',
    overflow: 'hidden',
    background: '#fff',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #e6e8eb',
    background: '#f8f9fa',
    gap: '12px',
  },
  className: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#101112',
    margin: 0,
  },
  classDate: {
    fontSize: '13px',
    color: '#6e7781',
    margin: '2px 0 0',
  },
  badgeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  badge: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '99px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  badgeOpen: {
    background: '#d1fae5',
    color: '#065f46',
  },
  badgeFull: {
    background: '#fee2e2',
    color: '#991b1b',
  },
  countBadge: {
    fontSize: '13px',
    color: '#6e7781',
    whiteSpace: 'nowrap',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '10px 20px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#6e7781',
    textAlign: 'left',
    borderBottom: '1px solid #e6e8eb',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  thRight: {
    textAlign: 'right',
  },
  tr: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '12px 20px',
    fontSize: '14px',
    color: '#101112',
    verticalAlign: 'middle',
  },
  tdMuted: {
    color: '#6e7781',
  },
  tdRight: {
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
  tdStrike: {
    textDecoration: 'line-through',
    opacity: 0.6,
  },
  emailLink: {
    color: '#6e7781',
    textDecoration: 'none',
  },
  cancelled: {
    padding: '8px 20px 16px',
    borderTop: '1px solid #f3f4f6',
  },
  cancelledSummary: {
    fontSize: '13px',
    color: '#6e7781',
    cursor: 'pointer',
    padding: '8px 0',
  },
  emptyClassText: {
    padding: '20px',
    fontSize: '14px',
    color: '#6e7781',
    margin: 0,
  },
  empty: {
    padding: '40px 32px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#6e7781',
  },
  loadingText: {
    fontSize: '14px',
    color: '#6e7781',
  },
}
