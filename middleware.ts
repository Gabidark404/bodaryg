import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD ?? 'boda2026'

export function middleware(request: NextRequest) {
  // Only protect /dashboard routes
  if (!request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const base64 = authHeader.split(' ')[1]
    if (base64) {
      const decoded = Buffer.from(base64, 'base64').toString('utf-8')
      const [, password] = decoded.split(':')
      if (password === DASHBOARD_PASSWORD) {
        return NextResponse.next()
      }
    }
  }

  return new NextResponse('Acceso denegado. Introduce la contraseña.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Dashboard Boda"',
    },
  })
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
