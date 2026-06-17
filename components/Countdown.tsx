'use client'

import { useEffect, useReducer } from 'react'
import { EVENT_DATE_ISO } from '@/lib/constants/event'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  const diff = Math.max(0, new Date(EVENT_DATE_ISO).getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  }
}

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

function TimeBlock({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  const max = label === 'Días' ? 365 : label === 'Horas' ? 24 : 60
  const circumference = 213.628 // 2 * pi * 34
  const progress = circumference * (1 - value / max)

  return (
    <div className="cd-unit flex flex-col items-center gap-2">
      <svg viewBox="0 0 80 80" className="-rotate-90 w-[18vw] max-w-[80px] h-auto overflow-visible" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))' }}>
        {/* Círculo exterior (profundidad) */}
        <circle cx="40" cy="40" r="38" fill="none" stroke="var(--stone)" strokeWidth="0.5" />
        {/* Círculo interior (profundidad) */}
        <circle cx="40" cy="40" r="30" fill="none" stroke="var(--stone)" strokeWidth="0.5" />
        
        {/* Anillo de fondo */}
        <circle
          cx="40" cy="40" r="34"
          fill="rgba(255,255,255,0.4)"
          stroke="var(--stone)"
          strokeWidth="3"
        />
        <circle
          cx="40" cy="40" r="34"
          fill="none"
          stroke="var(--euca)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          style={{ transition: 'stroke-dashoffset 0.9s ease' }}
        />
        <text
          x="40" y="40"
          className="font-serif text-[1.4rem]"
          fill="var(--carbon)"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ transform: 'rotate(90deg)', transformOrigin: '40px 40px' }}
        >
          {display}
        </text>
      </svg>
      <span className="text-[0.45rem] sm:text-[0.5rem] uppercase tracking-[0.35em] text-[var(--euca)] font-semibold text-center">
        {label}
      </span>
    </div>
  )
}

export function Countdown() {
  const [state, tick] = useReducer(
    (_prev: TimeLeft | false) => calculateTimeLeft(),
    false as TimeLeft | false,
  )

  useEffect(() => {
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [])

  const t = state || ZERO

  return (
    <div role="timer" aria-live="off" className="flex items-center justify-center gap-1 sm:gap-2 flex-nowrap w-full max-w-[400px] mx-auto px-2">
      <TimeBlock value={t.days}    label="Días" />
      <span className="text-[1.2rem] text-[var(--border)] pb-7 shrink-0">·</span>
      <TimeBlock value={t.hours}   label="Horas" />
      <span className="text-[1.2rem] text-[var(--border)] pb-7 shrink-0">·</span>
      <TimeBlock value={t.minutes} label="Minutos" />
      <span className="text-[1.2rem] text-[var(--border)] pb-7 shrink-0">·</span>
      <TimeBlock value={t.seconds} label="Segundos" />
    </div>
  )
}
