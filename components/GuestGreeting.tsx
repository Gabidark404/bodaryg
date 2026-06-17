import type { Guest } from '@/lib/types/guest'

interface GuestGreetingProps {
  guest: Guest | null
  isLoading?: boolean
  error?: string | null
}

export function GuestGreeting({ guest, isLoading, error }: GuestGreetingProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-10 animate-pulse">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--euca)] border-t-transparent animate-spin mx-auto" />
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--euca)]">
          Buscando tu invitación…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[var(--linen)] border border-[var(--border)] rounded-2xl p-8 max-w-md mx-auto text-center space-y-2">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <p className="text-xs text-[var(--muted)]">
          Si crees que esto es un error, por favor contacta a los novios.
        </p>
      </div>
    )
  }

  if (guest) {
    return (
      <div className="animate-fade-in">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-[var(--muted)]">
          Especialmente para
        </p>
        <p className="font-serif text-[clamp(1.2rem,5vw,2.5rem)] text-[var(--carbon)] my-3 leading-tight whitespace-nowrap overflow-hidden text-ellipsis px-2">
          {guest.name}
        </p>
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-[var(--euca)]">
          Invitación válida para {guest.pases} {guest.pases === 1 ? 'persona' : 'personas'}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <p className="text-[0.85rem] text-[var(--muted)] leading-relaxed">
        Nos complace invitarle a celebrar nuestro matrimonio. Por favor, utilice el enlace
        personalizado que recibió para acceder a su invitación.
      </p>
    </div>
  )
}
