'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, User } from 'lucide-react'
import type { Guest } from '@/lib/types/guest'

interface RSVPFormProps {
  guestId: string
  guestName: string
  maxPases: number
  initialGuest?: Guest
  onConfirmed: (guest: Guest) => void
}

// ─── Schema ───────────────────────────────────────────────────────────────────
function createSchema(maxPases: number) {
  return z
    .object({
      attending: z.enum(['yes', 'no']),
      attendees: z.coerce.number().int(),
      attendeeNames: z.array(z.object({ name: z.string() })),
      songs: z.array(z.object({ title: z.string() })),
    })
    .superRefine((data, ctx) => {
      if (data.attending === 'yes') {
        if (data.attendees < 1 || data.attendees > maxPases) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Puedes confirmar entre 1 y ${maxPases} persona(s).`,
            path: ['attendees'],
          })
        }
        data.attendeeNames.slice(0, data.attendees).forEach((item, idx) => {
          if (!item.name.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'El nombre es obligatorio.',
              path: ['attendeeNames', idx, 'name'],
            })
          }
        })
      } else if (data.attendees !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Si declinas, el número de asistentes debe ser 0.',
          path: ['attendees'],
        })
      }
    })
}

type FormValues = z.infer<ReturnType<typeof createSchema>>

function buildDefaultNames(
  guestName: string,
  maxPases: number,
  existing?: string[],
): { name: string }[] {
  let splitNames = [guestName];
  if (guestName.includes(' y ')) {
    splitNames = guestName.split(' y ').map((n) => n.trim());
  }

  return Array.from({ length: maxPases }, (_, i) => {
    let defaultName = '';
    if (i < splitNames.length) {
      defaultName = splitNames[i];
    }
    return {
      name: existing?.[i] ?? defaultName,
    };
  });
}

// ─── Confirmed (YES) ─────────────────────────────────────────────────────────
function ConfirmedYes({ guest }: { guest: Guest }) {
  const [songs, setSongs] = useState<{ title: string }[]>(guest.songs?.map(s => ({ title: s.title })) ?? []);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Initialize songs from guest prop when it changes
    setSongs(guest.songs?.map(s => ({ title: s.title })) ?? []);
  }, [guest]);

  const addSong = useCallback(() => {
    setSongs(prev => [...prev, { title: '' }]);
  }, []);

  const removeSong = useCallback((index: number) => {
    setSongs(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateSongTitle = useCallback((index: number, title: string) => {
    setSongs(prev => {
      const newSongs = [...prev];
      newSongs[index] = { title };
      return newSongs;
    });
  }, []);

  const saveSongs = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const res = await fetch('/api/invitados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: guest.id,
          attending: guest.attending ?? false,
          attendees: guest.attendees ?? 0,
          attendeeNames: guest.attendeeNames ?? [],
          songs: songs.map(s => ({ title: s.title })).filter(s => s.title.length > 0)
        }),
      });

      if (!res.ok) {
        throw new Error('Error al guardar las canciones');
      }

      const data = await res.json();
      // Update local guest state with latest from server
      setSongs(data.guest.songs?.map(s => ({ title: s.title })) ?? []);
      setSaveStatus('success');

      // Reset status after 2 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Failed to save songs:', err);
    } finally {
      setIsSaving(false);
    }
  }, [guest.attending, guest.attendees, guest.attendeeNames, guest.id, songs]);

  // Auto-save when songs change (optional - could rely on manual save button)
  // useEffect(() => {
  //   if (songs.length > 0) {
  //     saveSongs();
  //   }
  // }, [songs, saveSongs]);

  return (
    <div className="confirmed-yes">
      <div className="check-wrap">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <h2 className="font-serif text-[2rem] text-[var(--carbon)] mb-2">Asistencia Confirmada</h2>
      <p className="subh">¡Te esperamos!</p>
      <p style={{ fontSize: '.85rem', color: 'var(--muted)' }}>
        Has confirmado tu asistencia para{' '}
        <strong style={{ color: 'var(--carbon)' }}>
          {guest.attendees} {guest.attendees === 1 ? 'persona' : 'personas'}
        </strong>.
      </p>
      {guest.attendeeNames && guest.attendeeNames.length > 0 && (
        <div className="names-list">
          <p className="nl-label">Asistentes registrados</p>
          <ul style={{ listStyle: 'none' }}>
            {guest.attendeeNames.map((n, i) => (
              <li key={i}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {n}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sección de gestión de canciones */}
      <div className="field-block">
        <span className="field-label">Tu lista de canciones</span>
        <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: 12 }}>
          ¡Que no falte tu canción favorita! Puedes seguir añadiendo canciones a nuestra lista de reproducción.
        </p>

        {songs.length > 0 ? (
          songs.map((song, index) => (
            <div key={index} className="song-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--border)', flexShrink: 0 }}>
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
              <input
                type="text"
                placeholder="Ej. Fly Me to the Moon – Frank Sinatra"
                value={song.title}
                onChange={(e) => updateSongTitle(index, e.target.value)}
              />
              {songs.length > 1 && (
                <button
                  type="button"
                  className="del-btn"
                  onClick={() => removeSong(index)}
                  aria-label="Eliminar canción"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={{ fontSize: '.87rem', color: 'var(--muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
            Aún no has añadido ninguna canción. ¡Haz clic en "Añadir otra canción" para comenzar!
          </p>
        )}

        <button
          type="button"
          className={`add-song${isSaving ? ' add-song-disabled' : ''}`}
          onClick={!isSaving ? addSong : undefined}
          disabled={isSaving}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Añadir otra canción
        </button>

        {saveStatus !== 'idle' && (
          <p style={{
            marginTop: 12,
            padding: '8px 12px',
            borderRadius: 8,
            fontSize: '.75rem',
            textAlign: 'center',
            backgroundColor: saveStatus === 'success'
              ? 'rgba(128,150,113,0.1)'
              : saveStatus === 'error'
                ? 'rgba(220,38,38,0.1)'
                : 'rgba(0,0,0,0.03)',
            color: saveStatus === 'success'
              ? 'var(--euca)'
              : saveStatus === 'error'
                ? '#dc2626'
                : 'var(--muted)',
            border: `1px solid ${saveStatus === 'success'
              ? 'rgba(128,150,113,0.3)'
              : saveStatus === 'error'
                ? 'rgba(220,38,38,0.3)'
                : 'rgba(0,0,0,0.1)'}`
          }}>
            {saveStatus === 'saving' && 'Guardando cambios...'}
            {saveStatus === 'success' && '¡Canciones guardadas!'}
            {saveStatus === 'error' && 'Error al guardar. Inténtalo de nuevo.'}
          </p>
        )}

        <button
          type="button"
          onClick={saveSongs}
          disabled={isSaving || (songs.length > 0 && songs.every(s => !s.title.trim()))}
          className="submit-btn"
        >
          {isSaving ? 'Guardando...' : 'Guardar canciones'}
        </button>
      </div>

      <p style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: 12 }}>
        Puedes descargar tu pase digital más abajo.
      </p>
    </div>
  )
}

// ─── Confirmed (NO) ──────────────────────────────────────────────────────────
function ConfirmedNo() {
  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: 12 }}>Respuesta Recibida</h2>
      <p style={{ fontSize: '.87rem', color: 'var(--muted)' }}>
        Lamentamos mucho que no puedas acompañarnos, pero agradecemos que nos hayas avisado.
      </p>
    </div>
  )
}

// ─── Main Form ───────────────────────────────────────────────────────────────
export function RSVPForm({
  guestId,
  guestName,
  maxPases,
  initialGuest,
  onConfirmed,
}: RSVPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  // Songs always open by default
  const [showSongs, setShowSongs] = useState(true)

  const alreadyConfirmed = initialGuest?.confirmed === true
  const schema = createSchema(maxPases)

  const splitNames = guestName.includes(' y ') ? guestName.split(' y ').map(n => n.trim()) : [guestName]
  const defaultAttendeesCount = maxPases

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      attending: alreadyConfirmed && !initialGuest.attending ? 'no' : 'yes',
      attendees: alreadyConfirmed ? (initialGuest?.attendees ?? 1) : defaultAttendeesCount,
      attendeeNames: buildDefaultNames(guestName, maxPases, initialGuest?.attendeeNames),
      songs: initialGuest?.songs?.length
        ? initialGuest.songs.map((s) => ({ title: typeof s === 'string' ? s : s.title }))
        : [{ title: '' }],
    },
  })

  const { fields: songFields, append: appendSong, remove: removeSong } = useFieldArray({
    control: form.control,
    name: 'songs',
  })

  const attending      = form.watch('attending')
  const attendeesCount = form.watch('attendees')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let splitNames = [guestName];
    if (guestName.includes(' y ')) {
      splitNames = guestName.split(' y ').map((n) => n.trim());
    }

    if (!form.getValues('attendeeNames.0.name')) {
      form.setValue('attendeeNames.0.name', splitNames[0] || guestName);
    }
    if (splitNames.length > 1 && maxPases > 1 && !form.getValues('attendeeNames.1.name')) {
      form.setValue('attendeeNames.1.name', splitNames[1]);
    }
    // NOTE: `form` is intentionally excluded — its reference changes every render
    // and including it here caused an infinite re-render loop.
  }, [guestName])

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    setApiError(null)

    const attendingBool = values.attending === 'yes'
    const attendeeNames = attendingBool
      ? values.attendeeNames.slice(0, values.attendees).map((a) => a.name.trim())
      : []
    const songs = values.songs
      .map((s) => ({ title: s.title.trim() }))
      .filter((s) => s.title.length > 0)

    try {
      const res = await fetch('/api/invitados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: guestId,
          attending: attendingBool,
          attendees: attendingBool ? values.attendees : 0,
          attendeeNames,
          songs,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'No se pudo enviar la confirmación.')
      onConfirmed(data.guest)
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Already confirmed ────────────────────────────────────────────────────
  if (alreadyConfirmed && initialGuest?.attending)           return <ConfirmedYes guest={initialGuest} />
  if (alreadyConfirmed && initialGuest?.attending === false) return <ConfirmedNo />

  // ── Active form ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

      {/* ¿Asistirás? */}
      <p className="rsvp-q">¿Nos acompañarás ese día?</p>
      <div className="radio-grid">
        <label
          className={`r-opt${attending === 'yes' ? ' active' : ''}`}
          onClick={() => {
            form.setValue('attending', 'yes')
            form.setValue('attendees', defaultAttendeesCount)
          }}
        >
          <input
            type="radio"
            name="attending"
            value="yes"
            checked={attending === 'yes'}
            onChange={() => {}}
          />
          {' '}Sí, asistiré con gusto
        </label>
        <label
          className={`r-opt${attending === 'no' ? ' active' : ''}`}
          onClick={() => {
            form.setValue('attending', 'no')
            form.setValue('attendees', 0)
          }}
        >
          <input
            type="radio"
            name="attending"
            value="no"
            checked={attending === 'no'}
            onChange={() => {}}
          />
          {' '}No podré asistir
        </label>
      </div>

      {/* Campos para asistentes */}
      {attending === 'yes' && (
        <div>
          {/* Número de personas */}
          <div className="field-block">
            <span className="field-label">Número de personas</span>
            <select
              className="rsvp-select"
              value={String(attendeesCount)}
              onChange={(e) => form.setValue('attendees', Number(e.target.value))}
            >
              {Array.from({ length: maxPases }, (_, i) => i + 1).map((n) => (
                <option key={n} value={String(n)}>
                  {n} {n === 1 ? 'persona' : 'personas'}
                </option>
              ))}
            </select>
            <p style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: 6 }}>
              Pases disponibles: <span>{maxPases}</span>
            </p>
            {form.formState.errors.attendees && (
              <p style={{ fontSize: '.75rem', color: '#dc2626', marginTop: 4 }} role="alert">
                {form.formState.errors.attendees.message}
              </p>
            )}
          </div>

          {/* Nombres de asistentes */}
          <div className="field-block">
            <span className="field-label">Nombres de asistentes</span>
            {Array.from({ length: attendeesCount }, (_, i) => (
              <div key={i} className="name-slot">
                <label htmlFor={`name-${i}`}>
                  {(() => {
                    const splitNamesForUI = guestName.includes(' y ') ? guestName.split(' y ').map(n => n.trim()) : [guestName];
                    if (i < splitNamesForUI.length) {
                      return `Titular de la invitación ${splitNamesForUI.length > 1 ? i + 1 : ''}`.trim();
                    }
                    return `Acompañante ${i + 1 - splitNamesForUI.length}`;
                  })()}
                </label>
                <Controller
                  control={form.control}
                  name={`attendeeNames.${i}.name`}
                  render={({ field }) => {
                    const splitNamesForUI = guestName.includes(' y ') ? guestName.split(' y ').map(n => n.trim()) : [guestName];
                    const isReadOnly = i < splitNamesForUI.length;
                    const placeholder = i < splitNamesForUI.length ? splitNamesForUI[i] : 'Nombre y Apellido';
                    
                    return (
                      <input
                        {...field}
                        id={`name-${i}`}
                        type="text"
                        placeholder={placeholder}
                        readOnly={isReadOnly}
                      />
                    );
                  }}
                />
                {form.formState.errors.attendeeNames?.[i]?.name && (
                  <p style={{ fontSize: '.65rem', color: '#dc2626', marginTop: 4 }} role="alert">
                    {form.formState.errors.attendeeNames[i]?.name?.message}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="divider-thin"></div>

          {/* Sugerencias musicales */}
          <div className="field-block">
            <button
              type="button"
              className={`songs-toggle${showSongs ? ' open' : ''}`}
              onClick={() => setShowSongs((s) => !s)}
            >
              {/* Music icon */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"/>
                <circle cx="6" cy="18" r="3"/>
                <circle cx="18" cy="16" r="3"/>
              </svg>
              Sugerencias musicales{' '}
              <span style={{ fontWeight: 300, textTransform: 'none', letterSpacing: 0, fontSize: '.72rem', color: 'var(--muted)' }}>
                (opcional)
              </span>
              {/* Chevron icon */}
              <svg style={{ width: 14, height: 14, color: 'var(--euca)', marginLeft: 'auto' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {showSongs && (
              <div>
                <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: 12 }}>
                  ¡Que no falte tu canción favorita! Ayúdanos a armar la lista para este baile inolvidable.
                </p>
                {songFields.map((field, i) => (
                  <div key={field.id} className="song-row">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--border)', flexShrink: 0 }}>
                      <path d="M9 18V5l12-2v13"/>
                      <circle cx="6" cy="18" r="3"/>
                      <circle cx="18" cy="16" r="3"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="Ej. Fly Me to the Moon – Frank Sinatra"
                      {...form.register(`songs.${i}.title`)}
                    />
                    {songFields.length > 1 && (
                      <button
                        type="button"
                        className="del-btn"
                        onClick={() => removeSong(i)}
                        aria-label="Eliminar canción"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="add-song" onClick={() => appendSong({ title: '' })}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Añadir otra canción
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {attending === 'no' && (
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '.87rem', color: 'var(--muted)', fontStyle: 'italic' }}>
            Lamentaremos tu ausencia. Igual agradecemos que nos lo hagas saber.
          </p>
        </div>
      )}

      {/* Error */}
      {apiError && (
        <div
          role="alert"
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            fontSize: '.82rem',
            padding: '12px 16px',
            borderRadius: 12,
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          {apiError}
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Procesando...' : 'Confirmar Respuesta'}
      </button>
    </form>
  )
}
