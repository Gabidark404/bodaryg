import { Camera, GlassWater, Heart, Music2, Utensils } from 'lucide-react'

const schedule = [
  { time: '4:00 pm',  title: 'Ceremonia',        icon: Heart,      note: 'El Sí Acepto' },
  { time: '4:45 pm',  title: 'Sesión de Fotos',  icon: Camera,     note: 'Retratos Familiares' },
  { time: '5:45 pm',  title: 'Brindis',           icon: GlassWater, note: 'Salud por los novios' },
  { time: '7:30 pm',  title: 'Cena',              icon: Utensils,   note: 'Banquete de Celebración' },
  { time: '12:00 am', title: 'Cierre',            icon: Music2,     note: 'Fin de la velada' },
]

export function Itinerary() {
  return (
    <div className="w-full max-w-md mx-auto py-10 px-4">
      {/* FIX: before, `text-sm` at end was overriding `text-3xl sm:text-4xl` */}
      <div className="text-center mb-12 space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">
          El desarrollo de nuestro gran día
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-foreground">
          Itinerario
        </h2>
        <div className="flex justify-center pt-1">
          <div className="h-px w-16 bg-primary/30" />
        </div>
      </div>

      <div className="relative">
        {/* Vertical centre line */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 -translate-x-1/2 pointer-events-none"
        />

        <ol className="space-y-14">
          {schedule.map((item, index) => {
            const Icon = item.icon
            const isLeft = index % 2 === 0

            return (
              <li key={index} className="relative flex items-center justify-center">
                {/* Centre icon bubble */}
                <div
                  aria-hidden
                  className="absolute left-1/2 -translate-x-1/2 z-10 w-11 h-11 rounded-full bg-background border border-primary/60 shadow-sm flex items-center justify-center text-primary"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>

                {/* Left slot */}
                <div className={`w-1/2 pr-10 text-right ${isLeft ? '' : 'pointer-events-none select-none opacity-0'}`}>
                  {isLeft && <ScheduleText item={item} />}
                </div>

                {/* Right slot */}
                <div className={`w-1/2 pl-10 text-left ${!isLeft ? '' : 'pointer-events-none select-none opacity-0'}`}>
                  {!isLeft && <ScheduleText item={item} />}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function ScheduleText({ item }: { item: (typeof schedule)[number] }) {
  return (
    <div>
      <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
      <p className="text-primary text-xs tracking-widest uppercase mt-0.5">{item.time}</p>
      <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
    </div>
  )
}
