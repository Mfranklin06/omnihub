// app/login/actions.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// O State precisa ser compatível com useActionState
export type LoginState = {
    error?: string
    success?: boolean
} | null

export async function loginAction(prevState: LoginState, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            cache: 'no-store',
        })

        const data = await res.json()

        if (!res.ok) {
            return { error: data.error || 'Credenciais inválidas' }
        }

        // Grava o cookie
        const cookieStore = await cookies()
        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
        })

        if (data.role) {
            cookieStore.set('role', data.role, { path: '/' })
        }

    } catch (err) {
        return { error: 'Erro de conexão com o servidor' }
    }

    // Redirect fora do try/catch é boa prática no Next.js
    // pois o redirect lança um erro especial
    redirect('/dashboard')
}