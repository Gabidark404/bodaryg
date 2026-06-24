import { getAllGuests } from '@/lib/guests-service'

export const dynamic = 'force-dynamic'

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number | string
  color: string
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '20px 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        borderLeft: `4px solid ${color}`,
        minWidth: 140,
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</p>
      <p style={{ margin: '6px 0 0', fontSize: 32, fontWeight: 700, color: '#111827' }}>
        {value}
      </p>
    </div>
  )
}

function Badge({ status }: { status: 'confirmed' | 'declined' | 'pending' }) {
  const map = {
    confirmed: { label: 'Confirmado ✓', bg: '#d1fae5', color: '#065f46' },
    declined: { label: 'Declinó', bg: '#fee2e2', color: '#991b1b' },
    pending: { label: 'Pendiente', bg: '#fef9c3', color: '#713f12' },
  }
  const s = map[status]
  return (
    <span
      style={{
        display: 'inline-block',
        background: s.bg,
        color: s.color,
        borderRadius: 6,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  )
}

export default async function DashboardPage() {
  const guests = await getAllGuests()

  const total = guests.length
  const confirmed = guests.filter((g) => g.confirmed && g.attending).length
  const declined = guests.filter((g) => g.confirmed && !g.attending).length
  const pending = guests.filter((g) => !g.confirmed).length
  const totalAttendees = guests.reduce((sum, g) => sum + (g.attendees ?? 0), 0)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
          Vista General
        </h2>
        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
          Métricas y lista de invitados
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <StatCard label="Total Invitados" value={total} color="#d4afb4" />
        <StatCard label="Confirmados" value={confirmed} color="#34d399" />
        <StatCard label="Asistentes" value={totalAttendees} color="#60a5fa" />
        <StatCard label="Pendientes" value={pending} color="#fbbf24" />
        <StatCard label="Declinaron" value={declined} color="#f87171" />
      </div>

      {/* Actions */}
      <div style={{ marginBottom: 24, display: 'flex', gap: 12 }}>
        <a
          href="/api/excel"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#217346',
            color: '#fff',
            borderRadius: 8,
            padding: '10px 20px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          📥 Descargar Excel
        </a>
        <a
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '10px 20px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          🔗 Ver Invitación
        </a>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                {[
                  'Invitado',
                  'Pases',
                  'Estado',
                  'Asistentes',
                  'Nombres',
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#374151',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, i) => {
                const status = !guest.confirmed
                  ? 'pending'
                  : guest.attending
                    ? 'confirmed'
                    : 'declined'
                return (
                  <tr
                    key={guest.id}
                    style={{
                      borderBottom: '1px solid #f3f4f6',
                      background: i % 2 === 0 ? '#ffffff' : '#fcfcfc',
                      transition: 'background 0.2s',
                    }}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>
                        {guest.name}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
                        {guest.id}
                      </p>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                      {guest.pases}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge status={status} />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>
                      {guest.attendees ?? '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151', maxWidth: 200 }}>
                      {guest.attendeeNames && guest.attendeeNames.length > 0 ? (
                        <div style={{ maxHeight: 100, overflowY: 'auto', paddingRight: 4 }}>
                          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                            {guest.attendeeNames.map((n, idx) => (
                              <li key={idx}>{n}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
        Última actualización: {new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' })} (VET)
      </p>
    </div>
  )
}
