// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // 1. Tenta pegar o token do cookie
    const token = request.cookies.get('token')?.value

    // 2. Define as rotas que queremos proteger
    const dashboardRoutes = request.nextUrl.pathname.startsWith('/dashboard')
    const authRoutes = request.nextUrl.pathname.startsWith('/login')

    // CENÁRIO A: Usuário NÃO logado tentando acessar Dashboard
    if (dashboardRoutes && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // CENÁRIO B: Usuário JÁ logado tentando acessar Login (não precisa, joga pro dashboard)
    if (authRoutes && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

// Configura em quais rotas o middleware deve rodar
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}