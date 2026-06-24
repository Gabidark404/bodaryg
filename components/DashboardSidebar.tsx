'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { name: 'Tabla Principal', href: '/dashboard', icon: '📊' },
    { name: 'Gestión de Canciones', href: '/dashboard/canciones', icon: '🎵' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Mobile Topbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        ...({} /* En PC lo ocultamos con media query, pero en estilos en línea es complicado. Usaremos una clase CSS o lo dejaremos así y en PC el sidebar queda debajo. Mejor lo hacemos limpio */)
      }} className="mobile-topbar">
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <h1 style={{ margin: '0 0 0 16px', fontSize: 18, fontWeight: 600, color: '#111827' }}>
          Dashboard
        </h1>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 45,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: 260,
          background: '#fff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#111827' }}>
              🌸 Boda R&G
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>
              Panel de Administración
            </p>
          </div>
          {/* Close button only visible on mobile via css */}
          <button
            className="mobile-close-btn"
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0 16px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 8,
                      textDecoration: 'none',
                      color: isActive ? '#0f766e' : '#4b5563',
                      background: isActive ? '#f0fdf4' : 'transparent',
                      fontWeight: isActive ? 600 : 500,
                      transition: 'background 0.2s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#374151',
              fontWeight: 500,
              fontSize: 14,
              justifyContent: 'center',
              background: '#fafafa',
            }}
          >
            🔗 Ver Invitación
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content" style={{ flex: 1 }}>
        <div style={{
          padding: '24px',
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          {children}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Mobile overrides */
        @media (min-width: 769px) {
          .mobile-topbar { display: none !important; }
          .mobile-close-btn { display: none !important; }
          .sidebar-backdrop { display: none !important; }
          .sidebar { transform: translateX(0) !important; }
          .main-content { margin-left: 260px; }
        }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
          .main-content { margin-top: 64px; }
        }
      `}} />
    </div>
  )
}
