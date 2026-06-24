import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { DashboardSidebar } from '@/components/DashboardSidebar'

export const metadata: Metadata = {
  title: 'Dashboard — Rainier & Guadalupe',
  description: 'Panel de administración de la boda',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardSidebar>
      {children}
    </DashboardSidebar>
  )
}
