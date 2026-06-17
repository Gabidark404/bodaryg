import { NextResponse } from 'next/server'
import { getGuestById, updateGuestRsvp } from '@/lib/guests-service'
import type { RsvpPayload } from '@/lib/types/guest'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'El parametro id es requerido.' }, { status: 400 })
  }
  const guest = getGuestById(id)
  if (!guest) {
    return NextResponse.json({ error: 'Invitado no encontrado.' }, { status: 404 })
  }
  return NextResponse.json({ guest })
}

export async function POST(request: Request) {
  let body: RsvpPayload
  try {
    body = (await request.json()) as RsvpPayload
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud invalido.' }, { status: 400 })
  }
  if (!body.id) {
    return NextResponse.json({ error: 'El campo id es requerido.' }, { status: 400 })
  }
  if (typeof body.attending !== 'boolean') {
    return NextResponse.json({ error: 'El campo attending es requerido.' }, { status: 400 })
  }
  if (typeof body.attendees !== 'number') {
    return NextResponse.json({ error: 'El campo attendees es requerido.' }, { status: 400 })
  }
  const guest = getGuestById(body.id)
  if (!guest) {
    return NextResponse.json({ error: 'Invitado no encontrado.' }, { status: 404 })
  }
  try {
    const updatedGuest = updateGuestRsvp(body.id, {
      id: body.id,
      attending: body.attending,
      attendees: body.attendees,
      attendeeNames: body.attendeeNames,
      songs: body.songs,
    })
    return NextResponse.json({ guest: updatedGuest })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo registrar la respuesta.'
    if (message === 'INVITADO_NO_ENCONTRADO') {
      return NextResponse.json({ error: 'Invitado no encontrado.' }, { status: 404 })
    }
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
