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
  const [spotifyToken, setSpotifyToken] = useState('')
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false)
  const [playlistResult, setPlaylistResult] = useState<{ url?: string; error?: string } | null>(null)

  const handleCopy = () => {
    const text = songs.map((s, i) => `${i + 1}. ${s.title}`).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleCreatePlaylist = async () => {
    if (!spotifyToken) {
      setPlaylistResult({ error: 'Por favor ingresa un token de Spotify válido.' })
      return
    }

    setIsCreatingPlaylist(true)
    setPlaylistResult(null)

    try {
      const response = await fetch('/api/spotify/playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: spotifyToken,
          songs: songs.map(s => s.title),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error desconocido al crear la playlist')
      }

      setPlaylistResult({ url: data.url })
      setSpotifyToken('') // Clear token for security after successful use
    } catch (err: any) {
      setPlaylistResult({ error: err.message })
    } finally {
      setIsCreatingPlaylist(false)
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Spotify Integration Card */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        padding: '24px',
        border: '1px solid #1db954',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ background: '#1db954', color: '#fff', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            S
          </div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111827' }}>Integración con Spotify</h3>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: '#6b7280' }}>
          Ingresa un <a href="https://developer.spotify.com/console/post-playlists/" target="_blank" rel="noopener noreferrer" style={{ color: '#1db954' }}>Access Token temporal</a> para crear automáticamente la playlist <strong>🌸 Boda R&G - Playlist de Invitados</strong> en tu cuenta.
        </p>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Pega el Token de Spotify aquí..."
            value={spotifyToken}
            onChange={(e) => setSpotifyToken(e.target.value)}
            disabled={isCreatingPlaylist}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            onClick={handleCreatePlaylist}
            disabled={isCreatingPlaylist || !spotifyToken}
            style={{
              background: '#1db954',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: isCreatingPlaylist || !spotifyToken ? 'not-allowed' : 'pointer',
              opacity: isCreatingPlaylist || !spotifyToken ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap'
            }}
          >
            {isCreatingPlaylist ? '⏳ Creando...' : '🎧 Crear Playlist'}
          </button>
        </div>

        {playlistResult?.error && (
          <div style={{ marginTop: 16, padding: '12px', background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: 13 }}>
            ❌ {playlistResult.error}
          </div>
        )}
        
        {playlistResult?.url && (
          <div style={{ marginTop: 16, padding: '12px', background: '#d1fae5', color: '#065f46', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>✅ ¡Playlist creada con éxito!</span>
            <a href={playlistResult.url} target="_blank" rel="noopener noreferrer" style={{ background: '#059669', color: '#fff', padding: '6px 12px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}>
              Abrir en Spotify
            </a>
          </div>
        )}
      </div>

      {/* Songs list */}
      <div style={{
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        overflow: 'hidden',
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
            {copied ? '✓ ¡Copiado!' : '📋 Copiar lista manual'}
          </button>
        </div>

        {/* Songs items */}
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
    </div>
  )
}
