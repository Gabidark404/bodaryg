'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  MapPin,
  Car,
  Gift,
  Users,
  BellOff,
  Camera,
  Wine,
  Utensils,
  Music2,
  Heart,
} from 'lucide-react'
import type { Guest } from '@/lib/types/guest'
import {
  COUPLE_NAMES,
  EVENT_DATE_LABEL,
  EVENT_TIME_LABEL,
  MAPS_URL,
  VENUE_NAME,
  VENUE_LOCATION,
} from '@/lib/constants/event'
import { Countdown } from '@/components/Countdown'
import { DigitalPass } from '@/components/DigitalPass'
import { RSVPForm } from '@/components/RSVPForm'
import { GuestGreeting } from '@/components/GuestGreeting'

interface InvitationContentProps {
  guestId?: string
  initialGuest?: Guest | null
}

function useScrollAnimations(deps: any[] = []) {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' },
    )
    const elements = document.querySelectorAll('.animate-on-scroll, .animate-fade-in')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, deps)
}

const SuitTieIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M8 2v3l4 4 4-4V2" />
    <path d="M4 2v4l3 3-3 3v10h16V12l-3-3 3-3V2" />
    <path d="M12 9l-2 5 2 3 2-3-2-5Z" />
    <path d="M12 17v5" />
  </svg>
)

const itineraryItems = [
  { time: '4:00 pm',  label: 'Ceremonia',        Icon: Heart,    note: null },
  { time: '4:45 pm',  label: <>Fotografías<br/>Friends & Family</>, Icon: Camera, note: null },
  { time: '5:45 pm',  label: 'Brindis',           Icon: Wine,     note: null },
  { time: '7:30 pm',  label: 'Cena',              Icon: Utensils, note: null },
  { time: '12:00 am', label: 'Cierre',            Icon: Music2,   note: null },
]

const protocolCards = [
  {
    Icon: SuitTieIcon,
    title: 'Código de Vestimenta',
    content: (
      <p>
        Formal de día.<br />
        <strong>Vestido largo y traje formal.</strong><br />
        El color blanco es exclusivo para la novia.
      </p>
    ),
  },
  {
    Icon: Gift,
    title: 'Sugerencia de Regalos',
    content: (
      <p>
        Tu presencia en nuestra boda será nuestro mayor regalo. Si deseas tener un detalle con nosotros, nuestra modalidad de regalos será lluvia de sobres.
      </p>
    ),
  },
  {
    Icon: Users,
    title: 'Asistencia',
    content: (
      <>
        <div className="adults-headline">Evento sin niños.</div>
        <p>Exclusivamente para adultos.</p>
      </>
    ),
  },
  {
    Icon: BellOff,
    title: 'Ceremonia',
    content: (
      <p>
        Por favor, silencien sus teléfonos celulares durante el acto ceremonial.
      </p>
    ),
  },
]

