import type { Guest, RsvpPayload, SongSuggestion } from '@/lib/types/guest'
import guestsSeed from '@/lib/data/guests.json'
import { supabase } from '@/lib/supabase'

type GuestSeed = Pick<Guest, 'id' | 'name' | 'pases'>

interface DbResponse {
  id: string
  confirmed: boolean
  attending: boolean
  attendees: number
  attendee_names: string[] | null
  songs: any
  updated_at: string
}

function mapDbResponseToGuest(seed: GuestSeed, dbResp?: DbResponse): Guest {
  if (!dbResp) {
    return {
      id: seed.id,
      name: seed.name,
      pases: seed.pases,
      confirmed: false,
    }
  }
  return {
    id: seed.id,
    name: seed.name,
    pases: seed.pases,
    confirmed: dbResp.confirmed,
    attending: dbResp.attending,
    attendees: dbResp.attendees,
    attendeeNames: dbResp.attendee_names ?? [],
    songs: (dbResp.songs as SongSuggestion[]) ?? [],
  }
}

export async function getGuestById(id: string): Promise<Guest | null> {
  const seed = (guestsSeed as GuestSeed[]).find((guest) => guest.id === id)
  if (!seed) { return null }

  try {
    const { data, error } = await supabase
      .from('guest_responses')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching guest response from Supabase:', error)
      return mapDbResponseToGuest(seed)
    }

    return mapDbResponseToGuest(seed, data as DbResponse)
  } catch (err) {
    console.error('Failed to get guest by ID:', err)
    return mapDbResponseToGuest(seed)
  }
}

export async function getAllGuests(): Promise<Guest[]> {
  try {
    const { data, error } = await supabase
      .from('guest_responses')
      .select('*')

    if (error) {
      console.error('Error fetching all guest responses from Supabase:', error)
      return (guestsSeed as GuestSeed[]).map((seed) => mapDbResponseToGuest(seed))
    }

    const responsesMap = new Map<string, DbResponse>()
    if (data) {
      data.forEach((row) => {
        responsesMap.set(row.id, row as DbResponse)
      })
    }

    return (guestsSeed as GuestSeed[]).map((seed) => {
      return mapDbResponseToGuest(seed, responsesMap.get(seed.id))
    })
  } catch (err) {
    console.error('Failed to get all guests:', err)
    return (guestsSeed as GuestSeed[]).map((seed) => mapDbResponseToGuest(seed))
  }
}

export function validateRsvpPayload(guest: Guest, payload: RsvpPayload): string | null {
  if (payload.attending) {
    if (!Number.isInteger(payload.attendees) || payload.attendees < 1 || payload.attendees > guest.pases) {
      return `El numero de asistentes debe estar entre 1 y ${guest.pases}.`
    }
    if (!payload.attendeeNames || payload.attendeeNames.length !== payload.attendees) {
      return `Debes proporcionar el nombre de cada asistente (${payload.attendees} en total).`
    }
    for (const name of payload.attendeeNames) {
      if (!name?.trim()) { return 'El nombre de cada asistente es obligatorio.' }
    }
  } else if (payload.attendees !== 0) {
    return 'Si declina la invitacion, el numero de asistentes debe ser 0.'
  }
  if (payload.songs) {
    for (const song of payload.songs) {
      if (!song.title?.trim()) { return 'Cada cancion sugerida debe incluir nombre y artista.' }
    }
  }
  return null
}

export async function updateGuestRsvp(id: string, payload: RsvpPayload): Promise<Guest> {
  const guest = await getGuestById(id)
  if (!guest) { throw new Error('INVITADO_NO_ENCONTRADO') }
  const validationError = validateRsvpPayload(guest, payload)
  if (validationError) { throw new Error(validationError) }
  
  const songs = payload.songs?.filter((song) => song.title.trim().length > 0) ?? []
  const attendeeNames = payload.attending
    ? (payload.attendeeNames ?? []).map((n) => n.trim()).filter(Boolean)
    : []

  const updateData = {
    id,
    confirmed: true,
    attending: payload.attending,
    attendees: payload.attending ? payload.attendees : 0,
    attendee_names: attendeeNames,
    songs,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('guest_responses')
    .upsert(updateData)

  if (error) {
    console.error('Error updating guest RSVP in Supabase:', error)
    throw new Error('No se pudo registrar la respuesta en la base de datos.')
  }

  return {
    ...guest,
    confirmed: true,
    attending: payload.attending,
    attendees: payload.attending ? payload.attendees : 0,
    attendeeNames,
    songs,
  }
}

// Keep a dummy syncExcelFile to avoid breaking any legacy code imports,
// but make it a no-op since Netlify filesystem is read-only.
export function syncExcelFile() {
  console.log('syncExcelFile is deprecated as file writing is not supported in production.')
}
