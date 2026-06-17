import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { getAllGuests } from '@/lib/guests-service'

export async function GET() {
  const guests = getAllGuests()

  const rows = guests.map((guest) => ({
    ID: guest.id,
    Nombre: guest.name,
    'Pases Máx.': guest.pases,
    Confirmado: guest.confirmed ? 'Sí' : 'Pendiente',
    Asiste: guest.confirmed
      ? guest.attending
        ? 'Sí'
        : 'No'
      : '—',
    'Nº Asistentes': guest.attendees ?? '—',
    'Nombres Asistentes': guest.attendeeNames?.join(', ') ?? '—',
    'Canciones Sugeridas':
      guest.songs && guest.songs.length > 0
        ? guest.songs.map((s) => `${s.title}${s.url ? ` (${s.url})` : ''}`).join(' | ')
        : '—',
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)

  // Column widths
  worksheet['!cols'] = [
    { wch: 16 },
    { wch: 24 },
    { wch: 12 },
    { wch: 14 },
    { wch: 8 },
    { wch: 14 },
    { wch: 40 },
    { wch: 50 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Invitados')

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  const today = new Date().toISOString().split('T')[0]

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="invitados-boda-${today}.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
