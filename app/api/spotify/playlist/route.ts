import { NextResponse } from 'next/server'

async function fetchSpotify(endpoint: string, method: string, token: string, body?: any) {
  const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null)
    throw new Error(errorData?.error?.message || `Spotify API error: ${res.statusText}`)
  }
  
  return res.json()
}

export async function POST(req: Request) {
  try {
    const { token, songs } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'Token de Spotify requerido' }, { status: 400 })
    }

    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return NextResponse.json({ error: 'No hay canciones para agregar' }, { status: 400 })
    }

    // 1. Get user profile
    const userProfile = await fetchSpotify('me', 'GET', token)
    const userId = userProfile.id

    // 2. Create Playlist
    const playlist = await fetchSpotify(`users/${userId}/playlists`, 'POST', token, {
      name: '🌸 Boda R&G - Playlist de Invitados',
      description: 'Playlist generada automáticamente con las sugerencias de los invitados.',
      public: true,
    })

    const playlistId = playlist.id
    const playlistUrl = playlist.external_urls.spotify

    // 3. Search for tracks
    const trackUris: string[] = []
    
    // Process sequentially to avoid rate limits on search
    for (const songTitle of songs) {
      try {
        const query = encodeURIComponent(songTitle)
        const searchResult = await fetchSpotify(`search?q=${query}&type=track&limit=1`, 'GET', token)
        
        if (searchResult.tracks && searchResult.tracks.items && searchResult.tracks.items.length > 0) {
          trackUris.push(searchResult.tracks.items[0].uri)
        }
      } catch (err) {
        console.warn(`No se pudo encontrar la canción: ${songTitle}`, err)
        // Continue with the next song even if one fails
      }
    }

    if (trackUris.length === 0) {
      return NextResponse.json({ 
        url: playlistUrl, 
        message: 'Playlist creada, pero no se encontró ninguna canción exacta en Spotify.' 
      })
    }

    // 4. Add tracks to playlist (Spotify allows up to 100 URIs per request)
    // We chunk the array just in case there are >100 songs
    for (let i = 0; i < trackUris.length; i += 100) {
      const chunk = trackUris.slice(i, i + 100)
      await fetchSpotify(`playlists/${playlistId}/tracks`, 'POST', token, {
        uris: chunk
      })
    }

    return NextResponse.json({ url: playlistUrl, addedCount: trackUris.length })
    
  } catch (error: any) {
    console.error('Error creating Spotify playlist:', error)
    return NextResponse.json({ error: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
