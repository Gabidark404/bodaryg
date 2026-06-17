'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, CheckCircle2 } from 'lucide-react'
import {
  COUPLE_NAMES,
  EVENT_DATE_LABEL,
  EVENT_TIME_LABEL,
  VENUE_NAME,
  VENUE_LOCATION,
} from '@/lib/constants/event'

interface DigitalPassProps {
  guestName: string
  attendees: number
  attendeeNames?: string[]
  visible?: boolean
}

export function DigitalPass({ guestName, attendees, attendeeNames, visible = true }: DigitalPassProps) {
  const ticketRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleDownload() {
    if (!ticketRef.current || status === 'loading') return
    setStatus('loading')
    try {
      // Warm-up para asegurar que las fuentes/recursos estén cargados
      await toPng(ticketRef.current, { pixelRatio: 1 })
      
      const dataUrl = await toPng(ticketRef.current, {
        backgroundColor: '#FDFAF5', // var(--cream)
        pixelRatio: 3,
        skipAutoScale: false,
      })
      const link = document.createElement('a')
      link.download = `pase-boda-rg-${guestName.toLowerCase().replace(/\s+/g, '-')}.png`
      link.href = dataUrl
      link.click()
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div id="digital-pass" className={visible ? 'show' : ''}>
      <p className="dp-title">Tu Pase Digital</p>
      <p className="dp-sub">Presenta este pase al llegar</p>

      <div ref={ticketRef} className="ticket">
        <div className="ticket-gold-top"></div>
        <div className="ticket-corner tl"></div>
        <div className="ticket-corner tr"></div>
        <div className="ticket-inner bg-[var(--cream)] relative">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <img src="/logo-rg.png" alt="R&G" style={{ width: '48px', height: 'auto', opacity: 0.9 }} crossOrigin="anonymous" />
          </div>
          <span className="t-small">Boda</span>
          <p className="t-couple">{COUPLE_NAMES}</p>
          
          <div className="t-diamond-row">
            <div className="t-diamond"></div>
          </div>
          
          <p className="t-meta">{EVENT_DATE_LABEL} &middot; {EVENT_TIME_LABEL}</p>
          <p className="t-meta">{VENUE_NAME} &middot; {VENUE_LOCATION}</p>
          
          <div className="t-perf">
            <div className="t-notch absolute -left-[38px]"></div>
            <div className="t-notch absolute -right-[38px]"></div>
          </div>
          
          {attendeeNames && attendeeNames.length > 0 ? (
            <div style={{ marginTop: '8px', marginBottom: '8px' }}>
              {attendeeNames.map((name, i) => (
                <p key={i} className="t-guest-name" style={{ fontSize: attendeeNames.length > 2 ? '1.3rem' : '1.5rem', marginBottom: '4px', lineHeight: '1.2' }}>
                  {name}
                </p>
              ))}
            </div>
          ) : (
            <p className="t-guest-name">{guestName}</p>
          )}
          <span className="t-pill">
            {attendees} {attendees === 1 ? 'persona' : 'personas'}
          </span>
        </div>
        <div className="ticket-corner bl"></div>
        <div className="ticket-corner br"></div>
        <div className="ticket-gold-bot"></div>
      </div>

      <button
        onClick={handleDownload}
        className="download-btn"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <span className="mr-2 h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin inline-block" />
            Generando pase...
          </>
        ) : status === 'done' ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-1" />
            ¡Pase descargado!
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar Pase Digital
          </>
        )}
      </button>
    </div>
  )
}