export function InvitationContent({ guestId, initialGuest }: InvitationContentProps) {
  const [guest, setGuest] = useState<Guest | null>(initialGuest ?? null)
  const [isLoading] = useState(false)
  const [error] = useState<string | null>(
    guestId && !initialGuest ? 'Invitado no encontrado.' : null,
  )
  const [showPass, setShowPass] = useState(
    Boolean(initialGuest?.confirmed && initialGuest?.attending),
  )

  useScrollAnimations([showPass])

  function handleConfirmed(updatedGuest: Guest) {
    setGuest(updatedGuest)
    if (updatedGuest.attending) setShowPass(true)
  }

  return (
    <>
      {/* ─── HERO ────────────────────────────────────────── */}
      <section id="hero" className="relative h-[50svh] min-h-[400px] flex flex-col items-center justify-end overflow-hidden bg-[var(--linen)]">
        <Image
          src="/couple-hero.jpg"
          alt="Rainier & Guadalupe"
          fill
          priority
          id="hero-img"
          className="object-cover object-top absolute inset-0 w-full h-full"
        />
        <div id="hero-overlay" className="absolute inset-0" style={{background: 'linear-gradient(to bottom, rgba(245,241,235,0.15) 0%, rgba(245,241,235,0.3) 35%, rgba(245,241,235,0.7) 60%, var(--linen) 88%)'}}></div>
        
        {/* Logo at the top center with faded background */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-center pt-8 pb-16 bg-gradient-to-b from-[var(--linen)] via-[var(--linen)]/70 to-transparent">
          <Image src="/logo-rg.png" alt="R&G" width={64} height={64} className="w-16 h-auto opacity-90 animate-on-scroll" />
        </div>

        <div className="corner-tl animate-on-scroll"></div>
        <div className="corner-tr animate-on-scroll delay-100"></div>
        <div className="corner-bl animate-on-scroll delay-200"></div>
        <div className="corner-br animate-on-scroll delay-300"></div>

        <div id="hero-content" className="relative z-10 text-center w-full px-6 pb-8">
          <span className="label animate-on-scroll" style={{ fontSize: '0.8rem' }}>Nos Casamos</span>
          <h1 className="animate-on-scroll delay-100 text-[clamp(2rem,6vw,3.2rem)] font-serif tracking-wider text-[var(--carbon)] leading-tight mt-1 mb-3 whitespace-nowrap">
            Rainier &amp; Guadalupe
          </h1>
          <div className="blessing animate-on-scroll delay-200 mt-2 mb-6">
            <p className="font-serif text-sm text-[var(--muted)] italic">
              “Y los dos serán un solo cuerpo”
            </p>
            <p className="text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)] mt-2">
              — Génesis 2:24
            </p>
          </div>
          <div className="hero-date animate-on-scroll delay-300 flex items-center justify-center mt-4">
            <span className="text-[0.65rem] tracking-[0.4em] uppercase text-[var(--muted)]">15 de agosto de 2026</span>
          </div>
        </div>
      </section>

      {/* ─── QUOTE ───────────────────────────────────────── */}
      <section id="quote" className="bg-[var(--cream)] border-y border-[var(--border)] relative overflow-hidden">
        {/* Ornamental leaf — left */}
        <svg className="absolute -left-4 top-1/2 -translate-y-1/2 w-20 h-28 text-[var(--euca)] opacity-[0.07]" viewBox="0 0 80 110" fill="currentColor">
          <path d="M10,100 Q25,60 40,30 Q50,10 70,5 Q55,25 45,50 Q35,75 10,100Z"/>
          <path d="M25,95 Q35,65 55,35 Q65,18 75,10 Q60,35 50,60 Q40,80 25,95Z"/>
        </svg>
        {/* Ornamental leaf — right */}
        <svg className="absolute -right-4 top-1/2 -translate-y-1/2 w-20 h-28 text-[var(--euca)] opacity-[0.07] -scale-x-100" viewBox="0 0 80 110" fill="currentColor">
          <path d="M10,100 Q25,60 40,30 Q50,10 70,5 Q55,25 45,50 Q35,75 10,100Z"/>
          <path d="M25,95 Q35,65 55,35 Q65,18 75,10 Q60,35 50,60 Q40,80 25,95Z"/>
        </svg>
        <div className="inner max-w-lg mx-auto text-center py-16 px-6 animate-on-scroll relative z-10">
          {/* Ornamental open-quote */}
          <svg className="w-8 h-8 text-[var(--euca)] opacity-20 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.7 11 13.166 11 15c0 1.933-1.567 3.5-3.5 3.5-1.171 0-2.263-.57-2.917-1.179zM14.583 17.321C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C19.591 11.7 21 13.166 21 15c0 1.933-1.567 3.5-3.5 3.5-1.171 0-2.263-.57-2.917-1.179z"/>
          </svg>
          <blockquote className="font-serif text-lg italic text-[var(--muted)] leading-relaxed">
            "El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección."
          </blockquote>
          <div className="joy text-[0.85rem] text-[var(--carbon)] mt-5">
            — Antoine de Saint-Exupéry
          </div>
          {/* Ornamental divider */}
          <div className="flex items-center justify-center gap-3 mt-6 opacity-30">
            <div className="w-12 h-px bg-[var(--euca)]"></div>
            <svg className="w-4 h-4 text-[var(--euca)]" viewBox="0 0 16 16" fill="currentColor"><rect x="4" y="4" width="8" height="8" rx="1" transform="rotate(45 8 8)"/></svg>
            <div className="w-12 h-px bg-[var(--euca)]"></div>
          </div>
        </div>
      </section>

      {/* ─── GUEST ───────────────────────────────────────── */}
      <section id="guest" className="text-center pt-16 px-6 animate-on-scroll relative">
        {/* Ornamental frame corners */}
        <div className="max-w-md mx-auto relative py-8">
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[var(--euca)] opacity-25 rounded-tl-sm"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[var(--euca)] opacity-25 rounded-tr-sm"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[var(--euca)] opacity-25 rounded-bl-sm"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[var(--euca)] opacity-25 rounded-br-sm"></div>
          <GuestGreeting guest={guest} isLoading={isLoading} error={error} />
        </div>
      </section>

      {/* ─── COUNTDOWN ───────────────────────────────────── */}
      <section id="countdown" className="py-12 px-6 text-center animate-on-scroll relative">
        {/* Ornamental flourish above countdown */}
        <svg className="w-24 h-6 text-[var(--euca)] opacity-15 mx-auto mb-4" viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0,12 Q30,0 60,12 Q90,24 120,12" />
          <path d="M0,12 Q30,24 60,12 Q90,0 120,12" />
          <circle cx="60" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
        <div className="title text-[0.6rem] uppercase tracking-[0.4em] text-[var(--muted)] mb-8">
          El Gran Día se Acerca
        </div>
        <Countdown />
        {/* Ornamental flourish below countdown */}
        <svg className="w-24 h-6 text-[var(--euca)] opacity-15 mx-auto mt-6" viewBox="0 0 120 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0,12 Q30,0 60,12 Q90,24 120,12" />
          <path d="M0,12 Q30,24 60,12 Q90,0 120,12" />
          <circle cx="60" cy="12" r="3" fill="currentColor" stroke="none" />
        </svg>
      </section>

      {/* ─── LOCATION ────────────────────────────────────── */}
      <section id="location" className="py-20 px-6 relative animate-on-scroll">
        <div className="floral-wrap relative max-w-xl mx-auto">
          {/* Floral accents on sides for larger screens */}
          <div className="floral-side left hidden sm:block absolute top-1/2 -translate-y-1/2 -left-8 text-[var(--euca)] opacity-45">
             <svg className="floral-svg w-16 h-24" viewBox="0 0 64 100" fill="currentColor"><path d="M10,90 C20,70 10,40 30,20 C40,10 60,10 60,10 C60,10 50,30 30,50 C10,70 10,90 10,90 Z" opacity="0.8"/><path d="M30,80 C40,60 40,30 50,20 C60,10 60,10 60,10 C60,10 50,20 40,40 C30,60 30,80 30,80 Z" opacity="0.5"/></svg>
          </div>
          <div className="floral-side right hidden sm:block absolute top-1/2 -translate-y-1/2 -right-8 text-[var(--euca)] opacity-45 -scale-x-100">
             <svg className="floral-svg w-16 h-24" viewBox="0 0 64 100" fill="currentColor"><path d="M10,90 C20,70 10,40 30,20 C40,10 60,10 60,10 C60,10 50,30 30,50 C10,70 10,90 10,90 Z" opacity="0.8"/><path d="M30,80 C40,60 40,30 50,20 C60,10 60,10 60,10 C60,10 50,20 40,40 C30,60 30,80 30,80 Z" opacity="0.5"/></svg>
          </div>

          <div className="loc-card bg-[var(--euca)] rounded-3xl py-12 px-9 text-center text-white relative overflow-hidden">
            <div className="absolute w-[200px] h-[200px] border border-white/12 rounded-full -top-[60px] -right-[60px]"></div>
            <div className="absolute w-[140px] h-[140px] border border-white/12 rounded-full -bottom-[40px] -left-[40px]"></div>
            
            <div className="loc-icon w-12 h-12 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-5 relative z-10">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            
            <h3 className="font-serif text-[1.75rem] font-normal mb-1 relative z-10">{VENUE_NAME}</h3>
            <div className="sub text-[0.65rem] uppercase tracking-[0.35em] text-white/70 mb-5 relative z-10">{VENUE_LOCATION}</div>
            
            <div className="loc-divider flex items-center gap-3 my-4 opacity-40 relative z-10">
              <div className="flex-1 h-px bg-white"></div>
              <div className="w-1.5 h-1.5 bg-white rotate-45"></div>
              <div className="flex-1 h-px bg-white"></div>
            </div>

            <p className="meta text-[0.85rem] text-white/90 my-1 relative z-10">{EVENT_DATE_LABEL}</p>
            <p className="meta text-[0.85rem] text-white/90 my-1 relative z-10">{EVENT_TIME_LABEL}</p>
            <p className="loc-puntual text-[0.77rem] text-white/75 italic mt-1 relative z-10">Se agradece puntualidad</p>
            
            <div className="parking inline-flex items-center gap-1.5 bg-white/12 border border-white/20 rounded-full py-1.5 px-4 text-[0.65rem] tracking-[0.2em] uppercase text-white/90 my-4 relative z-10">
              <Car className="w-3.5 h-3.5" />
              Estacionamiento disponible
            </div>
            
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="maps-btn inline-block bg-white text-[var(--euca)] rounded-full py-2.5 px-7 text-[0.75rem] font-semibold tracking-[0.1em] uppercase mt-2 transition-transform hover:-translate-y-0.5 relative z-10">
              Ver en Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ─── ITINERARY ───────────────────────────────────── */}
      <section id="itinerary" className="py-20 px-6 animate-on-scroll">
        <div className="sec-head text-center mb-14">
          <span className="label block mb-3 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--euca)] font-semibold">El desarrollo de nuestro gran día</span>
          <h2 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] text-[var(--carbon)] font-normal">Itinerario</h2>
          <div className="line w-16 h-px bg-[var(--border)] mx-auto mt-4"></div>
        </div>

        <div className="iti-wrap relative max-w-[400px] mx-auto mt-12">
          <div className="iti-line absolute left-1/2 top-0 bottom-0 w-px bg-[var(--euca)]/25 -translate-x-1/2"></div>
          
          <ul className="iti-items list-none p-0 m-0">
            {itineraryItems.map((item, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <li key={idx} className="iti-item relative flex items-center mb-12 last:mb-0">
                  <div className={`iti-left w-1/2 pr-9 text-right ${isLeft ? '' : 'opacity-0'}`}>
                    {isLeft && (
                      <div className="animate-on-scroll">
                        <div className="iti-title font-serif text-[1.05rem] text-[var(--carbon)]">{item.label}</div>
                        <div className="iti-time text-[0.65rem] uppercase tracking-[0.3em] text-[var(--euca)] mt-0.5">{item.time}</div>
                        {item.note && <div className="iti-note text-[0.75rem] text-[var(--muted)] mt-0.5">{item.note}</div>}
                      </div>
                    )}
                  </div>
                  
                  <div className="iti-icon absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[var(--linen)] border border-[var(--euca)] flex items-center justify-center text-[var(--euca)] z-10">
                    <item.Icon className="w-4 h-4" />
                  </div>
                  
                  <div className={`iti-right w-1/2 pl-9 text-left ${!isLeft ? '' : 'opacity-0'}`}>
                    {!isLeft && (
                      <div className="animate-on-scroll">
                        <div className="iti-title font-serif text-[1.05rem] text-[var(--carbon)]">{item.label}</div>
                        <div className="iti-time text-[0.65rem] uppercase tracking-[0.3em] text-[var(--euca)] mt-0.5">{item.time}</div>
                        {item.note && <div className="iti-note text-[0.75rem] text-[var(--muted)] mt-0.5">{item.note}</div>}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        
        <div className="text-center mt-16 font-serif text-[1.1rem] text-[var(--carbon)] animate-on-scroll px-6 italic opacity-85">
          "Y lo más importante: ¡bailar hasta que no puedas más!"
        </div>
      </section>

      {/* ─── EVENT DETAILS ───────────────────────────────── */}
      <section id="details" className="py-20 px-6 bg-[var(--cream)] border-y border-[var(--border)] animate-on-scroll">
        <div className="sec-head text-center mb-14">
          <span className="label block mb-3 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--euca)] font-semibold">Información importante</span>
          <h2 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] text-[var(--carbon)] font-normal">Detalles del evento</h2>
          <div className="line w-16 h-px bg-[var(--border)] mx-auto mt-4"></div>
        </div>

        <div className="detail-grid grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          {protocolCards.map(({ Icon, title, content }) => (
            <div key={title} className="detail-card bg-[var(--linen)] border border-[var(--border)] rounded-[20px] p-7 text-center">
              <div className="d-icon w-12 h-12 bg-[var(--euca)]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--euca)]">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-[0.55rem] uppercase tracking-[0.35em] text-[var(--euca)] font-bold mb-2.5">{title}</h4>
              <div className="text-[0.8rem] text-[var(--muted)] leading-relaxed">
                {content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── RSVP ────────────────────────────────────────── */}
      {guest && !error && (
        <section id="rsvp" className="py-20 px-6 max-w-xl mx-auto animate-on-scroll">
          <div className="sec-head text-center mb-14">
            {/* Ornamental flourish */}
            <svg className="w-16 h-10 text-[var(--euca)] opacity-20 mx-auto mb-3" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M32,38 Q10,30 8,15 Q6,0 32,2 Q58,0 56,15 Q54,30 32,38Z" />
              <path d="M32,30 Q18,25 16,15 Q14,5 32,7 Q50,5 48,15 Q46,25 32,30Z" />
            </svg>
            <span className="label block mb-3 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--euca)] font-semibold">Nos encantaría verte</span>
            <h2 className="font-serif text-[clamp(1.75rem,5vw,2.5rem)] text-[var(--carbon)] font-normal">Confirmación</h2>
            <div className="line w-16 h-px bg-[var(--border)] mx-auto mt-4"></div>
          </div>
          
          <div className="rsvp-card bg-[var(--cream)] border border-[var(--border)] rounded-[28px] p-7 sm:p-10 shadow-[0_8px_48px_rgba(128,150,113,0.08)]">
            <RSVPForm
              guestId={guest.id}
              guestName={guest.name}
              maxPases={guest.pases}
              initialGuest={guest}
              onConfirmed={handleConfirmed}
            />
          </div>
        </section>
      )}

      {showPass && guest?.attending && guest.attendees && guest.attendees > 0 && (
        <section className="py-10 px-6 pb-20 text-center animate-on-scroll">
          <DigitalPass guestName={guest.name} attendees={guest.attendees} attendeeNames={guest.attendeeNames} />
        </section>
      )}

      {/* ─── CLOSING ─────────────────────────────────────── */}
      <section id="closing" className="relative h-[85vh] min-h-[480px] overflow-hidden flex items-end justify-center animate-on-scroll">
        <Image
          src="/couple-closing.jpg"
          alt="Rainier & Guadalupe"
          fill
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="closing-overlay absolute inset-0 bg-gradient-to-t from-[var(--linen)] via-transparent to-transparent"></div>
        <div className="closing-overlay absolute inset-0 bg-gradient-to-t from-[var(--linen)] via-[rgba(245,241,235,0.2)] to-transparent"></div>
        
        <div className="closing-text relative z-10 text-center px-6 pb-16">
          <blockquote className="font-serif text-[1.4rem] italic text-[var(--carbon)] mb-4">
            "Lo mejor está por venir"
          </blockquote>
          <div className="cl-label text-[0.6rem] uppercase tracking-[0.5em] text-[var(--muted)]">Te Esperamos</div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="bg-[#2d2420] text-[#fdfaf5]/70 text-center py-16 px-6">
        <div className="f-names font-serif text-[1.6rem] text-[#fdfaf5]/95 mb-1">Rainier &amp; Guadalupe</div>
        <div className="f-date text-[0.6rem] uppercase tracking-[0.45em] text-[var(--gold)] mb-6">15 de Agosto, 2026</div>
        <div className="f-line w-12 h-px bg-[var(--gold)]/30 mx-auto my-4"></div>
        <div className="f-copy text-[0.65rem] tracking-[0.15em] opacity-40">
          DISEÑADO CON AMOR &middot; &copy; 2026
        </div>
      </footer>
    </>
  )
}
