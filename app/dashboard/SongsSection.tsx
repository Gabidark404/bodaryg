'use client'

import { useState } from 'react'

interface Song {
  title: string
  url?: string
}

interface SongWithGuest {
  title: string
  url?: string
  guestName: string
}

interface SongsSectionProps {
  songs: SongWithGuest[]
}

export function SongsSection({ songs }: SongsSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = songs.map((s, i) => `${i + 1}. ${s.title}`).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (songs.length === 0) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        padding: '32px 24px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 14,
        marginBottom: 32,
      }}>
        🎵 Aún no hay canciones sugeridas por los invitados.
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      marginBottom: 32,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #f3f4f6',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
            🎵 Lista de Canciones Sugeridas
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>
            {songs.length} canción{songs.length !== 1 ? 'es' : ''} sugerida{songs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: copied ? '#d1fae5' : '#f3f4f6',
            color: copied ? '#065f46' : '#374151',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {copied ? '✓ ¡Copiado!' : '📋 Copiar lista'}
        </button>
      </div>

      {/* Songs list */}
      <div style={{ padding: '8px 0' }}>
        {songs.map((song, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 20px',
              borderBottom: i < songs.length - 1 ? '1px solid #f9fafb' : 'none',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
              <span style={{
                fontSize: 12,
                color: '#9ca3af',
                fontWeight: 600,
                minWidth: 24,
                textAlign: 'right',
              }}>
                {i + 1}
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#111827',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {song.title}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9ca3af' }}>
                  Sugerida por: {song.guestName}
                </p>
              </div>
            </div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Buscar en YouTube"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                background: '#ff0000',
                color: '#fff',
                borderRadius: 6,
                padding: '5px 12px',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              ▶ YouTube
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
