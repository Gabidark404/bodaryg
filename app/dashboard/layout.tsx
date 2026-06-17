import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dashboard — Rainier & Guadalupe',
  description: 'Panel de administración de la boda',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ margin: 0, background: '#f8fafc' }}>
        {children}
      </body>
    </html>
  )
}
