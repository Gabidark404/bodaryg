import { Suspense } from 'react'
import { InvitationContent } from '@/components/InvitationContent'
import { getGuestById } from '@/lib/guests-service'

function InvitationSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground animate-pulse">Cargando invitación...</p>
    </div>
  )
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const initialGuest = id ? getGuestById(id) : null

  return (
    <Suspense fallback={<InvitationSkeleton />}>
      <InvitationContent guestId={id} initialGuest={initialGuest} />
    </Suspense>
  )
}
