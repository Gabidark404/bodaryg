import { getAllGuests } from '@/lib/guests-service'
import { SongsSection } from '../SongsSection'

export const dynamic = 'force-dynamic'

export default async function CancionesPage() {
  const guests = await getAllGuests()

  // Build consolidated songs list with guest name
  const allSongs = guests.flatMap((g) =>
    (g.songs ?? []).filter(s => s.title.trim().length > 0).map(s => ({
      title: s.title,
      url: s.url,
      guestName: g.name,
    }))
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
          Gestión de Canciones
        </h2>
        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
          Administra las canciones sugeridas y expórtalas a Spotify.
        </p>
      </div>

      <SongsSection songs={allSongs} />
      
      <p style={{ marginTop: 32, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
        Panel de Administración — Boda R&G
      </p>
    </div>
  )
}
