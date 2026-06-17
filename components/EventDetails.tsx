import { Gift, Shirt, Smartphone, Users } from 'lucide-react'
import { PROTOCOL } from '@/lib/constants/event'
import { FloralDivider } from '@/components/FloralOrnaments'

export function EventDetails() {
  return (
    <div className="w-full max-w-lg mx-auto py-12 px-4 space-y-16 text-center">
      
      {/* Dress Code */}
      <div className="space-y-4">
        <h3 className="uppercase tracking-widest text-primary text-sm font-semibold">
          Código de Vestimenta
        </h3>
        <div className="flex justify-center text-muted-foreground mb-4">
          <Shirt className="w-8 h-8 opacity-80" strokeWidth={1.5} />
        </div>
        <p className="text-foreground leading-relaxed">
          {PROTOCOL.dressCode}
        </p>
        <div className="flex justify-center mt-6 text-primary/40">
           <FloralDivider />
        </div>
      </div>

      {/* Regalos */}
      <div className="space-y-4">
        <h3 className="uppercase tracking-widest text-primary text-sm font-semibold">
          Sugerencia de Regalos
        </h3>
        <div className="flex justify-center text-muted-foreground mb-4">
          <Gift className="w-8 h-8 opacity-80" strokeWidth={1.5} />
        </div>
        <p className="text-foreground leading-relaxed">
          {PROTOCOL.gifts}
        </p>
        <div className="flex justify-center mt-6 text-primary/40">
           <FloralDivider />
        </div>
      </div>

      {/* Asistencia (Adults Only) */}
      <div className="space-y-4">
        <h3 className="uppercase tracking-widest text-primary text-sm font-semibold">
          Asistencia
        </h3>
        <div className="flex justify-center text-muted-foreground mb-4">
          <Users className="w-8 h-8 opacity-80" strokeWidth={1.5} />
        </div>
        <p className="text-foreground leading-relaxed">
          {PROTOCOL.adultsOnly}
        </p>
        <div className="flex justify-center mt-6 text-primary/40">
           <FloralDivider />
        </div>
      </div>

      {/* Ceremonia (Phones) */}
      <div className="space-y-4">
        <h3 className="uppercase tracking-widest text-primary text-sm font-semibold">
          Ceremonia
        </h3>
        <div className="flex justify-center text-muted-foreground mb-4">
          <Smartphone className="w-8 h-8 opacity-80" strokeWidth={1.5} />
        </div>
        <p className="text-foreground leading-relaxed">
          {PROTOCOL.phones}
        </p>
      </div>

    </div>
  )
}
