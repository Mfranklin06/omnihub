// app/login/page.tsx
'use client'

import { useActionState } from 'react'
import { loginAction } from './actions' // <--- Importando do mesmo diretório

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Antigravity
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">Acesse o sistema administrativo</p>
                </div>

                <form action={formAction} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Validando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}