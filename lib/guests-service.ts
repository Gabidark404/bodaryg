import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as XLSX from 'xlsx'
import type { Guest, RsvpPayload } from '@/lib/types/guest'
import guestsSeed from '@/lib/data/guests.json'

const EXCEL_PATH = join(process.cwd(), 'lista para invitaciones.xlsx')
const RESPONSES_PATH = join(process.cwd(), 'lib/data/guest-responses.json')

type GuestSeed = Pick<Guest, 'id' | 'name' | 'pases'>

const memoryResponses = new Map<string, Partial<Guest>>()

function readResponsesFile(): Record<string, Partial<Guest>> {
  if (!existsSync(RESPONSES_PATH)) { return {} }
  try {
    const raw = readFileSync(RESPONSES_PATH, 'utf-8')
    return JSON.parse(raw) as Record<string, Partial<Guest>>
  } catch { return {} }
}

function writeResponsesFile(data: Record<string, Partial<Guest>>) {
  try {
    writeFileSync(RESPONSES_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch { /* Ignore write errors */ }
}

function getStoredResponse(id: string): Partial<Guest> | undefined {
  if (memoryResponses.has(id)) { return memoryResponses.get(id) }
  const fileData = readResponsesFile()
  if (fileData[id]) { memoryResponses.set(id, fileData[id]) }
  return fileData[id]
}

function saveResponse(id: string, response: Partial<Guest>) {
  memoryResponses.set(id, response)
  const fileData = readResponsesFile()
  fileData[id] = response
  writeResponsesFile(fileData)
}

function mergeGuest(seed: GuestSeed): Guest {
  const stored = getStoredResponse(seed.id)
  return { ...seed, ...stored, id: seed.id, name: seed.name, pases: seed.pases }
}

export function getGuestById(id: string): Guest | null {
  const seed = (guestsSeed as GuestSeed[]).find((guest) => guest.id === id)
  if (!seed) { return null }
  return mergeGuest(seed)
}

export function getAllGuests(): Guest[] {
  return (guestsSeed as GuestSeed[]).map((seed) => mergeGuest(seed))
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

export function updateGuestRsvp(id: string, payload: RsvpPayload): Guest {
  const guest = getGuestById(id)
  if (!guest) { throw new Error('INVITADO_NO_ENCONTRADO') }
  const validationError = validateRsvpPayload(guest, payload)
  if (validationError) { throw new Error(validationError) }
  const songs = payload.songs?.filter((song) => song.title.trim().length > 0) ?? []
  const attendeeNames = payload.attending
    ? (payload.attendeeNames ?? []).map((n) => n.trim()).filter(Boolean)
    : []
  const updated: Partial<Guest> = {
    confirmed: true,
    attending: payload.attending,
    attendees: payload.attending ? payload.attendees : 0,
    attendeeNames,
    songs,
  }
  saveResponse(id, updated)
  
  // Sync changes and links back to the Excel file
  syncExcelFile()

  return { ...guest, ...updated }
}

export function syncExcelFile() {
  const guests = getAllGuests()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tudominio.com'

  const rows = guests.map((guest) => ({
    'ID': guest.id,
    'Nombre': guest.name,
    'Pases Máx.': guest.pases,
    'Enlace Invitación': `${baseUrl}/?id=${guest.id}`,
    'Confirmado': guest.confirmed ? 'Sí' : 'Pendiente',
    'Asiste': guest.confirmed ? (guest.attending ? 'Sí' : 'No') : '—',
    'Nº Asistentes': guest.attendees ?? '—',
    'Nombres Asistentes': guest.attendeeNames?.join(', ') ?? '—',
    'Canciones Sugeridas':
      guest.songs && guest.songs.length > 0
        ? guest.songs.map((s) => s.title).join(' | ')
        : '—',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet['!cols'] = [
    { wch: 16 }, // ID
    { wch: 24 }, // Nombre
    { wch: 12 }, // Pases
    { wch: 45 }, // Enlace
    { wch: 14 }, // Confirmado
    { wch: 8 },  // Asiste
    { wch: 14 }, // Nº Asistentes
    { wch: 40 }, // Nombres Asistentes
    { wch: 50 }, // Canciones
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitados')

  try {
    XLSX.writeFile(workbook, EXCEL_PATH)
  } catch (error) {
    console.error('Error writing Excel file:', error)
  }
}

