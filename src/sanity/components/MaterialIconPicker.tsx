'use client'

import { useCallback, useState, useEffect } from 'react'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'

const ICONS: { name: string; label: string }[] = [
  // Birth & family
  { name: 'child_care', label: 'Child Care' },
  { name: 'pregnant_woman', label: 'Pregnant Woman' },
  { name: 'family_restroom', label: 'Family' },
  { name: 'crib', label: 'Crib' },
  { name: 'stroller', label: 'Stroller' },
  { name: 'baby_changing_station', label: 'Baby' },
  // Health & wellness
  { name: 'favorite', label: 'Heart' },
  { name: 'healing', label: 'Healing' },
  { name: 'spa', label: 'Spa' },
  { name: 'self_improvement', label: 'Meditation' },
  { name: 'health_and_safety', label: 'Health & Safety' },
  { name: 'monitor_heart', label: 'Heart Monitor' },
  { name: 'home_health', label: 'Home Health' },
  { name: 'psychology', label: 'Mind / Psychology' },
  { name: 'psychology_alt', label: 'Mental Health' },
  { name: 'exercise', label: 'Exercise' },
  { name: 'fitness_center', label: 'Fitness' },
  { name: 'directions_walk', label: 'Walking' },
  // Education & credentials
  { name: 'school', label: 'School' },
  { name: 'menu_book', label: 'Book' },
  { name: 'workspace_premium', label: 'Certificate' },
  { name: 'verified', label: 'Verified' },
  { name: 'verified_user', label: 'Verified User' },
  { name: 'military_tech', label: 'Medal' },
  { name: 'award_star', label: 'Award Star' },
  { name: 'star', label: 'Star' },
  // Nature & calm
  { name: 'eco', label: 'Eco' },
  { name: 'nature', label: 'Nature' },
  { name: 'nest_eco_leaf', label: 'Leaf' },
  { name: 'local_florist', label: 'Flower' },
  { name: 'water_drop', label: 'Water Drop' },
  { name: 'air', label: 'Air / Breath' },
  { name: 'sunny', label: 'Sun' },
  { name: 'forest', label: 'Forest' },
  // Contact & communication
  { name: 'phone', label: 'Phone' },
  { name: 'mail', label: 'Email' },
  { name: 'location_on', label: 'Location' },
  { name: 'map', label: 'Map' },
  { name: 'schedule', label: 'Schedule' },
  { name: 'calendar_today', label: 'Calendar' },
  { name: 'chat', label: 'Chat' },
  { name: 'forum', label: 'Forum' },
  { name: 'support_agent', label: 'Support' },
  // Community & support
  { name: 'handshake', label: 'Handshake' },
  { name: 'people', label: 'People' },
  { name: 'group', label: 'Group' },
  { name: 'volunteer_activism', label: 'Volunteer' },
  { name: 'diversity_3', label: 'Community' },
  { name: 'hub', label: 'Hub' },
  // General
  { name: 'check_circle', label: 'Check Circle' },
  { name: 'info', label: 'Info' },
  { name: 'tips_and_updates', label: 'Tips' },
  { name: 'lightbulb', label: 'Lightbulb' },
  { name: 'emoji_emotions', label: 'Smile' },
]

export function MaterialIconPicker(props: StringInputProps) {
  const { value, onChange } = props
  const [search, setSearch] = useState('')

  // Inject Material Symbols font into the Studio document
  useEffect(() => {
    const id = 'material-symbols-font'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href =
        'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const handleSelect = useCallback(
    (iconName: string) => {
      if (iconName === value) {
        onChange(unset())
      } else {
        onChange(set(iconName))
      }
    },
    [value, onChange],
  )

  const filtered = search.trim()
    ? ICONS.filter(
        (i) =>
          i.label.toLowerCase().includes(search.toLowerCase()) ||
          i.name.toLowerCase().includes(search.toLowerCase()),
      )
    : ICONS

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Current value display */}
      {value && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'var(--card-bg-color, #f5f5f5)',
            borderRadius: '4px',
            fontSize: '13px',
            color: 'var(--card-fg-color, #333)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {value}
          </span>
          <span>
            <strong>{value}</strong>
          </span>
          <button
            onClick={() => onChange(unset())}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              color: 'var(--card-muted-fg-color, #888)',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search icons…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: '8px 10px',
          border: '1px solid var(--card-border-color, #ddd)',
          borderRadius: '4px',
          fontSize: '13px',
          background: 'var(--card-bg-color, #fff)',
          color: 'var(--card-fg-color, #333)',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />

      {/* Icon grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
          gap: '6px',
          maxHeight: '280px',
          overflowY: 'auto',
          padding: '2px',
        }}
      >
        {filtered.map((icon) => {
          const isSelected = value === icon.name
          return (
            <button
              key={icon.name}
              onClick={() => handleSelect(icon.name)}
              title={icon.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 4px 6px',
                border: isSelected
                  ? '2px solid var(--card-focus-ring-color, #0070f3)'
                  : '1px solid var(--card-border-color, #e0e0e0)',
                borderRadius: '6px',
                background: isSelected
                  ? 'var(--card-focus-ring-color, #e8f0fe)'
                  : 'var(--card-bg-color, #fafafa)',
                cursor: 'pointer',
                transition: 'border-color 0.1s, background 0.1s',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '24px', lineHeight: 1 }}
              >
                {icon.name}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  textAlign: 'center',
                  lineHeight: 1.2,
                  color: 'var(--card-muted-fg-color, #666)',
                  wordBreak: 'break-word',
                }}
              >
                {icon.label}
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '16px',
              color: 'var(--card-muted-fg-color, #888)',
              fontSize: '13px',
            }}
          >
            No icons match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {/* Fallback text input for custom icon names */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label
          style={{ fontSize: '11px', color: 'var(--card-muted-fg-color, #888)', fontWeight: 500 }}
        >
          Or type any Material Symbols name
        </label>
        <input
          type="text"
          placeholder="e.g. favorite_border"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value.trim()
            onChange(v ? set(v) : unset())
          }}
          style={{
            padding: '7px 10px',
            border: '1px solid var(--card-border-color, #ddd)',
            borderRadius: '4px',
            fontSize: '13px',
            background: 'var(--card-bg-color, #fff)',
            color: 'var(--card-fg-color, #333)',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  )
}
